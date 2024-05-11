use anchor_lang::prelude::*;

declare_id!("DRpfXBx35Z5QDTnQzV756avabprLWqfbbo3jxAa66ThD");

#[program]
pub mod privy {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
