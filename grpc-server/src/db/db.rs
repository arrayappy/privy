use crate::db::models;

use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

use self::models::{NewUser, UpdatedUser, User};
use crate::db::schema::usernames::dsl::*;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_user(
    conn: &mut PgConnection,
    new_user: NewUser
) -> usize {
    diesel::insert_into(usernames)
        .values(&new_user)
        .execute(conn)
        .expect("Error saving new user")
}

pub fn get_all_users(conn: &mut PgConnection) -> Vec<User> {
    usernames.load::<User>(conn)
        .expect("Error loading users")
}

pub fn update_user(
    conn: &mut PgConnection,
    _user_addr: &str,
    updated_user: UpdatedUser
) -> usize {
    diesel::update(usernames.filter(user_addr.eq(_user_addr)))
        .set(&updated_user)
        .execute(conn)
        .expect("Error updating user")
}

pub fn delete_user(conn: &mut PgConnection, addr: &str) -> QueryResult<usize> {
    diesel::delete(usernames.filter(user_addr.eq(addr)))
        .execute(conn)
}
