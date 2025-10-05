use anchor_lang::prelude::*;

#[event]
pub struct Transfer {
    pub from: Pubkey,
    pub to: Pubkey,
    pub vehicle_id: u64,
}

#[event]
pub struct Mint {
    pub minter: Pubkey,
    pub vehicle_id: u64,
    pub metadata_uri: String,
}

#[event]
pub struct MetadataUpdate {
    pub vehicle_id: u64,
    pub new_uri: String,
}

#[event]
pub struct PoolCreated {
    pub creator: Pubkey,
    pub pool_id: u64,
    pub target_amount: u64,
}

#[event]
pub struct Invested {
    pub investor: Pubkey,
    pub pool_id: u64,
    pub amount: u64,
}

#[event]
pub struct Withdrawn {
    pub investor: Pubkey,
    pub pool_id: u64,
    pub amount: u64,
}

#[event]
pub struct PaymentRecorded {
    pub payer: Pubkey,
    pub amount: u64,
    pub vehicle_id: u64,
}

#[event]
pub struct RevenueDistributed {
    pub pool_id: u64,
    pub total_distributed: u64,
}

#[event]
pub struct EarningsClaimed {
    pub claimer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ProposalCreated {
    pub creator: Pubkey,
    pub proposal_id: u64,
    pub description: String,
}

#[event]
pub struct Voted {
    pub voter: Pubkey,
    pub proposal_id: u64,
    pub vote: bool, // true for yes, false for no
}

#[event]
pub struct ProposalExecuted {
    pub proposal_id: u64,
    pub success: bool,
}
