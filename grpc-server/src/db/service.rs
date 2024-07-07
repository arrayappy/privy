use self::models::Fingerprint;
use self::models::{User, UpdatedUser};
use crate::db::models;
use crate::db::schema::fingerprints::dsl::*;
use crate::db::schema::usernames::dsl::*;
use diesel::prelude::*;

pub fn get_user_row_by_name(conn: &mut PgConnection, name: &str) -> Option<User> {
    usernames
        .filter(user_name.eq(name))
        .first(conn)
        .optional()
        .expect("Error getting user by addr")
}

pub fn get_user_row_by_addr(conn: &mut PgConnection, addr: &str) -> Option<User> {
    usernames
        .filter(user_addr.eq(addr))
        .first(conn)
        .optional()
        .expect("Error getting user by addr")
}

pub fn create_user_row(conn: &mut PgConnection, new_user: User) -> usize {
    diesel::insert_into(usernames)
        .values(&new_user)
        .execute(conn)
        .expect("Error saving new user")
}

pub fn update_user_row(
    conn: &mut PgConnection,
    _user_addr: &str,
    updated_user: UpdatedUser,
) -> usize {
    diesel::update(usernames.filter(user_addr.eq(_user_addr)))
        .set(&updated_user)
        .execute(conn)
        .expect("Error updating user")
}

pub fn delete_user_row(conn: &mut PgConnection, addr: &str) -> QueryResult<usize> {
    diesel::delete(usernames.filter(user_addr.eq(addr))).execute(conn)
}

pub fn get_fingerprint_categories(
    conn: &mut PgConnection,
    fingerprint_id: &str,
) -> Option<(String, Vec<String>)> {
    fingerprints
        .filter(id.eq(fingerprint_id))
        .first::<Fingerprint>(conn)
        .optional()
        .expect("Error loading fingerprint")
        .map(|fp: Fingerprint| (fp.id.clone(), fp.to_user_categories_vec()))
}

pub fn append_fingerprint(
    conn: &mut PgConnection,
    fingerprint_id: &str,
    new_category: String,
) -> usize {
    let fingerprint_exists = get_fingerprint_categories(conn, fingerprint_id).is_some();

    if fingerprint_exists {
        // Fingerprint exists, append the new category
        if let Some((fingerprint_id, mut categories)) =
            get_fingerprint_categories(conn, fingerprint_id)
        {
            if categories.contains(&new_category) {
                return 0;
            }

            categories.push(new_category);

            let updated_fingerprint =
                Fingerprint::from_user_categories_vec(fingerprint_id.clone(), categories);

            diesel::update(fingerprints.filter(id.eq(fingerprint_id)))
                .set(user_categories.eq(updated_fingerprint.user_categories))
                .execute(conn)
                .expect("Error updating fingerprint")
        } else {
            0 // Should not reach here if fingerprint exists due to the first check
        }
    } else {
        // Fingerprint does not exist, create a new row
        let categories = vec![new_category];
        let new_fingerprint =
            Fingerprint::from_user_categories_vec(fingerprint_id.to_string(), categories);

        diesel::insert_into(fingerprints)
            .values(&new_fingerprint)
            .execute(conn)
            .expect("Error creating fingerprint")
    }
}
