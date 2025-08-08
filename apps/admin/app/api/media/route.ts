import { NextRequest, NextResponse } from 'next/server'
import { getAllFiles } from '@/lib/mock-media'

export async function GET() {
  try {
    const files = getAllFiles()
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Failed to fetch files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}
