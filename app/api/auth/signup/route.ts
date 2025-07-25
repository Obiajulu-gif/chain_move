import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc.sepolia-api.lisk.com'); //lisk testnet. Change to mainnet later

export async function POST(request: Request) {
  await dbConnect();

  const chainId = await web3.eth.getChainId();
  console.log('Chain ID:', chainId); //this is to test the connection

  try {
    const { name, email, password, role } = await request.json();

    // Validate required fields based on registration type
    if (!name || !role) {
      return NextResponse.json({ message: "Name and role are required", success: false }, { status: 400 });
    }

    // Validate role - only allow driver or investor
    if (!['driver', 'investor'].includes(role)) {
      return NextResponse.json({ 
        message: "Invalid role. Only 'driver' and 'investor' roles are allowed for signup.", 
        success: false 
      }, { status: 400 });
    }

    // If registering with email/password
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists", success: true }, { status: 200 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate wallet address and private key
    const generateWallet = web3.eth.accounts.wallet.create(1);
    // console.log('Generated address:', generateWallet[0].address);
    // console.log('Generated private key:', generateWallet[0].privateKey);

    // hash and encode the private key
    // lets hash it for now
    const hashedPrivateKey = await bcrypt.hash(generateWallet[0].privateKey, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role, // This will now only be 'driver' or 'investor'
      walletAddress: generateWallet[0].address,
      privateKey: hashedPrivateKey,
    });

    await user.save();
    console.log("User created successfully:", user);

    return NextResponse.json({ message: "User created successfully", success: true }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ message: "An error occurred during registration", success: false }, { status: 500 });
  }
}