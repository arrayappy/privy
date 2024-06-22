// @generated automatically by Diesel CLI.

diesel::table! {
    fingerprints (id) {
        id -> Varchar,
        user_categories -> Varchar,
    }
}

diesel::table! {
    usernames (user_addr) {
        user_addr -> Varchar,
        user_name -> Varchar,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    fingerprints,
    usernames,
);
