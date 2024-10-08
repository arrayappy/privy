use std::env;
use std::str::FromStr;
use std::thread;

use std::net::SocketAddr;

use serde;
use serde_json;
use serde::Deserialize;

use anchor_client::solana_sdk::pubkey::Pubkey;

use chrono::Utc;
use tonic::{transport::Server as TServer, Request as TRequest, Response as TResponse, Status};

use privy::privy_service_server::{PrivyService, PrivyServiceServer};
use privy::{
    CheckUsernameExistReq, CreateOrUpdateUserReq, DeleteUserReq, GetUserReq, GetUserRes,
    InsertMessageReq, SuccessRes
};

mod db;
use db::connection::establish_connection;
use db::models::{User, UpdatedUser};
use db::service::{
    append_fingerprint, create_user_row, delete_user_row, get_fingerprint_categories,
    get_user_row_by_name, get_user_row_by_addr, update_user_row,
};

mod solana;
use solana::client::{get_user_pda_account, insert_message_to_pda};

mod encryption;
use encryption::service::decompress_and_decrypt;

#[derive(Deserialize, Debug)]
pub struct Category {
    pub cat_name: String,
    pub passkey: String,
    pub enabled: bool,
    pub single_msg: bool,
}

pub mod privy {
    tonic::include_proto!("privy");
}

#[derive(Debug, Default)]
pub struct MyPrivyService {}

#[tonic::async_trait]
impl PrivyService for MyPrivyService {
    async fn get_user(&self, request: TRequest<GetUserReq>) -> Result<TResponse<GetUserRes>, Status> {
        let req = request.into_inner();
        println!("Got a request by name: {:?}", req);

        let mut connection = establish_connection();

        let user_row = get_user_row_by_name(&mut connection, &req.user_name)
            .ok_or_else(|| Status::not_found(format!("User not found: {}", req.user_name)))?;

        let fingerprint_categories =
            get_fingerprint_categories(&mut connection, &req.fingerprint_id)
                .unwrap_or((String::new(), Vec::new()));

        let user_pub_key: Pubkey = Pubkey::from_str(&user_row.user_addr).unwrap();

        let user_pda = match thread::spawn(move || get_user_pda_account(&user_pub_key)).join() {
            Ok(result) => match result {
                Ok(pda) => pda,
                Err(_) => return Err(Status::internal("User not found")),
            },
            Err(_) => return Err(Status::internal("Thread panicked")),
        };

        let password_salt = user_row.password_salt;
        let iv = b"anexampleiv12345";

        let categories: Vec<Category> = serde_json::from_str(&decompress_and_decrypt(&user_pda.categories, &password_salt, iv)).unwrap();
        let category_index = req.cat_idx as usize;

        let category_option = categories.get(category_index);
        if let Some(category) = category_option {
            if user_pda.token_limit <= 0 {
                return Err(Status::permission_denied("User token limit exceeded"));
            }
    
            if !category.enabled {
                return Err(Status::permission_denied("Category not enabled"));
            }
    
            if category.single_msg
                && fingerprint_categories
                    .1
                    .contains(&format!("{}_{}", user_row.user_addr, req.cat_idx))
            {
                return Err(Status::permission_denied(
                    "Single message already sent for this category",
                ));
            }
    
            let success_response = GetUserRes {
                user_addr: user_row.user_addr,
                passkey_enabled: !category.passkey.is_empty(),
            };
            Ok(TResponse::new(success_response))
        } else {
            Err(Status::not_found("Category not found"))
        }
    }

    async fn insert_message(
        &self,
        request: TRequest<InsertMessageReq>,
    ) -> Result<TResponse<SuccessRes>, Status> {
        let req = request.into_inner();

        let mut connection = establish_connection();

        let user_addr = Pubkey::from_str(&req.user_addr).unwrap();

        let user_row = get_user_row_by_addr(&mut connection, &req.user_addr)
            .ok_or_else(|| Status::not_found(format!("User not found: {}", req.user_addr)))?;

        let password_salt = user_row.password_salt;
        let iv = b"anexampleiv12345";

        let user_pda = match thread::spawn(move || get_user_pda_account(&user_addr)).join() {
            Ok(result) => match result {
                Ok(pda) => pda,
                Err(_) => return Err(Status::internal("User not found")),
            },
            Err(_) => return Err(Status::internal("Thread panicked")),
        };

        if user_pda.token_limit <= 0 {
            return Err(Status::permission_denied("User token limit exceeded"));
        }

        let categories: Vec<Category> = serde_json::from_str(&decompress_and_decrypt(&user_pda.categories, &password_salt, iv)).unwrap();
        let category_index = req.cat_idx as usize;

        if category_index >= categories.len() {
            return Err(Status::not_found("Invalid category index"));
        }
        let category = match categories.get(category_index) {
            Some(cat) => cat,
            None => return Err(Status::not_found("Category not found")),
        };

        if !category.enabled {
            return Err(Status::permission_denied("Category disabled"));
        }
    
        if !category.passkey.is_empty() && category.passkey != req.passkey {
            return Err(Status::permission_denied("Invalid passkey"));
        }
        
        let _ = thread::spawn(move || {
            insert_message_to_pda(&user_addr, req.encrypted_msg)
        })
        .join()
        .expect("Thread panicked");

        append_fingerprint(
            &mut connection,
            &req.fingerprint_id,
            format!("{}_{}", req.user_addr, req.cat_idx),
        );

        let response = SuccessRes { success: true };

        Ok(TResponse::new(response))
    }

    async fn create_user(
        &self,
        request: TRequest<CreateOrUpdateUserReq>,
    ) -> Result<TResponse<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to create user({}): {:?}", req.user_name, req);

        let mut connection = establish_connection();
        let now = Utc::now().naive_utc();

        let new_user = User {
            user_addr: req.user_addr,
            user_name: req.user_name,
            password_salt: req.password_salt,
            password_pubkey: req.password_pubkey,
            created_at: now,
            updated_at: now,
        };

        match create_user_row(&mut connection, new_user) {
            1 => Ok(TResponse::new(SuccessRes { success: true })),
            _ => Err(Status::internal("Failed to create user")),
        }
    }

    async fn update_user(
        &self,
        request: TRequest<CreateOrUpdateUserReq>,
    ) -> Result<TResponse<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to update user: {:?}", req);

        let mut connection = establish_connection();
        let now = Utc::now().naive_utc();

        let updated_user = UpdatedUser {
            user_name: req.user_name,
            password_salt: req.password_salt,
            updated_at: now,
        };

        match update_user_row(&mut connection, &req.user_addr, updated_user) {
            1 => Ok(TResponse::new(SuccessRes { success: true })),
            _ => Err(Status::internal("Failed to update user")),
        }
    }

    async fn delete_user(
        &self,
        request: TRequest<DeleteUserReq>,
    ) -> Result<TResponse<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to delete user: {:?}", req);

        let mut connection = establish_connection();

        match delete_user_row(&mut connection, &req.user_addr) {
            Ok(1) => Ok(TResponse::new(SuccessRes { success: true })),
            Ok(_) => Err(Status::internal("Failed to delete user")),
            Err(_) => Err(Status::internal("Failed to delete user")),
        }
    }
    async fn check_username_exist(
        &self,
        request: TRequest<CheckUsernameExistReq>,
    ) -> Result<TResponse<SuccessRes>, Status> {
        let req = request.into_inner();
        let mut connection = establish_connection();

        match get_user_row_by_name(&mut connection, &req.user_name) {
            Some(_) => Ok(TResponse::new(SuccessRes { success: true })),
            None => Ok(TResponse::new(SuccessRes { success: false })),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let port: String = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{}", port).parse()?;

    let privy_service = MyPrivyService::default();
    let privy_service = PrivyServiceServer::new(privy_service);
    let privy_service = tonic_web::enable(privy_service);
    
    let (mut health_reporter, health_service) = tonic_health::server::health_reporter();
    health_reporter
        .set_serving::<PrivyServiceServer<MyPrivyService>>()
        .await;

    println!("Running on {}...", addr);
    TServer::builder()
        .accept_http1(true)
        .add_service(health_service)
        .add_service(privy_service)
        .serve(addr)
        .await?;

    Ok(())
}