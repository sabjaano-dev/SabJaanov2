// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Ensure Mongo is connected
    await dbConnect();

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Wrong ID or Password' },
        { status: 401 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Wrong ID or Password' },
        { status: 401 }
      );
    }

    // Create and sign JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Serialize cookie
    const serialized = cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/',
      sameSite: 'lax',
    });

    // Return response with Set-Cookie header
    const response = NextResponse.json({ message: 'Logged in' });
    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
