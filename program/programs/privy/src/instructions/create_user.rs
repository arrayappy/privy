use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::rent::Rent;
use anchor_lang::system_program::{self, Transfer};
use crate::state::{PrivyConfig, PrivyUser};
use crate::LAMPORTS_PER_SOL;

pub fn create_user(
    ctx: Context<CreateUser>,
    username: String,
    categories: String,
    deposit_lamports: u64,
) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let privy_user = &mut ctx.accounts.privy_user;
    let privy_config = &mut ctx.accounts.privy_config;
    let system_program = &ctx.accounts.system_program;

    let deposit_sol = deposit_lamports as f64 / LAMPORTS_PER_SOL as f64;
    let vector_size = (deposit_sol * privy_config.tokens_per_sol as f64).floor() as usize;

    let computed_space =
        8 + 4 + 32 + 2 + 4 + 1 * (4 + 32 + 32 + 1 + 1) + 4 + ((4 + 140 + 3) * vector_size) + 1;

    let rent = &ctx.accounts.rent;
    let privy_user_lamports = rent.minimum_balance(computed_space);
    let privy_config_lamports = deposit_lamports.saturating_sub(privy_user_lamports);

    privy_user.username = username;
    privy_user.bump = ctx.bumps.privy_user;
    privy_user.token_limit = vector_size as u16;
    privy_user.categories = categories;

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
pub struct CreateUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = PrivyUser::USER_SPACE,
        seeds = [b"privy-user", user.key().as_ref()],
        bump
    )]
    pub privy_user: Account<'info, PrivyUser>,
    #[account(mut)]
    pub privy_config: Account<'info, PrivyConfig>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
