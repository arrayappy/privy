use anchor_lang::prelude::*;

declare_id!("DRpfXBx35Z5QDTnQzV756avabprLWqfbbo3jxAa66ThD");

#[program]
pub mod privy {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, username: String, passkey: String) -> Result<()> {
        let privy_user = &mut ctx.accounts.privy_user;
        privy_user.username = username;
        privy_user.passkey = passkey;
        privy_user.disabled = false;
        privy_user.bump = ctx.bumps.privy_user;

        Ok(())
    }

    pub fn change_username(ctx: Context<ChangeUserName>, new_username: String) -> Result<()> {
        ctx.accounts.privy_user.username = new_username;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        // space = 8 + PrivyUser::INIT_SPACE,
        space = 8 + 1000,
        seeds = [b"privy-user", user.key().as_ref()],
        bump
    )]
    pub privy_user: Account<'info, PrivyUser>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeUserName<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"privy-user", user.key().as_ref()],
        bump = privy_user.bump
    )]
    pub privy_user: Account<'info, PrivyUser>,
}

#[account]
#[derive(InitSpace)]
pub struct PrivyUser {
    #[max_len(24)]
    pub username: String,
    #[max_len(24)]
    pub passkey: String,
    pub disabled: bool,
    pub bump: u8
}