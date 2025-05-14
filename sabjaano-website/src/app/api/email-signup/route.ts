import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Example: log or save the data (for now just log)
  console.log('📧 New email signup:', body.email)

  // In production, you could store this in a DB or send to email service
  return NextResponse.json({ message: 'Email signup successful' }, { status: 200 })
}
