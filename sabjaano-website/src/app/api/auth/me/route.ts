// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ auth: false }, { status: 401 });

    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ auth: true });
  } catch {
    return NextResponse.json({ auth: false }, { status: 401 });
  }
}
