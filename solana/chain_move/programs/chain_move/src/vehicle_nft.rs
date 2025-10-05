
use crate::errors::ErrorCode;
use crate::events::{MetadataUpdate, Mint, Transfer};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint as TokenMint, Token};

// Accounts
#[account]
pub struct VehicleAccount {
    pub owner: Pubkey,
    pub vehicle_id: u64,
    pub metadata_uri: String,
    pub shares_mint: Pubkey, // Fungible token for fractional shares
    pub bump: u8,
}

// Instructions
pub fn mint_vehicle(
    ctx: Context<MintVehicle>,
    vehicle_id: u64,
    metadata_uri: String,
) -> Result<()> {
    require!(metadata_uri.len() <= 200, ErrorCode::InvalidMetadata);

    let vehicle = &mut ctx.accounts.vehicle;
    vehicle.owner = *ctx.accounts.minter.key;
    vehicle.vehicle_id = vehicle_id;
    vehicle.metadata_uri = metadata_uri.clone();
    vehicle.shares_mint = ctx.accounts.shares_mint.key();

    // Stub for MPL NFT metadata creation - implement raw CPI or use Anchor-compatible wrapper
    // For now, log and emit event
    msg!("Minting vehicle NFT with URI: {}", metadata_uri);

    emit!(Mint {
        minter: *ctx.accounts.minter.key,
        vehicle_id,
        metadata_uri,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(vehicle_id: u64)]
pub struct MintVehicle<'info> {
    #[account(init, payer = minter, space = 8 + 32 + 8 + 200 + 32 + 1, seeds = [b"vehicle", vehicle_id.to_le_bytes().as_ref()], bump)]
    pub vehicle: Account<'info, VehicleAccount>,
    #[account(mut)]
    pub minter: Signer<'info>,
    #[account(init, payer = minter, mint::decimals = 0, mint::authority = minter)]
    pub nft_mint: Account<'info, TokenMint>, // NFT mint
    #[account(init, payer = minter, mint::decimals = 6, mint::authority = minter)]
    pub shares_mint: Account<'info, TokenMint>, // Fungible shares
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn transfer_vehicle(ctx: Context<TransferVehicle>, vehicle_id: u64) -> Result<()> {
    let vehicle = &mut ctx.accounts.vehicle;
    require_eq!(vehicle.vehicle_id, vehicle_id, ErrorCode::InvalidOwner);
    require_keys_eq!(
        vehicle.owner,
        *ctx.accounts.current_owner.key,
        ErrorCode::InvalidOwner
    );

    vehicle.owner = *ctx.accounts.new_owner.key;

    // Stub for NFT transfer - implement SPL transfer CPI
    msg!(
        "Transferring vehicle ownership to {}",
        ctx.accounts.new_owner.key
    );

    emit!(Transfer {
        from: *ctx.accounts.current_owner.key,
        to: *ctx.accounts.new_owner.key,
        vehicle_id,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(vehicle_id: u64)]
pub struct TransferVehicle<'info> {
    #[account(mut, seeds = [b"vehicle", vehicle_id.to_le_bytes().as_ref()], bump)]
    pub vehicle: Account<'info, VehicleAccount>,
    pub current_owner: Signer<'info>,
    /// CHECK: New owner
    pub new_owner: AccountInfo<'info>,
}

pub fn update_metadata(
    ctx: Context<UpdateMetadata>,
    vehicle_id: u64,
    new_uri: String,
) -> Result<()> {
    require!(new_uri.len() <= 200, ErrorCode::InvalidMetadata);

    let vehicle = &mut ctx.accounts.vehicle;
    require_eq!(vehicle.vehicle_id, vehicle_id, ErrorCode::InvalidOwner);
    require_keys_eq!(
        vehicle.owner,
        *ctx.accounts.owner.key,
        ErrorCode::InvalidOwner
    );

    let _old_uri = vehicle.metadata_uri.clone();
    vehicle.metadata_uri = new_uri.clone();

    // Stub for metadata update - implement MPL update CPI
    msg!("Updating vehicle metadata to URI: {}", new_uri);

    emit!(MetadataUpdate {
        vehicle_id,
        new_uri,
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(vehicle_id: u64)]
pub struct UpdateMetadata<'info> {
    #[account(mut, seeds = [b"vehicle", vehicle_id.to_le_bytes().as_ref()], bump)]
    pub vehicle: Account<'info, VehicleAccount>,
    pub owner: Signer<'info>,
}
