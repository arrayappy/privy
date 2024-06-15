use serde::{Deserialize, Serialize};
use crate::db::schema::usernames;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable, Deserialize, Serialize)]
#[diesel(table_name = usernames)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub user_addr: String,
    pub user_name: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = usernames)]
pub struct NewUser<'a> {
    pub user_addr: &'a str,
    pub user_name: &'a str,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = usernames)]
pub struct UpdatedUser<'a> {
    pub user_name: &'a str,
    pub updated_at: NaiveDateTime
}
