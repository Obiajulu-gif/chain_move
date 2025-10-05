
use anchor_lang::prelude::*;

declare_id!("7FedjHGkNzZ3EopyAXC5yLdjtL4HDFKrCUTYFJ7QLVFC");

pub mod errors;
pub mod events;
pub mod governance;
pub mod investment_pool;
pub mod revenue_sharing;
pub mod vehicle_nft;

#[program]
pub mod chain_move {
    use super::*;

    // Vehicle NFT instructions
    pub use vehicle_nft::{mint_vehicle, transfer_vehicle, update_metadata};

    // Investment Pool instructions
    pub use investment_pool::{create_pool, invest, withdraw};

    // Revenue Sharing instructions
    pub use revenue_sharing::{claim_earnings, distribute_revenue, record_payment};

    // Governance instructions
    pub use governance::{create_proposal, execute_proposal, vote};

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
