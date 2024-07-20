use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

declare_id!("priHJ6iTp11dw7nU8QoFZ4msaEMyk6GnBKfvV3rpNE5");

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

#[program]
pub mod privy {

    use super::*;

    pub fn initialize_privy_config(
        ctx: Context<InitializePrivyConfig>,
        tokens_per_sol: u32,
    ) -> Result<()> {
        instructions::initialize_privy_config(ctx, tokens_per_sol)
    }

    pub fn update_privy_config(ctx: Context<UpdatePrivyConfig>, tokens_per_sol: u32) -> Result<()> {
        instructions::update_privy_config(ctx, tokens_per_sol)
    }

    pub fn withdraw_balance(ctx: Context<WithdrawBalance>, amount: u64) -> Result<()> {
        instructions::withdraw_balance(ctx, amount)
    }

    pub fn create_user(
        ctx: Context<CreateUser>,
        username: String,
        categories: String,
        deposit_lamports: u64,
    ) -> Result<()> {
        instructions::create_user(ctx, username, categories, deposit_lamports)
    }

    pub fn update_username(ctx: Context<UpdateUsername>, username: String) -> Result<()> {
        instructions::update_username(ctx, username)
    }

    pub fn add_tokens(ctx: Context<AddTokens>, additional_lamports: u64) -> Result<()> {
        instructions::add_tokens(ctx, additional_lamports)
    }

    pub fn allocate_space(ctx: Context<AllocateSpace>, computed_space: u32) -> Result<()> {
        instructions::allocate_space(ctx, computed_space)
    }

    pub fn insert_message(ctx: Context<InsertMessage>, message: String) -> Result<()> {
        instructions::insert_message(ctx, message)
    }

    pub fn update_category(ctx: Context<UpdateCategory>, categories: String) -> Result<()> {
        instructions::update_category(ctx, categories)
    }
}
