import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Check if an admin user already exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      return NextResponse.json(
        { message: "Admin registration is closed. An admin account already exists." },
        { status: 403 } // 403 Forbidden
      );
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if user with this email already exists (even if not admin)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the first admin user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Hardcode the role to 'admin'
    });

    await user.save();

    return NextResponse.json({ message: "Admin account created successfully. You can now sign in." }, { status: 201 });

  } catch (error) {
    console.error("ADMIN_SIGNUP_ERROR", error);
    return NextResponse.json({ message: "An error occurred during admin registration" }, { status: 500 });
  }
}