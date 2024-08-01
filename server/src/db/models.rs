use crate::db::schema::{fingerprints, users};
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

// User structs
#[derive(Queryable, Selectable, Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub user_addr: String,
    pub user_name: String,
    pub password_salt: String,
    pub password_pubkey: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = users)]
pub struct UpdatedUser {
    pub user_name: String,
    pub password_salt: String,
    pub updated_at: NaiveDateTime,
}

// Fingerprint structs
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
    pub user_categories: String,
}
