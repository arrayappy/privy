use anchor_lang::prelude::*;
use crate::state::PrivyUser;

pub fn update_category(ctx: Context<UpdateCategory>, categories: String) -> Result<()> {
    let privy_user = &mut ctx.accounts.privy_user;

    privy_user.categories = categories;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateCategory<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
    pub system_program: Program<'info, System>,
}
