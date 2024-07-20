use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::rent::Rent;
use anchor_lang::system_program::{self, Transfer};
use crate::state::{PrivyConfig, PrivyUser};
use crate::errors::CustomError;
use crate::LAMPORTS_PER_SOL;

pub fn add_tokens(ctx: Context<AddTokens>, additional_lamports: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let privy_user = &mut ctx.accounts.privy_user;
    let privy_config = &mut ctx.accounts.privy_config;
    let system_program = &ctx.accounts.system_program;

    let additional_sol = additional_lamports as f64 / LAMPORTS_PER_SOL as f64;
    let additional_tokens =
        (additional_sol * privy_config.tokens_per_sol as f64).floor() as usize;

    let new_token_limit = privy_user
        .token_limit
        .checked_add(additional_tokens as u16)
        .ok_or(CustomError::TokenLimitExceeded)?;
    let addtional_computed_space = additional_tokens * (4 + 140);

    let rent = &ctx.accounts.rent;
    let privy_user_lamports = rent.minimum_balance(addtional_computed_space);
    let privy_config_lamports = additional_lamports.saturating_sub(privy_user_lamports);

    privy_user.token_limit = new_token_limit;
    privy_user.messages.reserve(new_token_limit as usize);

    let cpi_accounts = Transfer {
        from: user.to_account_info(),
        to: privy_user.to_account_info(),
    };
    let cpi_context = CpiContext::new(system_program.to_account_info(), cpi_accounts);
    system_program::transfer(cpi_context, privy_user_lamports)?;

    let cpi_accounts_config = Transfer {
        from: user.to_account_info(),
        to: privy_config.to_account_info(),
    };
    let cpi_context_config =
        CpiContext::new(system_program.to_account_info(), cpi_accounts_config);
    system_program::transfer(cpi_context_config, privy_config_lamports)?;

    Ok(())
}

#[derive(Accounts)]
pub struct AddTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
    #[account(mut)]
    pub privy_config: Account<'info, PrivyConfig>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
