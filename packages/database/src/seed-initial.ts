//packages/database/src/seed-initial.ts

import { db, users, posts } from './index'
import bcrypt from 'bcrypt'

export async function seedInitialData() {
  console.log('🌱 Seeding initial data...')

  try {
    // Check if admin user already exists
    const existingUsers = await db.select().from(users).limit(1)
    
    if (existingUsers.length > 0) {
      console.log('✅ Data already exists, skipping seed')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = await db.insert(users).values({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@100lesme.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Blog administrator',
      isActive: true,
    }).returning()

    console.log('✅ Admin user created:', adminUser[0].email)

    // Create sample posts
    const samplePosts = [
      {
        title: 'Welcome to Your Blog Admin',
        slug: 'welcome-to-blog-admin',
        excerpt: 'This is your first blog post created through the admin panel.',
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
        status: 'published' as const,
        featured: true,
        authorId: adminUser[0].id,
        publishedAt: new Date().toISOString(),
        seoTitle: 'Welcome to Your Blog Admin - Get Started',
        seoDescription: 'Learn how to use your new blog admin panel to create and manage content.',
      },
      {
        title: 'How to Write Great Blog Posts',
        slug: 'how-to-write-great-blog-posts',
        excerpt: 'Learn the secrets of writing engaging blog posts.',
        content: `# How to Write Great Blog Posts

Writing great blog posts is an art and a science...

## Key Tips

1. **Start with a compelling headline**
2. **Write for your audience**
3. **Use clear structure**
4. **Add value**
5. **Include a call-to-action**

More content coming soon!`,
        status: 'draft' as const,
        featured: false,
        authorId: adminUser[0].id,
        seoTitle: 'How to Write Great Blog Posts - Writing Guide',
        seoDescription: 'Master the art of blog writing with these proven tips.',
      }
    ]

    for (const post of samplePosts) {
      await db.insert(posts).values(post)
    }

    console.log('✅ Sample posts created')
    console.log('🎉 Initial data seeding completed!')
    
    console.log('\n📝 Login credentials:')
    console.log('Email: admin@100lesme.com')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedInitialData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}