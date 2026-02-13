
use crate::errors::ErrorCode;
use crate::events::{Invested, PoolCreated, Withdrawn};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer as SplTransfer};

// Accounts
#[account]
pub struct PoolAccount {
    pub creator: Pubkey,
    pub pool_id: u64,
    pub target_amount: u64,
    pub current_amount: u64,
    pub active: bool,
    pub vehicle_id: u64, // Link to vehicle NFT
    pub bump: u8,
    pub authority_bump: u8, // For PDA authority
}

#[account]
pub struct InvestorShare {
    pub investor: Pubkey,
    pub pool_id: u64,
    pub amount: u64,
    pub bump: u8, // For PDA
}

// Instructions
pub fn create_pool(
    ctx: Context<CreatePool>,
    pool_id: u64,
    target_amount: u64,
    vehicle_id: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    pool.creator = *ctx.accounts.creator.key;
    pool.pool_id = pool_id;
    pool.target_amount = target_amount;
    pool.current_amount = 0;
    pool.active = true;
    pool.vehicle_id = vehicle_id;

    emit!(PoolCreated {
        creator: *ctx.accounts.creator.key,
        pool_id,
        target_amount,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct CreatePool<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 8 + 8 + 8 + 1 + 8 + 1 + 1, seeds = [b"pool", pool_id.to_le_bytes().as_ref()], bump)]
    pub pool: Account<'info, PoolAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn invest(ctx: Context<Invest>, pool_id: u64, amount: u64) -> Result<()> {
    require_gt!(amount, 0, ErrorCode::InsufficientFunds);

    let pool = &mut ctx.accounts.pool;
    require_eq!(pool.pool_id, pool_id, ErrorCode::InvalidPoolState);
    require!(pool.active, ErrorCode::InvalidPoolState);
    require!(
        pool.current_amount + amount <= pool.target_amount,
        ErrorCode::InvalidPoolState
    );

    // Transfer tokens (SPL CPI) - authority is investor, no pool borrow needed
    let cpi_accounts = SplTransfer {
        from: ctx.accounts.investor_token.to_account_info(),
        to: ctx.accounts.pool_token.to_account_info(),
        authority: ctx.accounts.investor.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    pool.current_amount += amount;

    let share = &mut ctx.accounts.share;
    share.investor = *ctx.accounts.investor.key;
    share.pool_id = pool_id;
    share.amount += amount; // Accumulate if re-investing

    emit!(Invested {
        investor: *ctx.accounts.investor.key,
        pool_id,
        amount,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct Invest<'info> {
    #[account(mut)]
    pub pool: Account<'info, PoolAccount>,
    #[account(
        init_if_needed,
        payer = investor,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"share", investor.key().as_ref(), pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub share: Account<'info, InvestorShare>,
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(mut, token::authority = investor)]
    pub investor_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw(ctx: Context<Withdraw>, pool_id: u64, amount: u64) -> Result<()> {
    let share = &mut ctx.accounts.share;
    require_eq!(share.pool_id, pool_id, ErrorCode::InvalidPoolState);
    require_gte!(share.amount, amount, ErrorCode::InsufficientFunds);

    let pool_ref = &ctx.accounts.pool;
    let pool_id_bytes = pool_id.to_le_bytes();
    let pool_authority_seeds = &[b"pool".as_ref(), &pool_id_bytes, &[pool_ref.authority_bump]];
    let pool_info = pool_ref.to_account_info();

    let pool = &mut ctx.accounts.pool;
    require!(pool.active, ErrorCode::InvalidPoolState); // Or check if withdraw allowed

    // Transfer back (SPL CPI with PDA authority)
    let cpi_accounts = SplTransfer {
        from: ctx.accounts.pool_token.to_account_info(),
        to: ctx.accounts.investor_token.to_account_info(),
        authority: pool_info,
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[pool_authority_seeds];
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    anchor_spl::token::transfer(cpi_ctx, amount)?;

    pool.current_amount -= amount;
    share.amount -= amount;

    emit!(Withdrawn {
        investor: *ctx.accounts.investor.key,
        pool_id,
        amount,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct Withdraw<'info> {
    #[account(mut, seeds = [b"pool", pool_id.to_le_bytes().as_ref()], bump)]
    pub pool: Account<'info, PoolAccount>,
    #[account(mut)]
    pub share: Account<'info, InvestorShare>,
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(mut, token::authority = investor)]
    pub investor_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
