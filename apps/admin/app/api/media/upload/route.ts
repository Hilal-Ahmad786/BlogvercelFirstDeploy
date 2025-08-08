import { NextRequest, NextResponse } from 'next/server'
import { createFile } from '@/lib/mock-media'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // In a real app, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll simulate the upload
    const mockFile = {
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
      ...(file.type.startsWith('image/') && {
        width: 400,
        height: 300
      })
    }

    const newFile = createFile(mockFile)
    return NextResponse.json({ file: newFile }, { status: 201 })
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
