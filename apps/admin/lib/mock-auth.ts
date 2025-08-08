// Mock authentication for testing
const MOCK_USERS = [
  { 
    id: 'admin-1', 
    email: 'admin@example.com', 
    password: 'admin123', 
    name: 'Admin User', 
    role: 'admin' as const 
  },
  { 
    id: 'editor-1', 
    email: 'editor@example.com', 
    password: 'editor123', 
    name: 'Editor User', 
    role: 'editor' as const 
  }
]

export async function mockLogin(email: string, password: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password)
  if (!user) return null
  
  return { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role 
  }
}

export async function mockGetUser(sessionId: string) {
  const user = MOCK_USERS.find(u => u.id === sessionId)
  if (!user) return null
  
  return { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role 
  }
}
