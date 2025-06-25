import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        // Again, this should be protected by admin-only middleware.
        const { id } = params;
        const { role } = await request.json();

        if (!['admin', 'driver', 'investor'].includes(role)) {
            return NextResponse.json({ message: "Invalid role specified" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User role updated successfully", user: updatedUser });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}