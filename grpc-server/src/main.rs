use std::str::FromStr;
use std::thread;

use serde;
use serde_json;
use serde::Deserialize;

use anchor_client::solana_sdk::pubkey::Pubkey;

use chrono::Utc;
use tonic::{transport::Server, Request, Response, Status};

use privy::privy_service_server::{PrivyService, PrivyServiceServer};
use privy::{
    CheckUsernameExistReq, CreateOrUpdateUserReq, DeleteUserReq, GetUserReq, GetUserRes,
    InsertMessageReq, SuccessRes, EmptyReq
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
use encryption::service::{
    compress_and_encrypt,
    decompress_and_decrypt
};

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
    async fn get_user(&self, request: Request<GetUserReq>) -> Result<Response<GetUserRes>, Status> {
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

        let secret = user_row.secret;
        let iv = b"anexampleiv12345";

        let categories: Vec<Category> = serde_json::from_str(&decompress_and_decrypt(&user_pda.categories, &secret, iv)).unwrap();
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
            Ok(Response::new(success_response))
        } else {
            Err(Status::not_found("Category not found"))
        }
    }

    async fn insert_message(
        &self,
        request: Request<InsertMessageReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();

        let mut connection = establish_connection();

        let user_addr = Pubkey::from_str(&req.user_addr).unwrap();

        let user_row = get_user_row_by_addr(&mut connection, &req.user_addr)
            .ok_or_else(|| Status::not_found(format!("User not found: {}", req.user_addr)))?;

        let secret = user_row.secret;
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

        let categories: Vec<Category> = serde_json::from_str(&decompress_and_decrypt(&user_pda.categories, &secret, iv)).unwrap();
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
    
        println!("{}", &user_pda.messages);
        let mut messages: Vec<String> = serde_json::from_str(&decompress_and_decrypt(&user_pda.messages, &secret, iv)).unwrap();

        messages.push(format!("{}:{}", &category_index, &req.message));

        let encrypted_msgs = compress_and_encrypt(&serde_json::to_string(&messages).unwrap(), &secret, iv);

        let _ = thread::spawn(move || {
            insert_message_to_pda(&user_addr, encrypted_msgs)
        })
        .join()
        .expect("Thread panicked");

        append_fingerprint(
            &mut connection,
            &req.fingerprint_id,
            format!("{}_{}", req.user_addr, req.cat_idx),
        );

        let response = SuccessRes { success: true };

        Ok(Response::new(response))
    }

    async fn create_user(
        &self,
        request: Request<CreateOrUpdateUserReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to create user({}): {:?}", req.user_name, req);

        let mut connection = establish_connection();
        let now = Utc::now().naive_utc();

        let new_user = User {
            user_addr: req.user_addr,
            user_name: req.user_name,
            secret: req.secret,
            created_at: now,
            updated_at: now,
        };

        match create_user_row(&mut connection, new_user) {
            1 => Ok(Response::new(SuccessRes { success: true })),
            _ => Err(Status::internal("Failed to create user")),
        }
    }

    async fn update_user(
        &self,
        request: Request<CreateOrUpdateUserReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to update user: {:?}", req);

        let mut connection = establish_connection();
        let now = Utc::now().naive_utc();

        let updated_user = UpdatedUser {
            user_name: req.user_name,
            secret: req.secret,
            updated_at: now,
        };

        match update_user_row(&mut connection, &req.user_addr, updated_user) {
            1 => Ok(Response::new(SuccessRes { success: true })),
            _ => Err(Status::internal("Failed to update user")),
        }
    }

    async fn delete_user(
        &self,
        request: Request<DeleteUserReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Got a request to delete user: {:?}", req);

        let mut connection = establish_connection();

        match delete_user_row(&mut connection, &req.user_addr) {
            Ok(1) => Ok(Response::new(SuccessRes { success: true })),
            Ok(_) => Err(Status::internal("Failed to delete user")),
            Err(_) => Err(Status::internal("Failed to delete user")),
        }
    }
    async fn check_username_exist(
        &self,
        request: Request<CheckUsernameExistReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();
        let mut connection = establish_connection();

        match get_user_row_by_name(&mut connection, &req.user_name) {
            Some(_) => Ok(Response::new(SuccessRes { success: true })),
            None => Ok(Response::new(SuccessRes { success: false })),
        }
    }
    async fn health_check(
        &self,
        _request: Request<EmptyReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let response = SuccessRes { success: true };
        Ok(Response::new(response))
    }
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:3000".parse().unwrap();
    let privy_service: MyPrivyService = MyPrivyService::default();
    println!("Server listening on {}", addr);
    Server::builder()
        .add_service(PrivyServiceServer::new(privy_service))
        .serve(addr)
        .await?;
    Ok(())
}