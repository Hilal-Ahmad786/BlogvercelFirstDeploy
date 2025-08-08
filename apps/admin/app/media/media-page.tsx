'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Search, 
  Filter,
  Grid,
  List,
  Trash2,
  Download,
  Copy,
  Eye,
  Image as ImageIcon,
  FileText,
  File,
  Video,
  Music,
  Archive
} from 'lucide-react'

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

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setUploading(true)
    
    try {
      for (const file of Array.from(uploadedFiles)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setFiles(prev => [data.file, ...prev])
        }
      }
    } catch (error) {
      console.error('Failed to upload files:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/media/${fileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId))
        setSelectedFiles(selectedFiles.filter(id => id !== fileId))
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />
    if (mimeType.startsWith('audio/')) return <Music className="h-4 w-4" />
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
    return 'other'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || getFileType(file.mimeType) === filterType
    return matchesSearch && matchesType
  })

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) return

    try {
      for (const fileId of selectedFiles) {
        await fetch(`/api/media/${fileId}`, { method: 'DELETE' })
      }
      setFiles(files.filter(file => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
    } catch (error) {
      console.error('Failed to delete files:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, documents, and other files
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedFiles.length})
            </Button>
          )}
          <Button
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
            className="btn-hover-lift"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="glass border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent 
          className="p-8 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault()
            const files = e.dataTransfer.files
            if (files.length > 0) {
              handleFileUpload(files)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="mx-auto h-12 w-12 text-primary/60 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports: Images, Videos, Documents, Archives (Max 10MB each)
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files)
          }
        }}
        className="hidden"
      />

      {/* Filters & Search */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Files</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Upload your first file to get started'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card 
                  key={file.id} 
                  className={`glass cursor-pointer transition-all hover:shadow-lg group ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square mb-3 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {file.mimeType.startsWith('image/') ? (
                        <img 
                          src={file.url} 
                          alt={file.altText || file.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-2xl">
                          {getFileIcon(file.mimeType)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium truncate" title={file.originalName}>
                        {file.originalName}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {getFileType(file.mimeType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => {
                        e.stopPropagation()
                        copyFileUrl(file.url)
                      }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, '_blank')
                      }}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(file.id)
                      }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left">
                        <th className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(filteredFiles.map(f => f.id))
                              } else {
                                setSelectedFiles([])
                              }
                            }}
                          />
                        </th>
                        <th className="p-4">Preview</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Uploaded</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="border-b border-border hover:bg-muted/20">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => toggleFileSelection(file.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                              {file.mimeType.startsWith('image/') ? (
                                <img 
                                  src={file.url} 
                                  alt={file.altText || file.originalName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getFileIcon(file.mimeType)
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{file.originalName}</p>
                              {file.width && file.height && (
                                <p className="text-xs text-muted-foreground">
                                  {file.width} × {file.height}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">
                              {getFileType(file.mimeType)}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => copyFileUrl(file.url)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => window.open(file.url, '_blank')}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFile(file.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {files.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {files.filter(f => f.mimeType.startsWith('image/')).length}
            </div>
            <div className="text-sm text-muted-foreground">Images</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {files.filter(f => f.mimeType.startsWith('video/')).length}
            </div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {files.filter(f => f.mimeType.includes('pdf') || f.mimeType.includes('document')).length}
            </div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Total Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
