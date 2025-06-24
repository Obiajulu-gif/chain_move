# 🛠 Installation Guide

This guide will help you set up your development environment for working with the ChainMove platform.

## Prerequisites

### System Requirements

- Node.js 18.x or later
- npm 9.x or later
- MongoDB 6.0 or later
- Git
- Hardhat (for smart contract development)
- MetaMask or Web3 wallet

### Recommended Tools

- Visual Studio Code
- Git client (GitHub Desktop, GitKraken, or CLI)
- MongoDB Compass
- Postman or Insomnia for API testing

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/obiajulu-gif/chain_move.git
cd chain_move
```

### 2. Install Dependencies

#### Frontend Dependencies

```bash
cd frontend
npm install
```

#### Backend Dependencies

```bash
cd ../backend
npm install
```

#### Smart Contract Dependencies

```bash
cd ../contracts
npm install
```

### 3. Environment Setup

#### Frontend Environment

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

#### Backend Environment

Create a `.env` file in the backend directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/chainmove
JWT_SECRET=your_jwt_secret_here
WEB3_PROVIDER=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
IPFS_API_KEY=your_ipfs_api_key
IPFS_API_SECRET=your_ipfs_api_secret
```

#### Smart Contract Environment

Create a `.env` file in the contracts directory:

```env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 4. Database Setup

1. Install MongoDB Community Edition from [MongoDB's website](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: Run `net start MongoDB` as administrator
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

### 5. Start Development Servers

#### Frontend

```bash
cd frontend
npm run dev
```

#### Backend

```bash
cd backend
npm run dev
```

#### Smart Contracts

Compile contracts:

```bash
cd contracts
npx hardhat compile
```

Deploy to local network:

```bash
npx hardhat node
# In a new terminal
npx hardhat run scripts/deploy.js --network localhost
```

## Verifying the Installation

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see the ChainMove landing page
3. The backend API should be available at [http://localhost:3001](http://localhost:3001)

## Common Issues

### Node.js Version Mismatch

If you encounter version-related errors, use nvm (Node Version Manager):

```bash
nvm install 18
nvm use 18
```

### MongoDB Connection Issues

Ensure MongoDB is running and the connection string in your `.env` file is correct.

### Smart Contract Deployment Failures

- Check your private key and RPC URL in the `.env` file
- Ensure you have sufficient test MATIC in your wallet
- Verify the network configuration in `hardhat.config.js`

## Next Steps

- [Contribute to development](../resources/contributing.md)

---

*Last Updated: June 2025*
