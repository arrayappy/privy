use std::str::FromStr;

use anchor_client::solana_sdk::pubkey::Pubkey;

use chrono::Utc;
use db::models::{NewUser, UpdatedUser};
use tonic::{transport::Server, Request, Response, Status};

use privy::privy_service_server::{PrivyService, PrivyServiceServer};
use privy::{
    GetUserByAddrReq, 
    GetUserByNameReq, 
    GetUserRes,
    InsertMessageReq, 
    CreateOrUpdateUserReq,
    DeleteUserReq,
    SuccessRes,
};

mod db;
use db::connection::establish_connection;
use db::service::{
    get_user_row_by_addr,
    get_user_by_row_name,
    create_user_row,
    delete_user_row,
    update_user_row
};

mod solana;
use solana::client::insert_message_anchor;

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

    async fn insert_message(
        &self,
        request: Request<InsertMessageReq>,
    ) -> Result<Response<SuccessRes>, Status> {
        let req = request.into_inner();
        println!("Message '{}' has been inserted for user '{}'", &req.message, &req.user_addr);
        let user_addr: Pubkey = Pubkey::from_str("rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr").unwrap();
        println!("i1");
        insert_message_anchor(&user_addr).await.map_err(|e| Status::internal(e.to_string()))?;
        println!("i2");
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

// use std::str::FromStr;

// use anchor_client::solana_sdk::pubkey::Pubkey;
// use solana::client::insert_message_anchor;
// mod solana;

// #[tokio::main]
// async fn main() -> Result<(), Box<dyn std::error::Error>> {
//     // let user_addr = Pubkey::new_unique();
//     let user_addr: Pubkey = Pubkey::from_str("rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr")?;
//     insert_message_anchor(&user_addr).await?;
//     println!("Message inserted successfully");
//     Ok(())
// }