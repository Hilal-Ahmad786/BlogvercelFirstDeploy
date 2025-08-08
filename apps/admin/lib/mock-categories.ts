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

let mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Posts about latest technology trends, programming, and digital innovation.',
    color: '#3B82F6',
    postCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Content about daily life, wellness, and personal development.',
    color: '#10B981',
    postCount: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Business',
    slug: 'business',
    description: 'Insights on entrepreneurship, marketing, and business strategy.',
    color: '#F59E0B',
    postCount: 2,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design, creative processes, and visual inspiration.',
    color: '#8B5CF6',
    postCount: 0,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export function getAllCategories() {
  return mockCategories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getCategoryById(id: string) {
  return mockCategories.find(category => category.id === id)
}

export function getCategoryBySlug(slug: string) {
  return mockCategories.find(category => category.slug === slug)
}

export function createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'postCount'>) {
  const slug = categoryData.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const newCategory: Category = {
    ...categoryData,
    id: Date.now().toString(),
    slug,
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  mockCategories.unshift(newCategory)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>) {
  const index = mockCategories.findIndex(category => category.id === id)
  if (index === -1) return null
  
  // If name is being updated, regenerate slug
  if (updates.name) {
    updates.slug = updates.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  mockCategories[index] = {
    ...mockCategories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  return mockCategories[index]
}

export function deleteCategory(id: string) {
  const index = mockCategories.findIndex(category => category.id === id)
  if (index === -1) return false
  
  mockCategories.splice(index, 1)
  return true
}

export function incrementCategoryPostCount(categoryId: string) {
  const category = getCategoryById(categoryId)
  if (category) {
    category.postCount += 1
    category.updatedAt = new Date().toISOString()
  }
}

export function decrementCategoryPostCount(categoryId: string) {
  const category = getCategoryById(categoryId)
  if (category && category.postCount > 0) {
    category.postCount -= 1
    category.updatedAt = new Date().toISOString()
  }
}
