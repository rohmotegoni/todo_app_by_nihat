import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to redirect based on cookie presence
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user is accessing the root route
  if (pathname === '/') {
    // Check for the presence of the auth_token cookie
    const authToken = request.cookies.get('auth_token');

    // If the auth_token cookie is not present, redirect to /signup
    if (!authToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Allow other routes to continue
  return NextResponse.next();
}

// Config to match the root route
export const config = {
  matcher: '/', // This applies the middleware only to the root path
};
