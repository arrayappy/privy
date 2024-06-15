use crate::db::models;

use diesel::prelude::*;

use self::models::{NewUser, UpdatedUser, User};
use crate::db::schema::usernames::dsl::*;

pub fn get_user_row_by_addr(
    conn: &mut PgConnection,
    addr: &str
) -> Option<User> {
    usernames
        .filter(user_addr.eq(addr))
        .first(conn)
        .optional()
        .expect("Error loading user")
}

pub fn get_user_by_row_name(
    conn: &mut PgConnection,
    name: &str
) -> Option<User> {
    usernames
        .filter(user_name.eq(name))
        .first(conn)
        .optional()
        .expect("Error getting user by addr")
}

pub fn create_user_row(
    conn: &mut PgConnection,
    new_user: NewUser
) -> usize {
    diesel::insert_into(usernames)
        .values(&new_user)
        .execute(conn)
        .expect("Error saving new user")
}

pub fn update_user_row(
    conn: &mut PgConnection,
    _user_addr: &str,
    updated_user: UpdatedUser
) -> usize {
    diesel::update(usernames.filter(user_addr.eq(_user_addr)))
        .set(&updated_user)
        .execute(conn)
        .expect("Error updating user")
}

pub fn delete_user_row(
    conn: &mut PgConnection,
    addr: &str
) -> QueryResult<usize> {
    diesel::delete(usernames.filter(user_addr.eq(addr)))
        .execute(conn)
}