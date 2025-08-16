// apps/admin/lib/mock-posts.ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  readingTime: number
  author: {
    id: string
    name: string
    avatar?: string
  }
  categoryId: string
  categoryName: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  views?: number
}

// Storage keys
const POSTS_STORAGE_KEY = 'blog_posts'

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

// Default posts
const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to Your Blog Admin",
    slug: "welcome-to-blog-admin",
    excerpt: "This is your first blog post created through the admin panel.",
    content: "# Welcome to Your Blog Admin\n\nThis is your first blog post! You can now create, edit, and manage your content.\n\n## Getting Started\n\n1. Click \"New Post\" to create content\n2. Use the editor to write your posts\n3. Publish when ready\n\nHappy blogging! 🚀",
    status: "published",
    featured: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: 2,
    author: {
      id: "admin-1",
      name: "Admin User"
    },
    categoryId: "1",
    categoryName: "General",
    tags: ["welcome", "admin", "getting-started"],
    seoTitle: "Welcome to Your Blog Admin",
    seoDescription: "Learn how to use your new blog admin panel.",
    views: 42
  }
]

let posts: BlogPost[] = []

// Initialize posts
function initializePosts() {
  posts = loadFromStorage(POSTS_STORAGE_KEY, defaultPosts)
}

// Auto-initialize
if (isClient()) {
  initializePosts()
}

export function getAllPosts(): BlogPost[] {
  if (posts.length === 0) {
    initializePosts()
  }
  return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getPostById(id: string): BlogPost | null {
  const allPosts = getAllPosts()
  return allPosts.find(post => post.id === id) || null
}

export function createPost(postData: {
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  featured: boolean
  categoryId: string
  categoryName: string
  publishedAt?: string | null
  seoTitle?: string
  seoDescription?: string
  tags: string[]
}): BlogPost {
  const allPosts = getAllPosts()
  
  const newPost: BlogPost = {
    id: Date.now().toString(),
    title: postData.title,
    slug: postData.slug,
    excerpt: postData.excerpt,
    content: postData.content,
    status: postData.status,
    featured: postData.featured,
    publishedAt: postData.status === 'published' ? (postData.publishedAt || new Date().toISOString()) : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: Math.ceil(postData.content.split(' ').length / 200) || 1,
    author: {
      id: 'admin-1',
      name: 'Admin User'
    },
    categoryId: postData.categoryId,
    categoryName: postData.categoryName,
    tags: postData.tags,
    seoTitle: postData.seoTitle,
    seoDescription: postData.seoDescription,
    views: 0
  }

  allPosts.push(newPost)
  posts = allPosts
  saveToStorage(POSTS_STORAGE_KEY, allPosts)
  
  return newPost
}

export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const allPosts = getAllPosts()
  const postIndex = allPosts.findIndex(p => p.id === id)
  
  if (postIndex === -1) return null
  
  allPosts[postIndex] = {
    ...allPosts[postIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  posts = allPosts
  saveToStorage(POSTS_STORAGE_KEY, allPosts)
  
  return allPosts[postIndex]
}

export function deletePost(id: string): boolean {
  const allPosts = getAllPosts()
  const filteredPosts = allPosts.filter(p => p.id !== id)
  
  if (filteredPosts.length === allPosts.length) return false
  
  posts = filteredPosts
  saveToStorage(POSTS_STORAGE_KEY, filteredPosts)
  
  return true
}