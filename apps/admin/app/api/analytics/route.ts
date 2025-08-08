import { NextRequest, NextResponse } from 'next/server'
import { generateAnalyticsData } from '@/lib/mock-analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = (searchParams.get('range') as '7d' | '30d' | '90d') || '30d'
    
    const analyticsData = generateAnalyticsData(range)
    
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
