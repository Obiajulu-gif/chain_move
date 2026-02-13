import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Set the cookie with an immediate expiration date to clear it
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set to a past date
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}