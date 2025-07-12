import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token')?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // If the user is trying to access the dashboard without a token, redirect to signin
  if (pathname.startsWith('/dashboard')) {
    if (!tokenCookie) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // Verify the token
      const { payload } = await jwtVerify(tokenCookie, secret);
      const userRole = payload.role as string;

      // Check admin route access
      if (pathname.startsWith('/dashboard/admin')) {
        if (userRole !== 'admin') {
          // Non-admin users trying to access admin routes
          return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
        }
      }

      // Token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      // Token is invalid, redirect to signin and clear the bad cookie
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // If the user is logged in and tries to access the signin or auth page, redirect them to their dashboard
  if ((pathname === '/signin' || pathname === '/auth') && tokenCookie) {
    try {
      const { payload } = await jwtVerify(tokenCookie, secret);
      const role = payload.role as string;
      if (role) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    } catch (error) {
      // If token is invalid for any reason, let them proceed to the auth page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};