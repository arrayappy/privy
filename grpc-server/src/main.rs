use tonic::{transport::Server, Request, Response, Status};

use privy::privy_service_server::{PrivyService, PrivyServiceServer};
use privy::{GetUserByAddrReq, GetUserByNameReq, GetUserRes, InsertMessageToUserReq, InsertMessageToUserRes};

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
        println!("Got a request: {:?}", request);

        let response: GetUserRes = privy::GetUserRes {
            user_addr: "0x1".to_string(),
            user_name: "user".to_string(),
            created_at: "date1".to_string(),
            updated_at: "date2".to_string()
        };

        Ok(Response::new(response))
    }

    async fn get_user_by_name(
        &self,
        request: Request<GetUserByNameReq>,
    ) -> Result<Response<GetUserRes>, Status> {
        println!("Got a request by name: {:?}", request);

        let response = GetUserRes {
            user_addr: "0x1".to_string(),
            user_name: request.into_inner().user_name,
            created_at: "date1".to_string(),
            updated_at: "date2".to_string(),
        };

        Ok(Response::new(response))
    }

    async fn insert_message_to_user(
        &self,
        request: Request<InsertMessageToUserReq>,
    ) -> Result<Response<InsertMessageToUserRes>, Status> {
        let req = request.into_inner();
        println!("Inserting message to user: {:?}", req);

        // Implement your logic here. For now, we'll just log the message.
        println!("Message '{}' has been inserted for user '{}'", req.message, req.user_name);

        let response = InsertMessageToUserRes {
            success: true,
        };

        Ok(Response::new(response))
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