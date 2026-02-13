import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        return NextResponse.json({ isOpen: adminCount === 0 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error', isOpen: false },
            { status: 500 }
        );
    }
}