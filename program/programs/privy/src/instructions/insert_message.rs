use anchor_lang::prelude::*;
use crate::state::{PrivyConfig, PrivyUser};
use crate::errors::CustomError;

pub fn insert_message(ctx: Context<InsertMessage>, messages: String) -> Result<()> {
    let privy_user = &mut ctx.accounts.privy_user;

    require!(privy_user.token_limit > 0, CustomError::TokenLimitExceeded);

    privy_user.messages = messages;

    privy_user.token_limit = privy_user
        .token_limit
        .checked_sub(1)
        .ok_or(CustomError::MessagesDisabled)?;

    Ok(())
}

#[derive(Accounts)]
pub struct InsertMessage<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = privy_config.owner == *owner.key @ CustomError::Unauthorized
    )]
    pub privy_config: Account<'info, PrivyConfig>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
}
