use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid owner for this action")]
    InvalidOwner,
    #[msg("Insufficient funds for investment or withdrawal")]
    InsufficientFunds,
    #[msg("Pool is not active or has reached target")]
    InvalidPoolState,
    #[msg("Payment amount must be positive")]
    InvalidPayment,
    #[msg("No claimable earnings available")]
    NoEarningsToClaim,
    #[msg("Proposal not found or invalid")]
    InvalidProposal,
    #[msg("Vote already cast or ineligible")]
    InvalidVote,
    #[msg("Metadata URI too long")]
    InvalidMetadata,
}
