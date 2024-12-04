// src/app/api/login/route.js
import connectDb from "../../backend/connectDb";
import User from "../../backend/UserModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    const { email, password } = await request.json();

    console.log(`Looking up user with email: ${email}...`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("User found. Validating password...");
    if (password !== user.password) {
      console.log("Password validation failed.");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Login successful.");
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
