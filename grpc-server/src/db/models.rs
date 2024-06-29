use serde::{Deserialize, Serialize};
use crate::db::schema::{
    usernames, 
    fingerprints
};
use chrono::NaiveDateTime;
use diesel::prelude::*;

// User structs
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

// // Fingerprint structs

#[derive(Queryable, Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = fingerprints)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Fingerprint {
    pub id: String,
    pub user_categories: String,
}

impl Fingerprint {
    pub fn from_user_categories_vec(id: String, user_categories: Vec<String>) -> Self {
        Fingerprint {
            id,
            user_categories: serde_json::to_string(&user_categories).unwrap(),
        }
    }

    pub fn to_user_categories_vec(&self) -> Vec<String> {
        serde_json::from_str(&self.user_categories).unwrap()
    }
}


#[derive(AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = fingerprints)]
pub struct UpdateFingerprint {
    pub user_categories: String
}