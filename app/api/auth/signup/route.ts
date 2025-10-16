import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { Web3 } from 'web3';
import crypto from 'crypto';
// thirdweb modules will be loaded dynamically inside the handler to avoid SSR-time browser APIs
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;




// Function To Encrypt private key before saving to DB
function encrypt(text: string, algorithm: string, secretKey: Buffer) {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm!, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

// Function To Decrypt private key before saving to DB
function decrypt(
  encrypted: { iv: string; content: string },
  algorithm: string,
  secretKey: Buffer,
) {
  const decipher = crypto.createDecipheriv(
    algorithm!,
    secretKey,
    Buffer.from(encrypted.iv, 'hex'),
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

export async function POST(request: Request) {
  console.log("🚀 SIGNUP_START: Request received");
  
  // Read and validate environment variables at request time
  const requiredEnvVars = {
    RPC_URL: process.env.RPC_URL,
    ALGORITHM: process.env.ALGORITHM,
    SECRET_KEY_HEX: process.env.SECRET_KEY_HEX,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    ACCOUNT_FACTORY_ADDRESS: process.env.ACCOUNT_FACTORY_ADDRESS,
    TREASURY_ADDRESS: process.env.TREASURY_ADDRESS,
    CHAINMOVE_CA: process.env.CHAINMOVE_CA,
  } as const;

  // Log environment variables status (without exposing values)
  console.log("🔧 ENV_CHECK:", {
    hasRpcUrl: !!requiredEnvVars.RPC_URL,
    hasAlgorithm: !!requiredEnvVars.ALGORITHM,
    hasSecretKey: !!requiredEnvVars.SECRET_KEY_HEX,
    hasThirdwebSecretKey: !!requiredEnvVars.THIRDWEB_SECRET_KEY,
    hasAccountFactory: !!requiredEnvVars.ACCOUNT_FACTORY_ADDRESS,
    hasTreasury: !!requiredEnvVars.TREASURY_ADDRESS,
    hasChainmoveCA: !!requiredEnvVars.CHAINMOVE_CA,
  });

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  if (missingVars.length > 0) {
    console.error("❌ ENV_VALIDATION_ERROR", { missingVars });
    return NextResponse.json({
      message: `Missing required environment variables: ${missingVars.join(', ')}`,
      success: false,
    }, { status: 500 });
  }

  const algorithm = requiredEnvVars.ALGORITHM!;
  const secretKeyHex = requiredEnvVars.SECRET_KEY_HEX!;
  const secretKey = Buffer.from(secretKeyHex, 'hex');
  const ACCOUNT_FACTORY_ADDRESS = requiredEnvVars.ACCOUNT_FACTORY_ADDRESS!;
  const TREASURY_ADDRESS = requiredEnvVars.TREASURY_ADDRESS!;
  const CHAINMOVE_CA = requiredEnvVars.CHAINMOVE_CA!;

  const web3 = new Web3(requiredEnvVars.RPC_URL!);
  let client: any;
  let chainConfig: any;

  try {
    console.log("📊 DB_CONNECT: Attempting database connection");
    await dbConnect();
    console.log("✅ DB_CONNECT: Database connected successfully");
  } catch (dbError) {
    console.error("❌ DATABASE_CONNECTION_ERROR", dbError);
    return NextResponse.json({ 
      message: "Database connection failed", 
      success: false,
      error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
    }, { status: 500 });
  }

  let chainId;
  try {
    console.log("🔗 CHAIN_CONNECT: Attempting blockchain connection");
    chainId = await web3.eth.getChainId();
    console.log('✅ CHAIN_CONNECT: Chain ID:', chainId);
  } catch (chainError) {
    console.error("❌ CHAIN_CONNECTION_ERROR", chainError);
    return NextResponse.json({ 
      message: "Blockchain connection failed", 
      success: false,
      error: process.env.NODE_ENV === 'development' ? chainError.message : undefined
    }, { status: 500 });
  }

  try {
    console.log("📝 PARSE_REQUEST: Parsing request body");
    const { name, email, password, role } = await request.json();
    console.log("✅ PARSE_REQUEST: Body parsed successfully", { name, email, role });

    if (!name || !role || !email || !password) {
      console.log("❌ VALIDATION: Missing required fields");
      return NextResponse.json({ message: "Name, email, role, and password are required", success: false }, { status: 400 });
    }

    // Validate role
    if (!['driver', 'investor'].includes(role)) {
      console.log("❌ VALIDATION: Invalid role", { role });
      return NextResponse.json({
        message: "Invalid role. Only 'driver' and 'investor' roles are allowed for signup.",
        success: false
      }, { status: 400 });
    }

    // Check if email already exists
    let existingUser;
    try {
      console.log("🔍 USER_CHECK: Checking if user exists");
      existingUser = await User.findOne({ email });
      console.log("✅ USER_CHECK: Query completed", { userExists: !!existingUser });
    } catch (dbError) {
      console.error("❌ DB_ERROR", dbError);
      return NextResponse.json({ 
        message: "Database error during user lookup", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 });
    }
    if (existingUser) {
      console.log("❌ USER_EXISTS: User already exists with this email");
      return NextResponse.json({ message: "User with this email already exists", success: false }, { status: 409 });
    }

    let hashedPassword;
    try {
      console.log("🔐 HASH_PASSWORD: Hashing password");
      hashedPassword = await bcrypt.hash(password, 10);
      console.log("✅ HASH_PASSWORD: Password hashed successfully");
    } catch (hashError) {
      console.error("❌ HASH_ERROR", hashError);
      return NextResponse.json({ 
        message: "Error hashing password", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? hashError.message : undefined
      }, { status: 500 });
    }

    // Generate wallet address and private key
    let generateWallet, generatedPrivateKey;
    try {
      console.log("💰 WALLET_GEN: Generating wallet");
      generateWallet = web3.eth.accounts.wallet.create(1);
      generatedPrivateKey = generateWallet[0].privateKey;
      console.log("✅ WALLET_GEN: Wallet generated successfully", { address: generateWallet[0].address });
    } catch (walletError) {
      console.error("❌ WALLET_ERROR", walletError);
      return NextResponse.json({ 
        message: "Error generating wallet", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? walletError.message : undefined
      }, { status: 500 });
    }

    // Load personal wallet
    let myWallet;
    try {
      console.log("👤 PERSONAL_WALLET: Creating personal wallet account");
      const { createThirdwebClient, defineChain } = await import("thirdweb");
      const { privateKeyToAccount } = await import("thirdweb/wallets");
      client = createThirdwebClient({
        secretKey: requiredEnvVars.THIRDWEB_SECRET_KEY!,
      });
      chainConfig = defineChain(4202);
      myWallet = privateKeyToAccount({
        client,
        privateKey: generatedPrivateKey,
      });
      console.log("✅ PERSONAL_WALLET: Wallet created", { address: myWallet.address });
    } catch (accountError) {
      console.error("❌ ACCOUNT_ERROR", accountError);
      return NextResponse.json({ 
        message: "Error creating personal wallet", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? accountError.message : undefined
      }, { status: 500 });
    }

    // Create smart wallet instance
    let smartWalletInstance, smartAccount;
    try {
      console.log("🧠 SMART_WALLET: Creating smart wallet instance");
      const { smartWallet } = await import("thirdweb/wallets");
      // client and chainConfig were initialized earlier
      smartWalletInstance = smartWallet({
        chain: chainConfig,
        factoryAddress: ACCOUNT_FACTORY_ADDRESS!,
        gasless: true,
      });
      console.log("🔗 SMART_WALLET: Connecting smart wallet");
      smartAccount = await smartWalletInstance.connect({
        client,
        personalAccount: myWallet,
      });
      console.log("✅ SMART_WALLET: Smart wallet connected", { address: smartAccount.address });
    } catch (smartWalletError) {
      console.error("❌ SMART_WALLET_ERROR", smartWalletError);
      return NextResponse.json({ 
        message: "Error creating smart wallet", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? smartWalletError.message : undefined
      }, { status: 500 });
    }

    // Deploy smart wallet by calling approve function
    try {
      console.log("📜 CONTRACT: Getting contract instance");
      const { getContract, prepareContractCall, sendTransaction } = await import("thirdweb");
      const contract = getContract({
        address: CHAINMOVE_CA!,
        chain: chainConfig,
        client,
      });
      const spender = TREASURY_ADDRESS!;
      const value = 1_000_000_000_000_000_000; // in wei

      console.log("📝 CONTRACT: Preparing contract call", { spender, value });
      const transaction = await prepareContractCall({
        contract,
        method: "function approve(address spender, uint256 value) returns (bool)",
        params: [spender, value],
      });
      
      console.log("🚀 CONTRACT: Sending transaction");
      const { transactionHash: smartTxHash } = await sendTransaction({
        account: smartAccount,
        transaction: transaction,
      });
      console.log("✅ CONTRACT: Admin Approval sent", { txHash: smartTxHash });
    } catch (contractError) {
      console.error("❌ CONTRACT_ERROR", contractError);
      return NextResponse.json({ 
        message: "Error deploying smart wallet contract", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? contractError.message : undefined
      }, { status: 500 });
    }

    // Encrypt private key
    let encryptedPrivateKey;
    try {
      console.log("🔐 ENCRYPT: Encrypting private key");
      const privKey = encrypt(generateWallet[0].privateKey, algorithm, secretKey);
      encryptedPrivateKey = `${privKey.iv}:${privKey.content}`;
      console.log("✅ ENCRYPT: Private key encrypted successfully");
    } catch (encryptError) {
      console.error("❌ ENCRYPT_ERROR", encryptError);
      return NextResponse.json({ 
        message: "Error encrypting private key", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? encryptError.message : undefined
      }, { status: 500 });
    }

    // Create new user
    try {
      console.log("👤 USER_CREATE: Creating new user record");
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        walletAddress: generateWallet[0].address,
        privateKey: encryptedPrivateKey,
        smartWalletAddress: smartAccount.address,
      });

      console.log("💾 USER_SAVE: Saving user to database");
      await user.save();
      console.log("✅ USER_SAVE: User created successfully", { userId: user._id, email: user.email });
    } catch (userSaveError) {
      console.error("❌ USER_SAVE_ERROR", userSaveError);
      return NextResponse.json({ 
        message: "Error saving user to database", 
        success: false,
        error: process.env.NODE_ENV === 'development' ? userSaveError.message : undefined
      }, { status: 500 });
    }

    console.log("🎉 SIGNUP_SUCCESS: Account created successfully", { role, email });
    return NextResponse.json({ message: ` ${role} account created successfully`, success: true }, { status: 201 });

  } catch (error) {
    console.error("❌ SIGNUP_ERROR: Unexpected error occurred", error);
    return NextResponse.json({ 
      message: "An error occurred during registration", 
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}