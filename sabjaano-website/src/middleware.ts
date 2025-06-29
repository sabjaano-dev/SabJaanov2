// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/signin', '/api/auth', '/']; // public routes

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If the request is for a public path, skip auth
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Otherwise, check for a valid JWT
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.token;
  if (!token) {
    // Redirect to sign-in if not present
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

// Only run middleware on these paths:
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/locations/:path*',
    '/api/secure/:path*'
  ]
};
