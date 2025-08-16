// apps/admin/lib/mock-categories.ts - UPDATED with Post Count Fix
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

// Storage key
const CATEGORIES_STORAGE_KEY = 'blog_categories'

// Storage helpers
function isClient() {
  return typeof window !== 'undefined'
}

function saveToStorage(key: string, data: any) {
  if (isClient()) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}

function loadFromStorage(key: string, defaultValue: any) {
  if (isClient()) {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return defaultValue
    }
  }
  return defaultValue
}

// Default categories
const defaultCategories: Category[] = [
  {
    id: "1",
    name: "General",
    slug: "general",
    description: "General blog posts",
    color: "#3B82F6",
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Business",
    slug: "business",
    description: "Business strategies, entrepreneurship, and industry insights",
    color: "#10B981",
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Technology",
    slug: "technology",
    description: "Posts about technology, programming, and software",
    color: "#6366F1",
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Lifestyle tips, personal development, and wellness",
    color: "#F59E0B",
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

let categories: Category[] = []

// Initialize categories
function initializeCategories() {
  categories = loadFromStorage(CATEGORIES_STORAGE_KEY, defaultCategories)
}

// Auto-initialize
if (isClient()) {
  initializeCategories()
}

export function getAllCategories(): Category[] {
  if (categories.length === 0) {
    initializeCategories()
  }
  
  // Update post counts from actual posts
  updateAllCategoryPostCounts()
  
  return [...categories].sort((a, b) => a.name.localeCompare(b.name))
}

export function getCategoryById(id: string): Category | null {
  const allCategories = getAllCategories()
  return allCategories.find(category => category.id === id) || null
}

export function getCategoryBySlug(slug: string): Category | null {
  const allCategories = getAllCategories()
  return allCategories.find(category => category.slug === slug) || null
}

export function createCategory(categoryData: {
  name: string
  slug: string
  description: string
  color: string
}): Category {
  const allCategories = getAllCategories()
  
  const newCategory: Category = {
    id: Date.now().toString(),
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description,
    color: categoryData.color,
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  allCategories.push(newCategory)
  categories = allCategories
  saveToStorage(CATEGORIES_STORAGE_KEY, allCategories)
  
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const allCategories = getAllCategories()
  const categoryIndex = allCategories.findIndex(c => c.id === id)
  
  if (categoryIndex === -1) return null
  
  allCategories[categoryIndex] = {
    ...allCategories[categoryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  categories = allCategories
  saveToStorage(CATEGORIES_STORAGE_KEY, allCategories)
  
  return allCategories[categoryIndex]
}

export function deleteCategory(id: string): boolean {
  const allCategories = getAllCategories()
  const filteredCategories = allCategories.filter(c => c.id !== id)
  
  if (filteredCategories.length === allCategories.length) return false
  
  categories = filteredCategories
  saveToStorage(CATEGORIES_STORAGE_KEY, filteredCategories)
  
  return true
}

// NEW FUNCTION: Update post counts for all categories
export function updateAllCategoryPostCounts(): void {
  try {
    // Get posts from localStorage
    const postsData = loadFromStorage('blog_posts', [])
    const publishedPosts = postsData.filter((post: any) => post.status === 'published')
    
    // Count posts per category
    const categoryCounts: Record<string, number> = {}
    const categorySlugCounts: Record<string, number> = {}
    
    publishedPosts.forEach((post: any) => {
      if (post.categoryId) {
        categoryCounts[post.categoryId] = (categoryCounts[post.categoryId] || 0) + 1
      }
      
      // Also count by category name/slug for fallback
      if (post.categoryName) {
        const slug = post.categoryName.toLowerCase().replace(/\s+/g, '-')
        categorySlugCounts[slug] = (categorySlugCounts[slug] || 0) + 1
      }
    })
    
    // Update category post counts
    categories = categories.map(category => ({
      ...category,
      postCount: categoryCounts[category.id] || categorySlugCounts[category.slug] || 0,
      updatedAt: new Date().toISOString()
    }))
    
    saveToStorage(CATEGORIES_STORAGE_KEY, categories)
    
  } catch (error) {
    console.error('Error updating category post counts:', error)
  }
}

export function updateCategoryPostCount(categoryId: string, increment: number = 1): void {
  const category = getCategoryById(categoryId)
  if (category) {
    updateCategory(categoryId, {
      postCount: Math.max(0, category.postCount + increment)
    })
  }
}