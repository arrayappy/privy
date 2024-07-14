use anchor_lang::prelude::*;
use crate::state::PrivyConfig;

pub fn update_privy_config(ctx: Context<UpdatePrivyConfig>, tokens_per_sol: u32) -> Result<()> {
    let privy_config = &mut ctx.accounts.privy_config;
    privy_config.tokens_per_sol = tokens_per_sol;
    msg!("Updated privy config to {} tokens per SOL", tokens_per_sol);
    Ok(())
}

#[derive(Accounts)]
pub struct UpdatePrivyConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}
