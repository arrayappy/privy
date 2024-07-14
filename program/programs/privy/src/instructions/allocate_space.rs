use anchor_lang::prelude::*;

use crate::state::PrivyUser;

pub fn allocate_space(ctx: Context<AllocateSpace>, computed_space: u32) -> Result<()> {
    ctx.accounts
        .privy_user
        .to_account_info()
        .realloc(computed_space as usize, false)?;
    Ok(())
}

#[derive(Accounts)]
pub struct AllocateSpace<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
    pub system_program: Program<'info, System>,
}
