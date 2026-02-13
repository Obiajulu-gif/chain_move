
use crate::errors::ErrorCode;
use crate::events::{ProposalCreated, ProposalExecuted, Voted};
use anchor_lang::prelude::*;

// Accounts
#[account]
pub struct ProposalAccount {
    pub creator: Pubkey,
    pub proposal_id: u64,
    pub description: String,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub executed: bool,
    pub bump: u8,
}

#[account]
pub struct VoteAccount {
    pub voter: Pubkey,
    pub proposal_id: u64,
    pub has_voted: bool,
    pub bump: u8, // For PDA
}

// Instructions
pub fn create_proposal(
    ctx: Context<CreateProposal>,
    proposal_id: u64,
    description: String,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    proposal.creator = *ctx.accounts.creator.key;
    proposal.proposal_id = proposal_id;
    proposal.description = description.clone();
    proposal.yes_votes = 0;
    proposal.no_votes = 0;
    proposal.executed = false;

    emit!(ProposalCreated {
        creator: *ctx.accounts.creator.key,
        proposal_id,
        description,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CreateProposal<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 8 + 200 + 8 + 8 + 1 + 1, seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()], bump)]
    pub proposal: Account<'info, ProposalAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn vote(ctx: Context<Vote>, proposal_id: u64, vote_yes: bool) -> Result<()> {
    let vote_acc = &mut ctx.accounts.vote;
    require!(!vote_acc.has_voted, ErrorCode::InvalidVote);

    let proposal = &mut ctx.accounts.proposal;
    require_eq!(
        proposal.proposal_id,
        proposal_id,
        ErrorCode::InvalidProposal
    );
    require!(!proposal.executed, ErrorCode::InvalidProposal);

    if vote_yes {
        proposal.yes_votes += 1;
    } else {
        proposal.no_votes += 1;
    }
    vote_acc.has_voted = true;

    emit!(Voted {
        voter: *ctx.accounts.voter.key,
        proposal_id,
        vote: vote_yes,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct Vote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, ProposalAccount>,
    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + 32 + 8 + 1 + 1,
        seeds = [b"vote", voter.key().as_ref(), proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vote: Account<'info, VoteAccount>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn execute_proposal(ctx: Context<ExecuteProposal>, proposal_id: u64) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    require_eq!(
        proposal.proposal_id,
        proposal_id,
        ErrorCode::InvalidProposal
    );
    require!(!proposal.executed, ErrorCode::InvalidProposal);

    let success = proposal.yes_votes > proposal.no_votes; // Simple majority
    proposal.executed = true;

    // Execute logic here (e.g., update params via CPI)

    emit!(ProposalExecuted {
        proposal_id,
        success,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct ExecuteProposal<'info> {
    #[account(mut, seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()], bump)]
    pub proposal: Account<'info, ProposalAccount>,
    // Add admin signer if needed
}
