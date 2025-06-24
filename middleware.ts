// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

// This secret is used to verify the JWT
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  // Get the token from the user's cookies
  const token = req.cookies.get('token')?.value;

  // If the token doesn't exist, redirect to the sign-in page
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token's signature and payload
    const { payload } = await jwtVerify(token, secret);
    
    // Add the user's role to the request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-role', payload.role as string);

    // If the user tries to access an admin route, check their role
    if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
      if (payload.role !== 'admin') {
         // If they are not an admin, redirect them away
         const url = req.nextUrl.clone();
         url.pathname = '/signin'; 
         return NextResponse.redirect(url);
      }
    }
    
    // Allow the request to proceed with the added headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });

  } catch (err) {
    // If token verification fails (e.g., it's expired or invalid),
    // redirect to the sign-in page
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }
}

// This config specifies which routes the middleware should run on
export const config = {
  matcher: '/dashboard/:path*',
}