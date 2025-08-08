import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser } from '@/lib/mock-users'

export async function GET() {
  try {
    const users = getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    if (!userData.name || !userData.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    
    const newUser = createUser(userData)
    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
