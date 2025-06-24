import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
    }

    const userCount = await User.countDocuments();
    let finalRole = role;

    // If this is the first user ever, make them an admin
    if (userCount === 0) {
      finalRole = 'admin';
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
    }

    const user = await User.create({
      email,
      password,
      name,
      role: finalRole, // Use the finalRole here
    });

    return NextResponse.json({ success: true, data: { userId: user._id, name: user.name, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}