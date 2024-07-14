use anchor_lang::prelude::*;

#[account]
pub struct PrivyConfig {
    pub owner: Pubkey,
    pub tokens_per_sol: u32,
}

impl PrivyConfig {
    pub const CONFIG_SPACE: usize = 8 + 32 + 4;
}
