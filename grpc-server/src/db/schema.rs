// @generated automatically by Diesel CLI.

diesel::table! {
    usernames (user_addr) {
        user_addr -> Varchar,
        user_name -> Varchar,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}