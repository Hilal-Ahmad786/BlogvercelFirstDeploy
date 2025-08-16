
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AdvancedRichTextEditor } from '@/components/advanced-rich-text-editor'
import { 
  ArrowLeftIcon, 
  SaveIcon, 
  SendIcon,
  SettingsIcon,
  TagIcon,
  Edit3Icon
} from 'lucide-react'

interface PostData {
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  featured: boolean
  categoryId: string
  seoTitle: string
  seoDescription: string
  tags: string[]
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export default function PostEditor() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich')
  
  const [post, setPost] = useState<PostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured: false,
    categoryId: '',
    seoTitle: '',
    seoDescription: '',
    tags: []
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
        if (data.categories && data.categories.length > 0 && !post.categoryId) {
          setPost(prev => ({ ...prev, categoryId: data.categories[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title
    }))
  }

  // ✅ THIS IS THE MISSING FUNCTION
  const handleContentChange = (content: string) => {
    console.log('Content changed:', content) // Debug log
    setPost(prev => ({ ...prev, content }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!post.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status,
          seoTitle: post.seoTitle || post.title,
          seoDescription: post.seoDescription || post.excerpt
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      const data = await response.json()
      
      alert(status === 'published' ? 'Post published successfully!' : 'Post saved as draft!')
      router.push('/posts')
      
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedCategory = categories.find(cat => cat.id === post.categoryId)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Post</h1>
            <p className="text-sm text-gray-600">Create a new blog post</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={() => handleSave('published')}
            disabled={saving || !post.title}
          >
            <SendIcon className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Details */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg"
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
                <p className="text-xs text-gray-500 mt-1">
                  Preview: /blog/{post.slug || 'your-post-slug'}
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={post.categoryId}
                  onChange={(e) => setPost(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span className="text-xs text-gray-600">{selectedCategory.name}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your post..."
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {post.excerpt.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Editor</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={editorMode === 'rich' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditorMode('rich')}
                  >
                    <Edit3Icon className="w-4 h-4 mr-1" />
                    Rich
                  </Button>
                  <Button
                    variant={editorMode === 'markdown' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditorMode('markdown')}
                  >
                    Markdown
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editorMode === 'rich' ? (
                <AdvancedRichTextEditor
                  value={post.content}
                  onChange={handleContentChange}
                  placeholder="Write your post content here... Use the toolbar to format your text."
                  className="min-h-[400px]"
                />
              ) : (
                <Textarea
                  placeholder="Write your post content here... You can use Markdown formatting."
                  value={post.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={20}
                  className="font-mono resize-none"
                  style={{ 
                    direction: 'ltr', 
                    textAlign: 'left',
                    unicodeBidi: 'normal',
                    writingMode: 'horizontal-tb'
                  }}
                  dir="ltr"
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                {editorMode === 'rich' ? 'Rich text editor with formatting options' : 'Supports Markdown formatting'}. {post.content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.trim()).length} words
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={post.featured}
                  onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="SEO optimized title..."
                  value={post.seoTitle}
                  onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="SEO meta description..."
                  value={post.seoDescription}
                  onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {post.seoDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TagIcon className="w-4 h-4 mr-2" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter tags separated by commas..."
                value={post.tags.join(', ')}
                onChange={(e) => setPost(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}