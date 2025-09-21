import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  // At this point, the cookie exists.
  // The server can now be confident the user is authenticated.
  
  return NextResponse.json({ authenticated: true }, { status: 200 });
}