interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author' | 'subscriber'
  status: 'active' | 'inactive' | 'banned'
  avatar?: string
  bio?: string
  website?: string
  postsCount: number
  lastLogin: string
  createdAt: string
  permissions: string[]
}

let mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    bio: 'System administrator and founder',
    website: 'https://johnadmin.com',
    postsCount: 12,
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['all']
  },
  {
    id: 'editor-1',
    name: 'Sarah Editor',
    email: 'editor@example.com',
    role: 'editor',
    status: 'active',
    bio: 'Content editor and strategist',
    postsCount: 8,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['posts.create', 'posts.edit', 'posts.delete', 'posts.publish', 'media.upload', 'media.delete', 'categories.manage']
  },
  {
    id: 'author-1',
    name: 'Mike Writer',
    email: 'mike@example.com',
    role: 'author',
    status: 'active',
    bio: 'Technology blogger and software developer',
    website: 'https://mikewriter.dev',
    postsCount: 15,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['posts.create', 'posts.edit.own', 'posts.delete.own', 'media.upload']
  }
]

export function getAllUsers() {
  return mockUsers.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
}

export function getUserById(id: string) {
  return mockUsers.find(user => user.id === id)
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'postsCount' | 'permissions'>) {
  const rolePermissions = {
    admin: ['all'],
    editor: ['posts.create', 'posts.edit', 'posts.delete', 'posts.publish', 'media.upload', 'media.delete', 'categories.manage'],
    author: ['posts.create', 'posts.edit.own', 'posts.delete.own', 'media.upload'],
    subscriber: ['posts.read', 'comments.create']
  }

  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    postsCount: 0,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    permissions: rolePermissions[userData.role]
  }
  
  mockUsers.unshift(newUser)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>) {
  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return null
  
  mockUsers[index] = {
    ...mockUsers[index],
    ...updates
  }
  
  return mockUsers[index]
}

export function deleteUser(id: string) {
  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return false
  
  mockUsers.splice(index, 1)
  return true
}
