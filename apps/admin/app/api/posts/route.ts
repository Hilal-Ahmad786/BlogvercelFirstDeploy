import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/mock-posts'

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
   const newPost = createPost(postData)
   return NextResponse.json({ post: newPost }, { status: 201 })
 } catch (error) {
   console.error('Failed to create post:', error)
   return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
 }
}
