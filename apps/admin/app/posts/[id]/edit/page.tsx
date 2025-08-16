// apps/admin/app/posts/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  Edit3Icon,
  TrashIcon
} from 'lucide-react'

interface PostData {
  id: string
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

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich')
  const [post, setPost] = useState<PostData | null>(null)

  // Fetch post data and categories on component mount
  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchCategories()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost({
          id: data.post.id,
          title: data.post.title,
          slug: data.post.slug,
          excerpt: data.post.excerpt,
          content: data.post.content,
          status: data.post.status,
          featured: data.post.featured,
          categoryId: data.post.categoryId,
          seoTitle: data.post.seoTitle || data.post.title,
          seoDescription: data.post.seoDescription || data.post.excerpt,
          tags: data.post.tags || []
        })
      } else {
        throw new Error('Post not found')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Failed to load post')
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
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
    if (!post) return
    setPost(prev => prev ? ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title
    }) : null)
  }

  // ✅ Content change handler
  const handleContentChange = (content: string) => {
    console.log('Content changed:', content) // Debug log
    if (!post) return
    setPost(prev => prev ? ({ ...prev, content }) : null)
  }

  const handleUpdate = async (status?: 'draft' | 'published') => {
    if (!post || !post.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status: status || post.status,
          seoTitle: post.seoTitle || post.title,
          seoDescription: post.seoDescription || post.excerpt
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      // Show success message
      alert(status === 'published' ? 'Post published successfully!' : 'Post updated successfully!')
      
      // Redirect to posts list
      router.push('/posts')
      
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      alert('Post deleted successfully!')
      router.push('/posts')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">Post not found</div>
      </div>
    )
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
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.status}
              </span>
              {post.featured && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => handleUpdate('draft')}
            disabled={saving}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={() => handleUpdate('published')}
            disabled={saving || !post.title}
          >
            <SendIcon className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : 'Update'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleDelete}
            disabled={saving}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
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
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
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
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, categoryId: e.target.value }) : null)}
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
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, excerpt: e.target.value }) : null)}
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
                  placeholder="Edit your post content..."
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
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, featured: e.target.checked }) : null)}
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
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, seoTitle: e.target.value }) : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="SEO meta description..."
                  value={post.seoDescription}
                  onChange={(e) => setPost(prev => prev ? ({ ...prev, seoDescription: e.target.value }) : null)}
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
                onChange={(e) => setPost(prev => prev ? ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                }) : null)}
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