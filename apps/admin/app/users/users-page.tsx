'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Crown,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  MoreHorizontal,
  Settings,
  Ban,
  CheckCircle
} from 'lucide-react'

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

const rolePermissions = {
  admin: ['all'],
  editor: ['posts.create', 'posts.edit', 'posts.delete', 'posts.publish', 'media.upload', 'media.delete', 'categories.manage'],
  author: ['posts.create', 'posts.edit.own', 'posts.delete.own', 'media.upload'],
  subscriber: ['posts.read', 'comments.create']
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  author: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  subscriber: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'author' as User['role'],
    password: '',
    bio: '',
    website: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers([data.user, ...users])
        setNewUser({ name: '', email: '', role: 'author', password: '', bio: '', website: '' })
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(users.map(user => 
          user.id === id ? data.user : user
        ))
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const deleteUser = async (id: string) => {
    const user = users.find(u => u.id === id)
    if (!user) return

    if (user.postsCount > 0) {
      if (!confirm(`This user has ${user.postsCount} posts. Are you sure you want to delete them? Their posts will be reassigned to admin.`)) {
        return
      }
    } else {
      if (!confirm('Are you sure you want to delete this user?')) {
        return
      }
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await updateUser(id, { status: newStatus })
  }

  const banUser = async (id: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      await updateUser(id, { status: 'banned' })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />
      case 'editor': return <ShieldCheck className="h-4 w-4" />
      case 'author': return <Edit3 className="h-4 w-4" />
      case 'subscriber': return <Eye className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <EyeOff className="h-4 w-4 text-yellow-500" />
      case 'banned': return <Ban className="h-4 w-4 text-red-500" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="btn-hover-lift"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
                <option value="subscriber">Subscriber</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create User Form */}
      {isCreating && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))}
                  placeholder="Enter full name..."
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ 
                    ...prev, 
                    role: e.target.value as User['role']
                  }))}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="subscriber">Subscriber</option>
                </select>
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                  placeholder="Enter temporary password..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio (Optional)</Label>
              <textarea
                id="bio"
                value={newUser.bio}
                onChange={(e) => setNewUser(prev => ({ 
                  ...prev, 
                  bio: e.target.value 
                }))}
                placeholder="Brief bio..."
                className="w-full mt-1 p-3 border border-border rounded-lg bg-background resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={newUser.website}
                onChange={(e) => setNewUser(prev => ({ 
                  ...prev, 
                  website: e.target.value 
                }))}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false)
                  setNewUser({ name: '', email: '', role: 'author', password: '', bio: '', website: '' })
                }}
              >
                Cancel
              </Button>
              <Button onClick={createUser}>
                Create User
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first team member to get started'
              }
            </p>
            {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setIsCreating(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add First User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Posts</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                            {user.website && (
                              <p className="text-xs text-muted-foreground">
                                {user.website}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={roleColors[user.role]}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[user.status]}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            {user.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{user.postsCount}</span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => toggleUserStatus(user.id, user.status)}
                          >
                            {user.status === 'active' ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          {user.status !== 'banned' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-orange-500"
                              onClick={() => banUser(user.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl glass max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Edit User: {editingUser.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser(prev => prev ? ({ 
                      ...prev, 
                      name: e.target.value 
                    }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => prev ? ({ 
                      ...prev, 
                      email: e.target.value 
                    }) : null)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <select
                    id="edit-role"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser(prev => prev ? ({ 
                      ...prev, 
                      role: e.target.value as User['role']
                    }) : null)}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="subscriber">Subscriber</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editingUser.status}
                    onChange={(e) => setEditingUser(prev => prev ? ({ 
                      ...prev, 
                      status: e.target.value as User['status']
                    }) : null)}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-bio">Bio</Label>
                <textarea
                  id="edit-bio"
                  value={editingUser.bio || ''}
                  onChange={(e) => setEditingUser(prev => prev ? ({ 
                    ...prev, 
                    bio: e.target.value 
                  }) : null)}
                  className="w-full mt-1 p-3 border border-border rounded-lg bg-background resize-none"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={editingUser.website || ''}
                  onChange={(e) => setEditingUser(prev => prev ? ({ 
                    ...prev, 
                    website: e.target.value 
                  }) : null)}
                  placeholder="https://example.com"
                />
              </div>

              {/* Permissions Section */}
              <div>
                <Label>Permissions</Label>
                <div className="mt-2 p-3 border border-border rounded-lg bg-muted/20">
                  <p className="text-sm font-medium mb-2">
                    {editingUser.role.charAt(0).toUpperCase() + editingUser.role.slice(1)} Permissions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rolePermissions[editingUser.role].map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission === 'all' ? 'All Permissions' : permission.replace(/\./g, ' → ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateUser(editingUser.id, {
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role,
                    status: editingUser.status,
                    bio: editingUser.bio,
                    website: editingUser.website
                  })}
                >
                  Update User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.role === 'author').length}
            </div>
            <div className="text-sm text-muted-foreground">Authors</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.reduce((sum, user) => sum + user.postsCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
