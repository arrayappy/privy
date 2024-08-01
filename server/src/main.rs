use std::env;
use std::str::FromStr;
use std::thread;

use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};

use anchor_client::solana_sdk::pubkey::Pubkey;
use chrono::Utc;

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

// Request and Response structs
#[derive(Deserialize, Debug)]
struct GetUserReq {
    user_name: String,
    cat_idx: u32,
    fingerprint_id: String,
}

#[derive(Serialize)]
struct GetUserRes {
    user_addr: String,
    passkey_enabled: bool,
}

#[derive(Deserialize, Debug)]
struct InsertMessageReq {
    user_addr: String,
    cat_idx: u32,
    encrypted_msg: String,
    passkey: String,
    fingerprint_id: String,
}

#[derive(Deserialize, Debug)]
struct CreateOrUpdateUserReq {
    user_addr: String,
    user_name: String,
    password_salt: String,
    password_pubkey: String,
}

#[derive(Deserialize, Debug)]
struct DeleteUserReq {
    user_addr: String,
}

#[derive(Serialize)]
struct SuccessRes {
    success: bool,
}

#[derive(Deserialize, Debug)]
struct CheckUsernameExistReq {
    user_name: String,
}

// Handler functions
async fn get_user(req: web::Json<GetUserReq>) -> impl Responder {
    let mut connection = establish_connection();

    let user_row = match get_user_row_by_name(&mut connection, &req.user_name) {
        Some(user) => user,
        None => return HttpResponse::NotFound().json(format!("User not found: {}", req.user_name)),
    };

    let fingerprint_categories = get_fingerprint_categories(&mut connection, &req.fingerprint_id)
        .unwrap_or((String::new(), Vec::new()));

    let user_pub_key = match Pubkey::from_str(&user_row.user_addr) {
        Ok(key) => key,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let user_pda = match thread::spawn(move || get_user_pda_account(&user_pub_key)).join() {
        Ok(Ok(pda)) => pda,
        _ => return HttpResponse::InternalServerError().body("User not found"),
    };

    let password_salt = user_row.password_salt;
    let iv = b"anexampleiv12345";

    let categories: Vec<Category> = serde_json::from_str(
        &decompress_and_decrypt(&user_pda.categories, &password_salt, iv)
    ).unwrap();
    
    let category = match categories.get(req.cat_idx as usize) {
        Some(cat) => cat,
        None => return HttpResponse::NotFound().body("Category not found"),
    };

    if user_pda.token_limit <= 0 {
        return HttpResponse::Forbidden().body("User token limit exceeded");
    }

    if !category.enabled {
        return HttpResponse::Forbidden().body("Category not enabled");
    }

    if category.single_msg
        && fingerprint_categories
            .1
            .contains(&format!("{}_{}", user_row.user_addr, req.cat_idx))
    {
        return HttpResponse::Forbidden().body("Single message already sent for this category");
    }

    HttpResponse::Ok().json(GetUserRes {
        user_addr: user_row.user_addr,
        passkey_enabled: !category.passkey.is_empty(),
    })
}

async fn insert_message(req: web::Json<InsertMessageReq>) -> impl Responder {
    let mut connection = establish_connection();

    let user_addr = match Pubkey::from_str(&req.user_addr) {
        Ok(addr) => addr,
        Err(_) => return HttpResponse::BadRequest().body("Invalid user address"),
    };

    let user_row = match get_user_row_by_addr(&mut connection, &req.user_addr) {
        Some(user) => user,
        None => return HttpResponse::NotFound().json(format!("User not found: {}", req.user_addr)),
    };

    let password_salt = user_row.password_salt;
    let iv = b"anexampleiv12345";

    let user_pda = match thread::spawn(move || get_user_pda_account(&user_addr)).join() {
        Ok(Ok(pda)) => pda,
        _ => return HttpResponse::InternalServerError().body("User not found"),
    };

    if user_pda.token_limit <= 0 {
        return HttpResponse::Forbidden().body("User token limit exceeded");
    }

    let categories: Vec<Category> = serde_json::from_str(
        &decompress_and_decrypt(&user_pda.categories, &password_salt, iv)
    ).unwrap();

    let category = match categories.get(req.cat_idx as usize) {
        Some(cat) => cat,
        None => return HttpResponse::NotFound().body("Category not found"),
    };

    if !category.enabled {
        return HttpResponse::Forbidden().body("Category disabled");
    }

    if !category.passkey.is_empty() && category.passkey != req.passkey {
        return HttpResponse::Forbidden().body("Invalid passkey");
    }

    // Clone the values needed in the thread
    let encrypted_msg = req.encrypted_msg.clone();
    let fingerprint_id = req.fingerprint_id.clone();
    let cat_idx = req.cat_idx;
    let user_addr_str = req.user_addr.clone();

    if let Err(_) = thread::spawn(move || {
        insert_message_to_pda(&user_addr, encrypted_msg)
    })
    .join()
    {
        return HttpResponse::InternalServerError().body("Failed to insert message");
    }

    append_fingerprint(
        &mut connection,
        &fingerprint_id,
        format!("{}_{}", user_addr_str, cat_idx),
    );

    HttpResponse::Ok().json(SuccessRes { success: true })
}

async fn create_user(req: web::Json<CreateOrUpdateUserReq>) -> impl Responder {
    println!("Got a request to create user({}): {:?}", req.user_name, req);

    let mut connection = establish_connection();
    let now = Utc::now().naive_utc();

    let new_user = User {
        user_addr: req.user_addr.clone(),
        user_name: req.user_name.clone(),
        password_salt: req.password_salt.clone(),
        password_pubkey: req.password_pubkey.clone(),
        created_at: now,
        updated_at: now,
    };

    match create_user_row(&mut connection, new_user) {
        1 => HttpResponse::Ok().json(SuccessRes { success: true }),
        _ => HttpResponse::InternalServerError().body("Failed to create user"),
    }
}

async fn update_user(req: web::Json<CreateOrUpdateUserReq>) -> impl Responder {
    println!("Got a request to update user: {:?}", req);

    let mut connection = establish_connection();
    let now = Utc::now().naive_utc();

    let updated_user = UpdatedUser {
        user_name: req.user_name.clone(),
        password_salt: req.password_salt.clone(),
        updated_at: now,
    };

    match update_user_row(&mut connection, &req.user_addr, updated_user) {
        1 => HttpResponse::Ok().json(SuccessRes { success: true }),
        _ => HttpResponse::InternalServerError().body("Failed to update user"),
    }
}

async fn delete_user(req: web::Json<DeleteUserReq>) -> impl Responder {
    println!("Got a request to delete user: {:?}", req);

    let mut connection = establish_connection();

    match delete_user_row(&mut connection, &req.user_addr) {
        Ok(1) => HttpResponse::Ok().json(SuccessRes { success: true }),
        _ => HttpResponse::InternalServerError().body("Failed to delete user"),
    }
}

async fn check_username_exist(req: web::Json<CheckUsernameExistReq>) -> impl Responder {
    let mut connection = establish_connection();

    match get_user_row_by_name(&mut connection, &req.user_name) {
        Some(_) => HttpResponse::Ok().json(SuccessRes { success: true }),
        None => HttpResponse::Ok().json(SuccessRes { success: false }),
    }
}

// Add this new handler function before main()
async fn status() -> impl Responder {
    HttpResponse::Ok().json(SuccessRes { success: true })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);

    println!("Running on port {}...", port);

    HttpServer::new(|| {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .route("/status", web::get().to(status))  // Add the status endpoint
            .route("/get_user", web::post().to(get_user))
            .route("/insert_message", web::post().to(insert_message))
            .route("/create_user", web::post().to(create_user))
            .route("/update_user", web::post().to(update_user))
            .route("/delete_user", web::post().to(delete_user))
            .route("/check_username_exist", web::post().to(check_username_exist))
    })
    .bind(addr)?
    .run()
    .await
}
