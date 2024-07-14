use anchor_lang::prelude::*;

use crate::state::PrivyUser;

pub fn update_username(ctx: Context<UpdateUsername>, username: String) -> Result<()> {
    let privy_user = &mut ctx.accounts.privy_user;
    privy_user.username = username;
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateUsername<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
    pub system_program: Program<'info, System>,
}
