import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const headersList = headers();
  const role = headersList.get('x-user-role');
  
  // Protect this route: only admins can access
  if (role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    const userToPromote = await User.findById(userId);

    if (!userToPromote) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    userToPromote.role = 'admin';
    await userToPromote.save();

    return NextResponse.json({ success: true, message: `${userToPromote.name} has been promoted to admin.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}