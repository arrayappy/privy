use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Token limit exceeded")]
    TokenLimitExceeded,
    #[msg("Disabled receiving messages.")]
    MessagesDisabled,
}
