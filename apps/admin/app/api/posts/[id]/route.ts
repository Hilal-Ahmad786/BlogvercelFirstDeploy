// apps/admin/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/mock-posts'
import { getCategoryById } from '@/lib/mock-categories'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = getPostById(params.id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postData = await request.json()
    
    console.log('Updating post:', params.id, postData)
    
    // Get category information
    let categoryName = 'General'
    if (postData.categoryId) {
      const category = getCategoryById(postData.categoryId)
      if (category) {
        categoryName = category.name
      }
    }
    
    const updatedPost = updatePost(params.id, {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      status: postData.status,
      featured: postData.featured || false,
      categoryId: postData.categoryId || '',
      categoryName: categoryName,
      publishedAt: postData.status === 'published' && !postData.publishedAt ? new Date().toISOString() : postData.publishedAt,
      seoTitle: postData.seoTitle,
      seoDescription: postData.seoDescription,
      tags: postData.tags || []
    })
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    console.log('Updated post:', updatedPost)
    
    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deletePost(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}