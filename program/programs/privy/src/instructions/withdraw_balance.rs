use anchor_lang::prelude::*;
use crate::state::PrivyConfig;
use crate::errors::CustomError;

pub fn withdraw_balance(ctx: Context<WithdrawBalance>, amount: u64) -> Result<()> {
    ctx.accounts.privy_config.sub_lamports(amount)?;
    ctx.accounts.owner.add_lamports(amount)?;

    msg!("Withdrawn {} lamports to owner", amount);
    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawBalance<'info> {
    #[account(mut, constraint = privy_config.owner == *owner.key @ CustomError::Unauthorized )]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub privy_config: Account<'info, PrivyConfig>,
    /// CHECK: ignore
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
