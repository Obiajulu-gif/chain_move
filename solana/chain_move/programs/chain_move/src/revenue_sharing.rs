
use crate::errors::ErrorCode;
use crate::events::{EarningsClaimed, PaymentRecorded, RevenueDistributed};
use crate::investment_pool::{InvestorShare, PoolAccount};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer as SplTransfer};

// Accounts
#[account]
pub struct RevenueAccount {
    pub pool_id: u64,
    pub total_revenue: u64,
    pub distributed: u64,
    pub bump: u8,
}

// Instructions
pub fn record_payment(ctx: Context<RecordPayment>, pool_id: u64, amount: u64) -> Result<()> {
    require_gt!(amount, 0, ErrorCode::InvalidPayment);

    let revenue = &mut ctx.accounts.revenue;
    require_eq!(revenue.pool_id, pool_id, ErrorCode::InvalidPoolState);

    // Transfer payment to revenue vault (SPL CPI)
    let cpi_accounts = SplTransfer {
        from: ctx.accounts.payer_token.to_account_info(),
        to: ctx.accounts.revenue_token.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    revenue.total_revenue += amount;

    emit!(PaymentRecorded {
        payer: *ctx.accounts.payer.key,
        amount,
        vehicle_id: ctx.accounts.pool.vehicle_id, // Assume linked
    });
    Ok(())
}

#[derive(Accounts)]
pub struct RecordPayment<'info> {
    #[account(mut)]
    pub revenue: Account<'info, RevenueAccount>,
    pub pool: Account<'info, PoolAccount>, // Link to pool
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, token::authority = payer)]
    pub payer_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub revenue_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn distribute_revenue(ctx: Context<DistributeRevenue>, pool_id: u64) -> Result<()> {
    let revenue = &mut ctx.accounts.revenue;
    require_eq!(revenue.pool_id, pool_id, ErrorCode::InvalidPoolState);

    let undistributed = revenue.total_revenue - revenue.distributed;
    require_gt!(undistributed, 0, ErrorCode::NoEarningsToClaim);

    // Distribution logic: e.g., proportional to shares (simplified)
    // In real: Loop over investors or use off-chain for large pools
    revenue.distributed += undistributed;

    emit!(RevenueDistributed {
        pool_id,
        total_distributed: undistributed,
    });
    Ok(())
}

#[derive(Accounts)]
pub struct DistributeRevenue<'info> {
    #[account(mut)]
    pub revenue: Account<'info, RevenueAccount>,
    // Add admin signer if needed
}

pub fn claim_earnings(ctx: Context<ClaimEarnings>, pool_id: u64) -> Result<()> {
    let share = &ctx.accounts.share;
    require_eq!(share.pool_id, pool_id, ErrorCode::InvalidPoolState);

    let revenue = &ctx.accounts.revenue;
    require_eq!(revenue.pool_id, pool_id, ErrorCode::InvalidPoolState);

    // Calculate claimable: proportional (simplified)
    let total_shares = ctx.accounts.pool.current_amount; // Assume
    let claimable = if total_shares > 0 {
        ((share.amount as u128 * revenue.distributed as u128) / total_shares as u128) as u64
    } else {
        0
    };
    require_gt!(claimable, 0, ErrorCode::NoEarningsToClaim);

    // Get revenue info early
    let revenue_ref = &ctx.accounts.revenue;
    let pool_id_bytes = pool_id.to_le_bytes();
    let revenue_authority_seeds = &[b"revenue".as_ref(), &pool_id_bytes, &[revenue_ref.bump]];
    let revenue_info = revenue_ref.to_account_info();

    // Transfer (SPL CPI with PDA authority)
    let cpi_accounts = SplTransfer {
        from: ctx.accounts.revenue_token.to_account_info(),
        to: ctx.accounts.claimer_token.to_account_info(),
        authority: revenue_info,
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[revenue_authority_seeds];
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    anchor_spl::token::transfer(cpi_ctx, claimable)?;

    emit!(EarningsClaimed {
        claimer: *ctx.accounts.claimer.key,
        amount: claimable,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct ClaimEarnings<'info> {
    pub pool: Account<'info, PoolAccount>,
    pub share: Account<'info, InvestorShare>,
    #[account(mut, seeds = [b"revenue", pool_id.to_le_bytes().as_ref()], bump)]
    pub revenue: Account<'info, RevenueAccount>,
    #[account(mut)]
    pub claimer: Signer<'info>,
    #[account(mut, token::authority = claimer)]
    pub claimer_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub revenue_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
