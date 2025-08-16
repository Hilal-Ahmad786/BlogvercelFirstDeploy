'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon,
  FolderIcon,
  CalendarIcon
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
          description: newCategory.description.trim(),
          color: newCategory.color,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([...categories, data.category])
        setNewCategory({ name: '', description: '', color: '#3B82F6' })
        setShowCreateForm(false)
        alert('Category created successfully!')
      } else {
        alert('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Failed to create category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id))
        alert('Category deleted successfully!')
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600">Organize your blog posts with categories</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name..."
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="categorySlug">URL Slug</Label>
                <Input
                  id="categorySlug"
                  value={newCategory.name.toLowerCase().replace(/\s+/g, '-')}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                placeholder="Category description..."
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCategory}>
                Create Category
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-gray-600">Total Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.postCount > 0).length}
            </div>
            <div className="text-sm text-gray-600">Active Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.postCount === 0).length}
            </div>
            <div className="text-sm text-gray-600">Empty Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-4">
              {searchTerm ? 'No categories found matching your search' : 'No categories found'}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Your First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <EditIcon className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FolderIcon className="w-3 h-3" />
                    {category.postCount} posts
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDate(category.createdAt)}
                  </div>
                </div>
                
                <div className="mt-3">
                  <Badge variant="outline">/{category.slug}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}