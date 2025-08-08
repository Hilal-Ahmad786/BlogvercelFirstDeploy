// packages/database/src/seed.ts
import { db } from './client'
import { users, posts, categories, tags, postCategories, postTags } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await db.insert(users).values({
      id: 'admin-user-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Blog administrator',
      isActive: true,
    }).returning()

    console.log('✅ Created admin user:', adminUser[0].email)

    // Create editor user
    const editorPassword = await bcrypt.hash('editor123', 12)
    
    const editorUser = await db.insert(users).values({
      id: 'editor-user-1',
      name: 'Editor User',
      email: 'editor@example.com',
      password: editorPassword,
      role: 'editor',
      bio: 'Blog editor',
      isActive: true,
    }).returning()

    console.log('✅ Created editor user:', editorUser[0].email)

    // Create categories
    const techCategory = await db.insert(categories).values({
      id: 'cat-tech',
      name: 'Technology',
      slug: 'technology',
      description: 'Posts about technology and programming',
      color: '#3B82F6',
    }).returning()

    const personalCategory = await db.insert(categories).values({
      id: 'cat-personal',
      name: 'Personal',
      slug: 'personal',
      description: 'Personal thoughts and experiences',
      color: '#8B5CF6',
    }).returning()

    console.log('✅ Created categories')

    // Create tags
    const nextjsTag = await db.insert(tags).values({
      id: 'tag-nextjs',
      name: 'Next.js',
      slug: 'nextjs',
      description: 'Posts about Next.js framework',
    }).returning()

    const reactTag = await db.insert(tags).values({
      id: 'tag-react',
      name: 'React',
      slug: 'react',
      description: 'Posts about React library',
    }).returning()

    const blogTag = await db.insert(tags).values({
      id: 'tag-blog',
      name: 'Blog',
      slug: 'blog',
      description: 'Posts about blogging',
    }).returning()

    console.log('✅ Created tags')

    // Create sample posts
    const post1 = await db.insert(posts).values({
      id: 'post-1',
      title: 'Welcome to 100lesme Blog',
      slug: 'welcome-to-100lesme-blog',
      excerpt: 'This is the first post on our new blog platform built with Next.js and modern web technologies.',
      content: `# Welcome to 100lesme Blog

This is our first blog post! This platform is built with:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Drizzle ORM** for database management
- **SQLite/PostgreSQL** for data storage

## Features

- ✅ Modern admin panel
- ✅ Rich text editing
- ✅ Media management
- ✅ SEO optimization
- ✅ Dark/light theme support
- ✅ Responsive design

Stay tuned for more updates!`,
      status: 'published',
      featured: true,
      viewCount: 42,
      readingTime: 2,
      seoTitle: 'Welcome to 100lesme Blog - Modern Blog Platform',
      seoDescription: 'Introducing our new blog platform built with Next.js and modern web technologies.',
      authorId: adminUser[0].id,
      publishedAt: new Date().toISOString(),
    }).returning()

    const post2 = await db.insert(posts).values({
      id: 'post-2',
      title: 'Building Modern Web Applications',
      slug: 'building-modern-web-applications',
      excerpt: 'A comprehensive guide to building modern web applications with React and Next.js.',
      content: `# Building Modern Web Applications

In this post, we'll explore the best practices for building modern web applications.

## Key Technologies

1. **Frontend Framework**: React/Next.js
2. **Styling**: Tailwind CSS
3. **Database**: PostgreSQL with Drizzle ORM
4. **Authentication**: NextAuth.js
5. **Deployment**: Vercel

## Best Practices

- Use TypeScript for better development experience
- Implement proper SEO optimization
- Follow accessibility guidelines
- Optimize for performance

More content coming soon...`,
      status: 'draft',
      featured: false,
      viewCount: 15,
      readingTime: 5,
      authorId: editorUser[0].id,
    }).returning()

    console.log('✅ Created sample posts')

    // Link posts to categories
    await db.insert(postCategories).values([
      { postId: post1[0].id, categoryId: techCategory[0].id },
      { postId: post2[0].id, categoryId: techCategory[0].id },
      { postId: post2[0].id, categoryId: personalCategory[0].id },
    ])

    // Link posts to tags
    await db.insert(postTags).values([
      { postId: post1[0].id, tagId: blogTag[0].id },
      { postId: post2[0].id, tagId: nextjsTag[0].id },
      { postId: post2[0].id, tagId: reactTag[0].id },
    ])

    console.log('✅ Linked posts to categories and tags')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('👤 Admin: admin@example.com / admin123')
    console.log('✏️  Editor: editor@example.com / editor123')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Seed script failed:', error)
  process.exit(1)
})