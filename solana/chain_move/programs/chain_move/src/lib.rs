use anchor_lang::prelude::*;

declare_id!("7FedjHGkNzZ3EopyAXC5yLdjtL4HDFKrCUTYFJ7QLVFC");

#[program]
pub mod chain_move {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
