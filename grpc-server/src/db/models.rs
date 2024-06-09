use crate::db::schema::usernames;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = usernames)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub user_addr: String,
    pub user_name: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = usernames)]
pub struct NewUser<'a> {
    pub user_addr: &'a str,
    pub user_name: &'a str,
    pub created_at: &'a NaiveDateTime,
    pub updated_at: &'a NaiveDateTime,
}

#[derive(AsChangeset)]
#[diesel(table_name = usernames)]
pub struct UpdatedUser<'a> {
    pub user_name: &'a str,
    pub updated_at: &'a NaiveDateTime
}
