
use anchor_lang::prelude::*;

// Shared account structs (e.g., for global platform config)
// This can be used across modules for consistency, like platform fees or admin keys.

#[account]
pub struct GlobalConfig {
    pub admin: Pubkey,      // Platform admin for governance/upgrades
    pub fee_percentage: u8, // e.g., 1% platform fee on returns
    pub bump: [u8; 1],      // For PDA seed
}
