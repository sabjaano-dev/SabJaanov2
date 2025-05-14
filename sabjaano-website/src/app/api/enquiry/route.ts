import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  console.log('📩 New enquiry:', {
    name: body.name,
    email: body.email,
    message: body.message
  })

  return NextResponse.json({ message: 'Enquiry submitted' }, { status: 200 })
}
