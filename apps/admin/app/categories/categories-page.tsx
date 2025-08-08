'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  FolderOpen,
  Palette,
  FileText,
  MoreHorizontal,
  Hash,
  Calendar
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F472B6'
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async () => {
    if (!newCategory.name.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([data.category, ...categories])
        setNewCategory({ name: '', description: '', color: '#3B82F6' })
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(categories.map(cat => 
          cat.id === id ? data.category : cat
        ))
        setEditingCategory(null)
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const deleteCategory = async (id: string) => {
    const category = categories.find(cat => cat.id === id)
    if (!category) return

    if (category.postCount > 0) {
      if (!confirm(`This category has ${category.postCount} posts. Are you sure you want to delete it? The posts will be uncategorized.`)) {
        return
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) {
        return
      }
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold gradient-text">Categories</h1>
          <p className="text-muted-foreground">
            Organize your blog posts with categories
          </p>
        </div>RetryKContinueEditbash# Continue the categories page component
       <Button 
         onClick={() => setIsCreating(true)}
         className="btn-hover-lift"
       >
         <Plus className="mr-2 h-4 w-4" />
         New Category
       </Button>
     </div>

     {/* Search */}
     <Card className="glass">
       <CardContent className="p-4">
         <div className="relative">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search categories..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10"
           />
         </div>
       </CardContent>
     </Card>

     {/* Create Category Form */}
     {isCreating && (
       <Card className="glass border-primary/20">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Plus className="h-5 w-5" />
             Create New Category
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid md:grid-cols-2 gap-4">
             <div>
               <Label htmlFor="name">Category Name</Label>
               <Input
                 id="name"
                 value={newCategory.name}
                 onChange={(e) => setNewCategory(prev => ({ 
                   ...prev, 
                   name: e.target.value 
                 }))}
                 placeholder="Enter category name..."
               />
             </div>
             <div>
               <Label htmlFor="slug">URL Slug</Label>
               <Input
                 id="slug"
                 value={generateSlug(newCategory.name)}
                 readOnly
                 className="bg-muted"
               />
             </div>
           </div>
           
           <div>
             <Label htmlFor="description">Description</Label>
             <textarea
               id="description"
               value={newCategory.description}
               onChange={(e) => setNewCategory(prev => ({ 
                 ...prev, 
                 description: e.target.value 
               }))}
               placeholder="Category description..."
               className="w-full mt-1 p-3 border border-border rounded-lg bg-background resize-none"
               rows={3}
             />
           </div>

           <div>
             <Label>Color</Label>
             <div className="flex gap-2 mt-2">
               {colorOptions.map((color) => (
                 <button
                   key={color}
                   onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                   className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                     newCategory.color === color ? 'border-white shadow-lg scale-110' : 'border-gray-300'
                   }`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
           </div>

           <div className="flex justify-end gap-2">
             <Button 
               variant="outline" 
               onClick={() => {
                 setIsCreating(false)
                 setNewCategory({ name: '', description: '', color: '#3B82F6' })
               }}
             >
               Cancel
             </Button>
             <Button onClick={createCategory}>
               Create Category
             </Button>
           </div>
         </CardContent>
       </Card>
     )}

     {/* Categories List */}
     {filteredCategories.length === 0 ? (
       <Card className="glass">
         <CardContent className="p-8 text-center">
           <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
           <h3 className="text-lg font-medium mb-2">No categories found</h3>
           <p className="text-muted-foreground mb-4">
             {searchTerm 
               ? 'Try adjusting your search term'
               : 'Create your first category to organize your posts'
             }
           </p>
           {!searchTerm && (
             <Button onClick={() => setIsCreating(true)}>
               <Plus className="mr-2 h-4 w-4" />
               Create First Category
             </Button>
           )}
         </CardContent>
       </Card>
     ) : (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {filteredCategories.map((category) => (
           <Card key={category.id} className="glass hover:shadow-lg transition-all duration-200 group">
             <CardContent className="p-6">
               <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div 
                     className="w-4 h-4 rounded-full"
                     style={{ backgroundColor: category.color }}
                   />
                   <div>
                     <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                       {category.name}
                     </h3>
                     <p className="text-sm text-muted-foreground">
                       /{category.slug}
                     </p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button 
                     variant="ghost" 
                     size="sm"
                     className="h-8 w-8 p-0"
                     onClick={() => setEditingCategory(category)}
                   >
                     <Edit3 className="h-4 w-4" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                     onClick={() => deleteCategory(category.id)}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>

               {category.description && (
                 <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                   {category.description}
                 </p>
               )}

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <FileText className="h-4 w-4" />
                   <span>{category.postCount} posts</span>
                 </div>
                 <div className="text-xs text-muted-foreground">
                   {new Date(category.createdAt).toLocaleDateString()}
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     )}

     {/* Edit Category Modal */}
     {editingCategory && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <Card className="w-full max-w-md glass">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Edit3 className="h-5 w-5" />
               Edit Category
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div>
               <Label htmlFor="edit-name">Category Name</Label>
               <Input
                 id="edit-name"
                 value={editingCategory.name}
                 onChange={(e) => setEditingCategory(prev => prev ? ({ 
                   ...prev, 
                   name: e.target.value 
                 }) : null)}
               />
             </div>
             
             <div>
               <Label htmlFor="edit-description">Description</Label>
               <textarea
                 id="edit-description"
                 value={editingCategory.description}
                 onChange={(e) => setEditingCategory(prev => prev ? ({ 
                   ...prev, 
                   description: e.target.value 
                 }) : null)}
                 className="w-full mt-1 p-3 border border-border rounded-lg bg-background resize-none"
                 rows={3}
               />
             </div>

             <div>
               <Label>Color</Label>
               <div className="flex gap-2 mt-2">
                 {colorOptions.map((color) => (
                   <button
                     key={color}
                     onClick={() => setEditingCategory(prev => prev ? ({ ...prev, color }) : null)}
                     className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                       editingCategory.color === color ? 'border-white shadow-lg scale-110' : 'border-gray-300'
                     }`}
                     style={{ backgroundColor: color }}
                   />
                 ))}
               </div>
             </div>

             <div className="flex justify-end gap-2">
               <Button 
                 variant="outline" 
                 onClick={() => setEditingCategory(null)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={() => updateCategory(editingCategory.id, {
                   name: editingCategory.name,
                   description: editingCategory.description,
                   color: editingCategory.color,
                   slug: generateSlug(editingCategory.name)
                 })}
               >
                 Update Category
               </Button>
             </div>
           </CardContent>
         </Card>
       </div>
     )}

     {/* Statistics */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       <Card className="glass">
         <CardContent className="p-4 text-center">
           <div className="text-2xl font-bold text-blue-600">
             {categories.length}
           </div>
           <div className="text-sm text-muted-foreground">Total Categories</div>
         </CardContent>
       </Card>
       <Card className="glass">
         <CardContent className="p-4 text-center">
           <div className="text-2xl font-bold text-green-600">
             {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
           </div>
           <div className="text-sm text-muted-foreground">Categorized Posts</div>
         </CardContent>
       </Card>
       <Card className="glass">
         <CardContent className="p-4 text-center">
           <div className="text-2xl font-bold text-purple-600">
             {categories.filter(cat => cat.postCount > 0).length}
           </div>
           <div className="text-sm text-muted-foreground">Active Categories</div>
         </CardContent>
       </Card>
       <Card className="glass">
         <CardContent className="p-4 text-center">
           <div className="text-2xl font-bold text-orange-600">
             {Math.round((categories.reduce((sum, cat) => sum + cat.postCount, 0) / categories.length) || 0)}
           </div>
           <div className="text-sm text-muted-foreground">Avg Posts/Category</div>
         </CardContent>
       </Card>
     </div>
   </div>
 )
}
