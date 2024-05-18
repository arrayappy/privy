use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::solana_program::sysvar::rent::Rent;

declare_id!("GW79qwoxeZLoyN1wBwDmJ19CjmqsL5rD44jBDCRnvyie");

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

#[program]
pub mod privy {
    use super::*;

    pub fn initialize_privy_config(ctx: Context<InitializePrivyConfig>, tokens_per_sol: u32) -> Result<()> {
        let privy_config = &mut ctx.accounts.privy_config;
        privy_config.tokens_per_sol = tokens_per_sol;
        msg!("Initialized privy config with {} tokens per SOL", tokens_per_sol);
        Ok(())
    }

    pub fn update_privy_config(ctx: Context<UpdatePrivyConfig>, tokens_per_sol: u32) -> Result<()> {
        let privy_config = &mut ctx.accounts.privy_config;
        privy_config.tokens_per_sol = tokens_per_sol;
        msg!("Updated privy config to {} tokens per SOL", tokens_per_sol);
        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>, username: String, passkey: String, deposit_lamports: u64) -> Result<()> {
        let privy_user = &mut ctx.accounts.privy_user;
        let privy_config = &ctx.accounts.privy_config;
        let deposit_sol = deposit_lamports as f64 / LAMPORTS_PER_SOL as f64;
        let vector_size = (deposit_sol * privy_config.tokens_per_sol as f64).floor() as usize;
    
        // msg!("deposit_lamports: {}", deposit_lamports);
        // msg!("deposit_sol: {}", deposit_sol);
        // msg!("tokens_per_sol: {}", privy_config.tokens_per_sol);
        // msg!("vector_size: {}", vector_size);
    
        privy_user.username = username.clone();
        privy_user.passkey = passkey;
        privy_user.disabled = false;
        privy_user.bump = ctx.bumps.privy_user;
        privy_user.tokens = Vec::with_capacity(vector_size);
        privy_user.token_limit = vector_size as u16;
        // privy_user.token_limit = privy_user.tokens.capacity() as u16;
    
        msg!("Creating user {} with deposit of {} lamports ({} SOL), resulting in token capacity of {}", username, deposit_lamports, deposit_sol, vector_size);
    
        // Transfer lamports from user to program
        let cpi_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.privy_user.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        system_program::transfer(cpi_context, deposit_lamports)?;
    
        msg!("Transferred {} lamports from user to privy_user account", deposit_lamports);
    
        Ok(())
    }

    pub fn add_tokens(ctx: Context<AddTokens>, additional_lamports: u64) -> Result<()> {
        let privy_user = &mut ctx.accounts.privy_user;
        let privy_config = &ctx.accounts.privy_config;
        let additional_sol = additional_lamports as f64 / LAMPORTS_PER_SOL as f64;
        let additional_tokens = (additional_sol * privy_config.tokens_per_sol as f64).floor() as usize;

        privy_user.tokens.reserve(additional_tokens);
        privy_user.token_limit = privy_user.token_limit.checked_add(additional_tokens as u16).unwrap();

        msg!("Adding {} lamports ({} SOL) to user account, resulting in additional token capacity of {}", additional_lamports, additional_sol, additional_tokens);

        // Transfer lamports from user to program
        let cpi_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.privy_user.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        system_program::transfer(cpi_context, additional_lamports)?;

        msg!("Transferred {} lamports from user to privy_user account", additional_lamports);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePrivyConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + PrivyConfig::LEN,
        seeds = [b"privy-config", owner.key().as_ref()],
        bump
    )]
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePrivyConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + PrivyUser::INIT_SPACE,
        seeds = [b"privy-user", user.key().as_ref()],
        bump
    )]
    pub privy_user: Account<'info, PrivyUser>,
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
    pub privy_config: Account<'info, PrivyConfig>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PrivyConfig {
    pub tokens_per_sol: u32,
}

impl PrivyConfig {
    const LEN: usize = 8 + 4;
}

#[account]
pub struct PrivyUser {
    pub username: String,
    pub passkey: String,
    pub disabled: bool,
    pub token_limit: u16,
    pub tokens: Vec<String>,
    pub bump: u8,
}

impl PrivyUser {
    const INIT_SPACE: usize = 8 + 4 + 24 + 1 + 1 + (140 * 10); // Approximate initial space calculation
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Bump value not found.")]
    BumpNotFound,
}