import { NextRequest, NextResponse } from 'next/server'
import { mockGetUser } from '@/lib/mock-auth'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await mockGetUser(sessionId)

    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
