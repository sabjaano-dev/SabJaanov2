// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export function POST() {
  const res = NextResponse.json({ loggedOut: true });
  res.cookies.set('token', '', { maxAge: 0, path: '/' });
  return res;
}
