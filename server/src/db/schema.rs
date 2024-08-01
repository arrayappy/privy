// @generated automatically by Diesel CLI.

diesel::table! {
    fingerprints (id) {
        id -> Varchar,
        user_categories -> Varchar,
    }
}

diesel::table! {
    users (user_addr) {
        user_addr -> Varchar,
        user_name -> Varchar,
        password_salt -> Varchar,
        password_pubkey -> Varchar,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    fingerprints,
    users,
);
