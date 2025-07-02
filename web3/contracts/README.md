![Screenshot from 2025-06-27 13-24-20](https://github.com/user-attachments/assets/3c69a96a-a78c-47f6-9016-75ff6eeca476)
# ChainMove Vehicle Financing Smart Contracts

A decentralised vehicle financing platform built on Ethereum-compatible blockchains, featuring upgradeable smart contracts with a modular architecture. This project supports deployment on Lisk Sepolia, Celo, Alfajores, and local Hardhat networks, leveraging OpenZeppelin's UUPS proxy pattern for upgrades.

## Architecture Overview

The ChainMove platform is designed with a modular architecture, consisting of four core contracts inherited into a single deployable contract:

### Core Contracts

1. **VehicleNFT.sol** - Vehicle NFT Management

   - ERC-721 compatible vehicle NFTs
   - Vehicle ownership transfers
   - Metadata management

2. **InvestmentPool.sol** - Investment Pool Management

   - Investor registration and management
   - Investment pool creation
   - Investor contributions and withdrawals

3. **RevenueSharing.sol** - Revenue Distribution

   - Loan management and tracking
   - Revenue distribution logic
   - Payment processing and earnings distribution

4. **Governance.sol** - Protocol Governance

   - Voting mechanisms
   - Proposal creation and execution
   - Protocol parameter management

5. **ChainMoveContract.sol** - Main Contract

   - Inherits functionality from the above contracts
   - Implements UUPS (Universal Upgradeable Proxy Standard) for upgradeability
   - Serves as the single deployment point

## Features

- ✅ **Upgradeable Contracts**: Utilises OpenZeppelin's UUPS proxy pattern for seamless upgrades
- ✅ **Modular Design**: Clear separation of concerns across contracts
- ✅ **Secure**: Built with OpenZeppelin's audited libraries
- ✅ **Multi-Chain Support**: Deployable on Lisk Sepolia, Celo, Alfajores, and local Hardhat networks
- ✅ **Governance**: On-chain governance for protocol updates
- ✅ **Investment Pools**: Crowdfunded vehicle financing
- ✅ **Revenue Sharing**: Automated distribution of loan repayments
- ✅ **NFT Integration**: Vehicles represented as ERC-721 NFTs

## Prerequisites

- Node.js &gt;= 16.0.0
- npm &gt;= 7.0.0
- Git
- An `.env` file with private keys for deployment

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd chainmove-contracts
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**: Create a `.env` file by copying the example:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to include your private keys and network configurations:

   ```env
   PRIVATE_KEY=your_private_key_for_lisk_sepolia_celo_alfajores
   localPK=your_localhost_private_key
   ```

   - `PRIVATE_KEY`: Private key for deploying to Lisk Sepolia, Celo, or Alfajores.
   - `localPK`: Private key for deploying to a local Hardhat node (e.g., a test account from `npx hardhat node`).

   **Note**: Ensure `.env` is listed in `.gitignore` to avoid exposing private keys.

4. **Compile Contracts**:

   ```bash
   npx hardhat compile
   ```

## Deployment

The project includes scripts for deploying and upgrading the `ChainMoveContract` using OpenZeppelin's UUPS proxy pattern, as defined in `scripts/deploy.ts` and `scripts/deploy_upgrade.ts`. Deployment is supported on multiple networks, as specified in the `package.json` and `hardhat.config.ts`.

### Deployment Script (`scripts/deploy.ts`)

The deployment script (`scripts/deploy.ts`) deploys the `ChainMoveContract` as a UUPS proxy:

- Deploys the proxy and implementation contracts.
- Initialises the contract with the `initialize` function.
- Logs the proxy, implementation, and admin addresses.
- Writes the proxy address to `scripts/proxyAddress.ts` for use in upgrades.
- Verifies the contract's version and owner.

Run deployment with the following commands:

#### Local Deployment

1. Start a local Hardhat node:

   ```bash
   npx hardhat node
   ```

2. Deploy to the local network:

   ```bash
   npm run dl
   ```

#### Testnet Deployment

- **Lisk Sepolia**:

  ```bash
  npm run dls
  ```

## Contract Verification

After deploying your contract to a public network (e.g., Lisk Sepolia), you can verify the implementation contract on a block explorer using Hardhat's verification plugin.

### Steps to Verify

1. **Install the Hardhat verification plugin (if not already installed):**

   ```bash
   npm install --save-dev @nomicfoundation/hardhat-verify
   ```

2. **Ensure your `hardhat.config.ts` includes the etherscan config:**

   ```typescript
   import "@nomicfoundation/hardhat-verify";

   export default {
     // ...existing config...
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY,
     },
   };
   ```

4. **Run the verification command:**

   ```bash
   npx hardhat verify --network <lisk-sepolia> <implementation_contract_address>
   ```

   - Replace `<implementation_contract_address>` with the address of your implementation contract (not the proxy).

### Upgrade Script (`scripts/deploy_upgrade.ts`)

The upgrade script (`scripts/deploy_upgrade.ts`) upgrades the `ChainMoveContract` to a new implementation (`ChainMoveContractV2`):

- Uses the proxy address stored in `scripts/proxyAddress.ts`.
- Deploys the new implementation and updates the proxy to point to it.
- Logs the new implementation address.

Run upgrades with the following commands:

- Local network:

  ```bash
  npm run ul
  ```

- Lisk Sepolia:

  ```bash
  npm run uls
  ```

- Celo Alfajores:

  ```bash
  npm run ua
  ```

- Celo Mainnet:

  ```bash
  npm run uc
  ```

**Note**: Ensure `proxyAddress.ts` contains a valid proxy address from a prior deployment before running the upgrade script.

## Contract Interactions

### For Investors

1. **Register as Investor**:

   ```solidity
   function registerInvestor()
   ```

2. **Invest in a Vehicle**:

   ```solidity
   function investInVehicle(uint256 vehicleId) payable
   ```

3. **Withdraw Investment**:

   ```solidity
   function withdrawInvestment(uint256 vehicleId)
   ```

### For Drivers

1. **Register as a Driver**:

   ```solidity
   function registerDriver()
   ```

2. **Apply for a Loan**:

   ```solidity
   function applyForLoan(uint256 vehicleId, uint256 duration, uint256 interestRate)
   ```

3. **Repay Loan**:

   ```solidity
   function repayLoan(uint256 loanId) payable
   ```

### For Admins

1. **List a Vehicle**:

   ```solidity
   function listVehicle(string memory metadataURI, uint256 price)
   ```

2. **Activate a Loan**:

   ```solidity
   function activateLoan(uint256 loanId)
   ```

## Testing

Run the test suite to verify contract functionality:

```bash
npm test
```

## Security Considerations

- Built with OpenZeppelin's secure, audited contracts (`@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`).
- Implements `Ownable` for access control.
- Includes reentrancy protection and input validation.
- Uses Hardhat's gas optimisation settings (`optimizer: { enabled: true, runs: 50 }`) for efficient contract execution.
- The deployment script verifies the contract's version and owner post-deployment.
- The upgrade script validates the proxy address before proceeding.

## Gas Optimization

- Contracts are optimised for gas efficiency with minimal storage slots.
- Function calls are streamlined to reduce transaction costs.
- Hardhat configuration includes an optimiser with 50 runs for a balance of code size and gas savings.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

## Support

For questions or issues, please open an issue on the GitHub repository.

## Roadmap

- [ ] Enhance governance with additional voting mechanisms

- [ ] Integrate vehicle insurance features

- [ ] Expand multi-chain support (e.g., additional EVM-compatible networks)

- [ ] Implement analytics and reporting tools

- [ ] Develop mobile app integration
