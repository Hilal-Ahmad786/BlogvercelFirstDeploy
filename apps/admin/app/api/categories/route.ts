import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, createCategory } from '@/lib/mock-categories'

export async function GET() {
  try {
    const categories = getAllCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json()
    
    console.log('Received category data:', categoryData)
    
    // Validate required fields
    if (!categoryData.name || !categoryData.name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }
    
    const newCategory = createCategory({
      name: categoryData.name.trim(),
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description || '',
      color: categoryData.color || '#3B82F6'
    })
    
    console.log('Created category:', newCategory)
    
    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}