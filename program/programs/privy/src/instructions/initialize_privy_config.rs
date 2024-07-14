use anchor_lang::prelude::*;
use crate::state::PrivyConfig;

pub fn initialize_privy_config(
    ctx: Context<InitializePrivyConfig>,
    tokens_per_sol: u32,
) -> Result<()> {
    let privy_config = &mut ctx.accounts.privy_config;
    privy_config.owner = *ctx.accounts.owner.key;
    privy_config.tokens_per_sol = tokens_per_sol;
    msg!(
        "Initialized privy config with {} tokens per SOL",
        tokens_per_sol
    );
    Ok(())
}

#[derive(Accounts)]
pub struct InitializePrivyConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = PrivyConfig::CONFIG_SPACE,
        seeds = [b"privy-config"],
        bump
    )]
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}
