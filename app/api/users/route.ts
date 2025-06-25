import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    try {
        // In a real app, you'd add middleware here to ensure only an admin can call this.
        // For now, we fetch all users.
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}