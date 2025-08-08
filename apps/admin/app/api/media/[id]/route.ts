import { NextRequest, NextResponse } from 'next/server'
import { getFileById, deleteFile, updateFile } from '@/lib/mock-media'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const file = getFileById(params.id)
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    return NextResponse.json({ file })
  } catch (error) {
    console.error('Failed to fetch file:', error)
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updatedFile = updateFile(params.id, updates)
    if (!updatedFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    return NextResponse.json({ file: updatedFile })
  } catch (error) {
    console.error('Failed to update file:', error)
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteFile(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
