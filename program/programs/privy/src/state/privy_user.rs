use anchor_lang::prelude::*;

#[account]
pub struct PrivyUser {
    pub username: String,
    pub token_limit: u16,
    pub categories: String,
    pub messages: String,
    pub bump: u8,
}

impl PrivyUser {
    pub const USER_SPACE: usize = 8 + 4 + 32 + 2 + 4 + 1 * (4 + 32 + 32 + 1 + 1) + 1;
}
