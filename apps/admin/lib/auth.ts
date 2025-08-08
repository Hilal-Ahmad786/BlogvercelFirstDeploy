import { NextRequest } from 'next/server'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author' | 'subscriber'
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@claudia-blog.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@claudia-blog.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
  },
  {
    id: '3',
    name: 'Author User',
    email: 'author@claudia-blog.com',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  }
]

export function validateCredentials(email: string, password: string): User | null {
  const validCredentials = [
    { email: 'admin@claudia-blog.com', password: 'admin123' },
    { email: 'editor@claudia-blog.com', password: 'editor123' },
    { email: 'author@claudia-blog.com', password: 'author123' }
  ]

  const isValid = validCredentials.some(cred => 
    cred.email === email && cred.password === password
  )

  if (isValid) {
    return mockUsers.find(user => user.email === email) || null
  }
  return null
}

export function getUserById(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null
}
