use std::str::FromStr;
use std::thread;

use anchor_client::solana_sdk::pubkey::Pubkey;

use chrono::Utc;
use tonic::{transport::Server, Request, Response, Status};

use privy::privy_service_server::{PrivyService, PrivyServiceServer};
use privy::{
    GetUserByAddrReq, 
    GetUserByNameReq, 
    GetUserRes,
    GetUserReq,
    InsertMessageReq, 
    CreateOrUpdateUserReq,
    DeleteUserReq,
    SuccessRes,
};

mod db;
use db::models::{NewUser, UpdatedUser};
use db::connection::establish_connection;
use db::service::{
    append_fingerprint, create_user_row, delete_user_row, get_fingerprint_categories, get_user_by_row_name, update_user_row
};

mod solana;
use solana::client::{
    insert_message_to_pda,
    get_user_pda_account
};


pub mod privy {
    tonic::include_proto!("privy");
}

#[derive(Debug, Default)]
pub struct MyPrivyService {}

#[tonic::async_trait]
impl PrivyService for MyPrivyService {
    async fn get_user_by_addr(
        &self,
        request: Request<GetUserByAddrReq>,
    ) -> Result<Response<GetUserRes>, Status> {
        let req = request.into_inner();
        println!("Got a request by addr: {:?}", req);

        let mut connection = establish_connection();

        match get_user_row_by_addr(&mut connection, &req.user_addr) {
          Some(user) => {
              let user_res = GetUserRes {
                  user_addr: user.user_addr,
                  user_name: user.user_name,
                  created_at: user.created_at.to_string(),
                  updated_at: user.updated_at.to_string(),
              };
              Ok(Response::new(user_res))
          },
          None => Err(Status::not_found("User not found")),
      }
    }

    async fn get_user_by_name(
        &self,
        request: Request<GetUserByNameReq>,
    ) -> Result<Response<GetUserRes>, Status> {
        let req = request.into_inner();
        println!("Got a request by name: {:?}", req);

        let mut connection = establish_connection();

        match get_user_by_row_name(&mut connection, &req.user_name) {
          Some(user) => {
              let user_res = GetUserRes {
                  user_addr: user.user_addr,
                  user_name: user.user_name,
                  created_at: user.created_at.to_string(),
                  updated_at: user.updated_at.to_string(),
              };
              Ok(Response::new(user_res))
          },
          None => Err(Status::not_found("User not found")),
        }
    }

    async fn get_user(
        &self,
        request: Request<GetUserReq>,
    ) -> Result<Response<GetUserRes>, Status> {
        let req = request.into_inner();
        println!("Got a request by name: {:?}", req);

        let mut connection = establish_connection();

        let user_row =  get_user_by_row_name(&mut connection, &req.user_name)
            .ok_or_else(|| Status::not_found(format!("User not found: {}", req.user_name)))?;

        let fingerprint_categories = get_fingerprint_categories(&mut connection, &req.fingerprint_id)
            .unwrap_or((String::new(), Vec::new()));

        let user_pub_key: Pubkey = Pubkey::from_str(&user_row.user_addr).unwrap();

        // let user_pda = thread::spawn(move || {
        //         get_user_pda_account(&user_pub_key)
        // }).join().expect("Thread panicked").unwrap();

        let user_pda = match thread::spawn(move || {
            get_user_pda_account(&user_pub_key)
        }).join() {
            Ok(result) => match result {
                Ok(pda) => pda,
                Err(_) => return Err(Status::internal("User not found")),
            },
            Err(_) => return Err(Status::internal("Thread panicked")),
        };

        // let category = user_pda.categories[req.cat_idx];
        //     - if user_pda && user_pda.tokens_left && category.enabled && (category.single_msg true but not found in fingerprints or single_msg false)
        //     - Return addr, passkey_enabled (send true if exists else false),
        //     - else
        //     - tokens_left, enabled, single_msg - for client side errors
        
        let category_option = user_pda.categories.get(req.cat_idx.clone() as usize);
        if let Some(Some(category)) = category_option {
            if user_pda.token_limit <= 0 {
                return Err(Status::permission_denied("User token limit exceeded"));
            }
    
            if !category.enabled {
                return Err(Status::permission_denied("Category not enabled"));
            }
    
            if category.single_msg && fingerprint_categories.1.contains(&format!("{}_{}", user_row.user_addr, &req.cat_idx)) {
                return Err(Status::permission_denied("Single message already sent for this category"));
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
        
        let _ = thread::spawn(move || {
            insert_message_to_pda(&user_addr, req.cat_idx, req.message, req.passkey)
        }).join().expect("Thread panicked");

        append_fingerprint(&mut connection, &req.fingerprint_id, format!("{}_{}", req.user_addr, req.cat_idx));

        let response = SuccessRes {
            success: true,
        };

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

        let new_user = NewUser {
            user_addr: &req.user_addr,
            user_name: &req.user_name,
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
            user_name: &req.user_name,
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

    // async fn fingerprint_test(
    //     &self,
    //     _request: Request<EmptyReq>,
    // ) -> Result<Response<SuccessRes>, Status> {
    //     let mut connection = establish_connection();
    //     let fingerprint_id = "test_fingerprint_id2";
    //     let new_category = "test_category3";

    //     // Append a fingerprint
    //     append_fingerprint(&mut connection, fingerprint_id, new_category.to_string());

    //     // Get the updated fingerprint
    //     let result = get_fingerprint(&mut connection, fingerprint_id);

    //     match result {
    //         Some((_id, categories)) => {
    //             println!("Updated categories: {:?}", categories);
    //             Ok(Response::new(SuccessRes { success: true }))
    //         }
    //         None => Err(Status::internal("Failed to retrieve fingerprint")),
    //     }
    // }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:3000".parse().unwrap();
    let privy_service: MyPrivyService = MyPrivyService::default();

    Server::builder()
        .add_service(PrivyServiceServer::new(privy_service))
        .serve(addr)
        .await?;

    Ok(())
}