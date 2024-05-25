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
        privy_config.owner = *ctx.accounts.owner.key;
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
    
        let computed_space = 8 +  // discriminator
            4 + username.len() +  // dynamic username length
            4 + passkey.len() +  // dynamic passkey length
            1 +  // disabled
            2 +  // token_limit
            1 +   // bump
            4 + ((4+ 140) * vector_size);  // dynamic tokens based on deposit

        let account_info = &mut privy_user.to_account_info();
        account_info.realloc(computed_space as usize, true)?; 

    
        privy_user.username = username;
        privy_user.passkey = passkey;
        privy_user.disabled = false;
        privy_user.bump = ctx.bumps.privy_user;
        privy_user.tokens = Vec::with_capacity(vector_size);
        privy_user.token_limit = vector_size as u16;
        privy_user.compute_space = computed_space as u32;
        privy_user.total_sol = privy_user.get_lamports() as f64;
    
        let cpi_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.privy_user.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        system_program::transfer(cpi_context, deposit_lamports)?;
    
        Ok(())
    }
    

    pub fn add_tokens(ctx: Context<AddTokens>, additional_lamports: u64,) -> Result<()> {
        let privy_user = &mut ctx.accounts.privy_user;
        let privy_config = &ctx.accounts.privy_config;
        let additional_sol = additional_lamports as f64 / LAMPORTS_PER_SOL as f64;
        let additional_tokens = (additional_sol * privy_config.tokens_per_sol as f64).floor() as usize;
    
        let new_token_limit = privy_user.token_limit.checked_add(additional_tokens as u16).ok_or(CustomError::TokenLimitExceeded)?;
        let new_computed_space = privy_user.compute_space + (additional_tokens as u32 * (4 + 140));
    
        privy_user.token_limit = new_token_limit;
        privy_user.compute_space = new_computed_space;
        privy_user.total_sol = privy_user.get_lamports() as f64;
        privy_user.tokens.reserve(new_token_limit as usize); // finalise
    
        let account_info = &mut privy_user.to_account_info();
        account_info.realloc(new_computed_space as usize, true)?; 

        let cpi_accounts = Transfer { // todo Transfer vs add_lamports
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.privy_user.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        system_program::transfer(cpi_context, additional_lamports)?;
    
        msg!("Transferred {} lamports from user to privy_user account", additional_lamports);
    
        Ok(())
    }
    

    pub fn insert_message(ctx: Context<InsertMessage>, message: String) -> Result<()> {
        let privy_user = &mut ctx.accounts.privy_user;
        privy_user.tokens.push(message);
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
        space = PrivyConfig::CONFIG_SPACE,
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
        space = PrivyUser::USER_SPACE,
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

#[derive(Accounts)]
pub struct InsertMessage<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = privy_config.owner == *owner.key @ CustomError::Unauthorized
    )]
    pub privy_config: Account<'info, PrivyConfig>,
    #[account(mut)]
    pub privy_user: Account<'info, PrivyUser>,
}

#[account]
pub struct PrivyConfig {
    pub owner: Pubkey,
    pub tokens_per_sol: u32,
}

impl PrivyConfig {
    const CONFIG_SPACE: usize = 8 + // discriminator
    32 + // owner
    4; // tokens_per_sol
}

#[account]
pub struct PrivyUser {
    pub username: String,
    pub passkey: String,
    pub disabled: bool,
    pub token_limit: u16,
    pub tokens: Vec<String>,
    pub total_sol: f64,
    pub compute_space: u32, 
    pub bump: u8,
}

impl PrivyUser {
    const USER_SPACE: usize = 8 +  // discriminator
    4 + 24 +  // username
    4 + 24 +  // passkey
    1 +  // disabled
    2 +  // token_limit
    1;  // bump
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Token limit exceeded")]
    TokenLimitExceeded,
}