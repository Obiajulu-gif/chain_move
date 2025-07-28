import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { Web3 } from 'web3';
import crypto from 'crypto';
import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { privateKeyToAccount, smartWallet } from "thirdweb/wallets";


const web3 = new Web3(process.env.RPC_URL);
const algorithm = process.env.ALGORITHM;
const secretKeyHex = process.env.SECRET_KEY_HEX;
const secretKey = Buffer.from(secretKeyHex, 'hex');
const iv = crypto.randomBytes(16); // random initialization vector
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const ACCOUNT_FACTORY_ADDRESS = process.env.ACCOUNT_FACTORY_ADDRESS;
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS;
const CHAINMOVE_CA = process.env.CHAINMOVE_CA;
const chain = defineChain(4202);

const client = createThirdwebClient({
  secretKey: THIRDWEB_SECRET_KEY,
  clientId: THIRDWEB_CLIENT_ID,
});


// Function To Encrypt private key before saving to DB
function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

// Function To Decrypt private key before saving to DB
function decrypt(encrypted: { iv: string; content: string }) {
  const decipher = crypto.createDecipheriv(
    algorithm,
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
  await dbConnect();

  const chainId = await web3.eth.getChainId();
  console.log('Chain ID:', chainId);

  try {
    const { name, email, password, role } = await request.json();

    if (!name || !role || !email || !password) {
      return NextResponse.json({ message: "Name, email, role, and password are required", success: false }, { status: 400 });
    }

    // Validate role
    if (!['driver', 'investor'].includes(role)) {
      return NextResponse.json({
        message: "Invalid role. Only 'driver' and 'investor' roles are allowed for signup.",
        success: false
      }, { status: 400 });
    }

    // Check if email already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (dbError) {
      console.error("DB_ERROR", dbError);
      return NextResponse.json({ message: "Database error during user lookup", success: false }, { status: 500 });
    }
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists", success: false }, { status: 409 });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("HASH_ERROR", hashError);
      return NextResponse.json({ message: "Error hashing password", success: false }, { status: 500 });
    }

    // Generate wallet address and private key
    let generateWallet, generatedPrivateKey;
    try {
      generateWallet = web3.eth.accounts.wallet.create(1);
      generatedPrivateKey = generateWallet[0].privateKey;
    } catch (walletError) {
      console.error("WALLET_ERROR", walletError);
      return NextResponse.json({ message: "Error generating wallet", success: false }, { status: 500 });
    }

    // Load personal wallet
    let myWallet;
    try {
      myWallet = privateKeyToAccount({
        client,
        privateKey: generatedPrivateKey,
      });
      console.log("✅ Wallet:", myWallet.address);
    } catch (accountError) {
      console.error("ACCOUNT_ERROR", accountError);
      return NextResponse.json({ message: "Error creating personal wallet", success: false }, { status: 500 });
    }

    // Create smart wallet instance
    let smartWalletInstance, smartAccount;
    try {
      smartWalletInstance = smartWallet({
        chain,
        factoryAddress: ACCOUNT_FACTORY_ADDRESS,
        gasless: true,
      });
      smartAccount = await smartWalletInstance.connect({
        client,
        personalAccount: myWallet,
      });
      console.log("✅ Smart Wallet:", smartAccount.address);
    } catch (smartWalletError) {
      console.error("SMART_WALLET_ERROR", smartWalletError);
      return NextResponse.json({ message: "Error creating smart wallet", success: false }, { status: 500 });
    }

    // Deploy smart wallet by calling approve function
    try {
      const contract = getContract({
        address: CHAINMOVE_CA,
        chain: chain,
        client,
      });
      const spender = TREASURY_ADDRESS;
      const value = 1_000_000_000_000_000_000; // in wei

      const transaction = await prepareContractCall({
        contract,
        method: "function approve(address spender, uint256 value) returns (bool)",
        params: [spender, value],
      });
      const { transactionHash: smartTxHash } = await sendTransaction({
        account: smartAccount,
        transaction: transaction,
      });
      console.log("✅ Admin Approval sent:", smartTxHash);
    } catch (contractError) {
      console.error("CONTRACT_ERROR", contractError);
      return NextResponse.json({ message: "Error deploying smart wallet contract", success: false }, { status: 500 });
    }

    // Encrypt private key
    let encryptedPrivateKey;
    try {
      const privKey = encrypt(generateWallet[0].privateKey);
      encryptedPrivateKey = `${privKey.iv}:${privKey.content}`;
    } catch (encryptError) {
      console.error("ENCRYPT_ERROR", encryptError);
      return NextResponse.json({ message: "Error encrypting private key", success: false }, { status: 500 });
    }

    // Create new user
    try {
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        walletAddress: generateWallet[0].address,
        privateKey: encryptedPrivateKey,
        smartWalletAddress: smartAccount.address,
      });

      await user.save();
      console.log("✅ User Created", user);
    } catch (userSaveError) {
      console.error("USER_SAVE_ERROR", userSaveError);
      return NextResponse.json({ message: "Error saving user to database", success: false }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully", success: true }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ message: "An error occurred during registration", success: false }, { status: 500 });
  }
}