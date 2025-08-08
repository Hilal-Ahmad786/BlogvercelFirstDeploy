interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  viewCount: number
  authorId: string
  authorName: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  seoTitle: string
  seoDescription: string
  tags: string[]
}

let mockPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to Your Blog Admin',
    slug: 'welcome-to-blog-admin',
    excerpt: 'This is your first blog post created through the admin panel. You can edit, delete, or create new posts.',
    content: `# Welcome to Your Blog Admin

This is your first blog post! You can now:

- ✅ Create new posts
- ✅ Edit existing posts  
- ✅ Manage drafts and published content
- ✅ Add tags and SEO optimization
- ✅ Feature important posts

Start writing amazing content for your blog!

## Getting Started

1. Click "New Post" to create content
2. Use the editor to write your posts
3. Set SEO titles and descriptions
4. Publish when ready

Happy blogging! 🚀`,
    status: 'published',
    featured: true,
    viewCount: 42,
    authorId: 'admin-1',
    authorName: 'Admin User',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seoTitle: 'Welcome to Your Blog Admin - Get Started',
    seoDescription: 'Learn how to use your new blog admin panel to create and manage content.',
    tags: ['welcome', 'admin', 'getting-started']
  },
  {
    id: '2',
    title: 'How to Write Great Blog Posts',
    slug: 'how-to-write-great-blog-posts',
    excerpt: 'Learn the secrets of writing engaging blog posts that your readers will love.',
    content: `# How to Write Great Blog Posts

Writing great blog posts is an art and a science...

## Key Tips

1. **Start with a compelling headline**
2. **Write for your audience**
3. **Use clear structure**
4. **Add value**
5. **Include a call-to-action**

More content coming soon!`,
    status: 'draft',
    featured: false,
    viewCount: 15,
    authorId: 'admin-1',
    authorName: 'Admin User',
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    seoTitle: 'How to Write Great Blog Posts - Writing Guide',
    seoDescription: 'Master the art of blog writing with these proven tips and strategies.',
    tags: ['writing', 'blogging', 'tips']
  }
]

export function getAllPosts() {
  return mockPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getPostById(id: string) {
  return mockPosts.find(post => post.id === id)
}

export function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'authorId' | 'authorName'>) {
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(),
    viewCount: 0,
    authorId: 'admin-1',
    authorName: 'Admin User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockPosts.push(newPost)
  return newPost
}

export function updatePost(id: string, updates: Partial<Post>) {
  const index = mockPosts.findIndex(post => post.id === id)
  if (index === -1) return null
  
  mockPosts[index] = {
    ...mockPosts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockPosts[index]
}

export function deletePost(id: string) {
  const index = mockPosts.findIndex(post => post.id === id)
  if (index === -1) return false
  
  mockPosts.splice(index, 1)
  return true
}
