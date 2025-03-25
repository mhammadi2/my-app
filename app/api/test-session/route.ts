// app/api/test-session/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import options from '../auth/[...nextauth]/options'

export async function GET() {
  const session = await getServerSession(options)
  return NextResponse.json({
    message: 'Session test',
    hasSession: !!session,
    session: session,
  })
}
