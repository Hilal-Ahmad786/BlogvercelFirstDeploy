interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  url: string
  altText?: string
  caption?: string
  uploadedAt: string
  uploadedBy: string
}

let mockFiles: MediaFile[] = [
  {
    id: '1',
    filename: 'hero-image.jpg',
    originalName: 'Hero Image.jpg',
    mimeType: 'image/jpeg',
    size: 1024000,
    width: 1920,
    height: 1080,
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    altText: 'Modern workspace',
    caption: 'A beautiful workspace setup',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'admin-1'
  },
  {
    id: '2',
    filename: 'blog-cover.png',
    originalName: 'Blog Cover.png',
    mimeType: 'image/png',
    size: 512000,
    width: 1200,
    height: 630,
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    altText: 'Blog writing',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    uploadedBy: 'admin-1'
  },
  {
    id: '3',
    filename: 'sample-document.pdf',
    originalName: 'Sample Document.pdf',
    mimeType: 'application/pdf',
    size: 256000,
    url: '/files/sample-document.pdf',
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    uploadedBy: 'admin-1'
  },
  {
    id: '4',
    filename: 'profile-photo.jpg',
    originalName: 'Profile Photo.jpg',
    mimeType: 'image/jpeg',
    size: 128000,
    width: 400,
    height: 400,
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    altText: 'Profile photo',
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    uploadedBy: 'admin-1'
  }
]

export function getAllFiles() {
  return mockFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
}

export function getFileById(id: string) {
  return mockFiles.find(file => file.id === id)
}

export function createFile(fileData: Omit<MediaFile, 'id' | 'uploadedAt' | 'uploadedBy'>) {
  const newFile: MediaFile = {
    ...fileData,
    id: Date.now().toString(),
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'admin-1'
  }
  mockFiles.unshift(newFile)
  return newFile
}

export function deleteFile(id: string) {
  const index = mockFiles.findIndex(file => file.id === id)
  if (index === -1) return false
  
  mockFiles.splice(index, 1)
  return true
}

export function updateFile(id: string, updates: Partial<MediaFile>) {
  const index = mockFiles.findIndex(file => file.id === id)
  if (index === -1) return null
  
  mockFiles[index] = {
    ...mockFiles[index],
    ...updates
  }
  return mockFiles[index]
}
