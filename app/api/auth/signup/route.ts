import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password, walletaddress, role } = await request.json();

    // Validate required fields based on registration type
    if (!name || !role) {
      return NextResponse.json({ message: "Name and role are required", success: false }, { status: 400 });
    }

    // If registering with wallet address
    if (walletaddress) {
      // Check if wallet address already exists
      const existingWalletUser = await User.findOne({ walletaddress });
      if (existingWalletUser) {
        return NextResponse.json({ message: "User with this wallet address already exists", success: true }, { status: 200 });
      }

      const user = new User({
        name,
        walletaddress,
        role,
      });

      await user.save();
      return NextResponse.json({ message: "User created successfully (wallet)", success: true }, { status: 201 });
    }

    // If registering with email/password
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required if wallet address is not provided" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists", success: true }, { status: 200 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    return NextResponse.json({ message: "User created successfully", success: true }, { status: 201 });

  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ message: "An error occurred during registration", success: false }, { status: 500 });
  }
}