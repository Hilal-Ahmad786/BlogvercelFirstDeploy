//apps/admin/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/mock-posts'
import { getCategoryById } from '@/lib/mock-categories'

export async function GET() {
 try {
   const posts = getAllPosts()
   return NextResponse.json({ posts })
 } catch (error) {
   console.error('Failed to fetch posts:', error)
   return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
 }
}

export async function POST(request: NextRequest) {
 try {
   const postData = await request.json()
   
   console.log('Received post data:', postData)
   
   // Get category information
   let categoryName = 'General'
   if (postData.categoryId) {
     const category = getCategoryById(postData.categoryId)
     if (category) {
       categoryName = category.name
       console.log(`Found category: ${categoryName} for ID: ${postData.categoryId}`)
     } else {
       console.warn(`Category not found for ID: ${postData.categoryId}`)
     }
   }
   
   // Create post with category information
   const newPost = createPost({
     title: postData.title,
     slug: postData.slug,
     excerpt: postData.excerpt,
     content: postData.content,
     status: postData.status,
     featured: postData.featured || false,
     categoryId: postData.categoryId || '',
     categoryName: categoryName,
     publishedAt: postData.status === 'published' ? new Date().toISOString() : null,
     seoTitle: postData.seoTitle,
     seoDescription: postData.seoDescription,
     tags: postData.tags || []
   })
   
   console.log('Created post with category:', newPost)
   
   return NextResponse.json({ post: newPost }, { status: 201 })
 } catch (error) {
   console.error('Failed to create post:', error)
   return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
 }
}