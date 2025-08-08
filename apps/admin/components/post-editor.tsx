'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/rich-text-editor'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Settings,
  Star,
  Calendar,
  Tag,
  Image,
  Type,
  Search,
  Globe,
  BarChart3
} from 'lucide-react'

interface Post {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  coverImage?: string
  seoTitle: string
  seoDescription: string
  tags: string[]
  publishedAt?: string
  readingTime?: number
}

interface PostEditorProps {
  postId?: string
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter()
  const [post, setPost] = useState<Post>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    tags: [],
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [showSEO, setShowSEO] = useState(false)

  const isEditing = !!postId

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && post.title) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setPost(prev => ({ ...prev, slug }))
    }
  }, [post.title, isEditing])

  // Auto-generate SEO title from title
  useEffect(() => {
    if (post.title && !post.seoTitle) {
      setPost(prev => ({ ...prev, seoTitle: post.title }))
    }
  }, [post.title, post.seoTitle])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (post.content && !post.excerpt) {
      const plainText = post.content.replace(/<[^>]*>/g, '').substring(0, 160)
      setPost(prev => ({ ...prev, excerpt: plainText + '...' }))
    }
  }, [post.content, post.excerpt])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePost = async (status?: string) => {
    try {
      setSaving(true)
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing ? `/api/posts/${postId}` : '/api/posts'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status: status || post.status,
          publishedAt: status === 'published' ? new Date().toISOString() : post.publishedAt,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (!isEditing) {
          router.push(`/posts/${data.post.id}/edit`)
        } else {
          setPost(data.post)
        }
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag && !post.tags.includes(newTag)) {
      setPost(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
  }

  const calculateReadingTime = (content: string) => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(' ').length
    return Math.ceil(wordCount / 200) // 200 words per minute
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/posts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
                {post.featured && (
                  <Badge variant="outline" className="text-amber-600">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSEO(!showSEO)}
            >
              <Search className="h-4 w-4 mr-2" />
              SEO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => savePost('draft')}
              loading={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={() => savePost('published')}
              loading={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              {post.status === 'published' ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Editor */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Title & Slug */}
            <Card className="glass">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title..."
                    className="text-lg font-semibold"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Preview: /blog/{post.slug || 'your-post-slug'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card className="glass">
              <CardContent className="p-6">
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your post..."
                  className="w-full mt-2 p-3 border border-border rounded-lg bg-background resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {post.excerpt.length}/160 characters
                </p>
              </CardContent>
            </Card>

            {/* Rich Text Editor */}
            <RichTextEditor
              content={post.content}
              onChange={(content) => setPost(prev => ({ ...prev, content }))}
              placeholder="Start writing your amazing post..."
            />

            {/* SEO Section */}
            {showSEO && (
              <Card className="glass border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={post.seoTitle}
                      onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="SEO optimized title..."
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.seoTitle.length}/60 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Meta Description</Label>
                    <textarea
                      id="seoDescription"
                      value={post.seoDescription}
                      onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="SEO meta description..."
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background resize-none"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.seoDescription.length}/160 characters
                    </p>
                  </div>
                  
                  {/* SEO Preview */}
                  <div className="p-4 border border-border rounded-lg bg-muted/20">
                    <h4 className="text-sm font-medium mb-2">Search Preview</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {post.seoTitle || post.title || 'Your Post Title'}
                      </div>
                      <div className="text-green-700 text-sm">
                        https://yourblog.com/blog/{post.slug || 'your-post-slug'}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {post.seoDescription || post.excerpt || 'Your post description will appear here...'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Publication Status */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-sm">Publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <select
                      value={post.status}
                      onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={post.featured}
                      onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="featured" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Featured Post
                    </Label>
                  </div>
                  {post.status === 'published' && (
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Published {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'now'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click tags to remove them
                  </p>
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Cover Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.coverImage ? (
                    <div className="space-y-2">
                      <img 
                        src={post.coverImage} 
                        alt="Cover" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setPost(prev => ({ ...prev, coverImage: '' }))}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No cover image selected
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const url = prompt('Enter image URL:')
                          if (url) setPost(prev => ({ ...prev, coverImage: url }))
                        }}
                      >
                        Add Cover Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Post Statistics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reading Time</span>
                    <span className="text-sm font-medium">
                      {calculateReadingTime(post.content)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Word Count</span>
                    <span className="text-sm font-medium">
                      {post.content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Characters</span>
                    <span className="text-sm font-medium">
                      {post.content.replace(/<[^>]*>/g, '').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <span className="text-sm font-medium">
                      {post.tags.length}
                    </span>
                  </div>
                  {isEditing && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Views</span>
                      <span className="text-sm font-medium">
                        {Math.floor(Math.random() * 1000)} {/* Mock data */}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Preview in New Tab
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View on Site
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}