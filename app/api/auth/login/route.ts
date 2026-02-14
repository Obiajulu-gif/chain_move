import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password, walletaddress } = await request.json();

    // Login with wallet address
    if (walletaddress) {
      const user = await User.findOne({ walletaddress });
      if (!user) {
        return NextResponse.json({ message: "Wallet not registered" }, { status: 401 });
      }

      // Create JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      const userResponse = {
        id: user._id,
        name: user.name,
        walletaddress: user.walletaddress,
        role: user.role,
      };

      const response = NextResponse.json({
        message: "Login successful",
        user: userResponse,
        token,
      }, { status: 200 });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    // Login with email/password
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token,
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
  }
}