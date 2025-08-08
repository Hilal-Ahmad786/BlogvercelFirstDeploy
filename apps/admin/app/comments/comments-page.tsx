'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Reply,
  Trash2,
  Eye,
  EyeOff,
  Flag,
  User,
  Calendar,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Ban,
  Mail,
  ExternalLink
} from 'lucide-react'

interface Comment {
  id: string
  postId: string
  postTitle: string
  author: {
    name: string
    email: string
    avatar?: string
    isRegistered: boolean
  }
  content: string
  status: 'approved' | 'pending' | 'spam' | 'trash'
  createdAt: string
  updatedAt: string
  parentId?: string
  replies?: Comment[]
  likes: number
  dislikes: number
  isEdited: boolean
  ipAddress: string
  userAgent: string
  flagged: boolean
  flagReasons: string[]
}

interface CommentStats {
  total: number
  approved: number
  pending: number
  spam: number
  trash: number
  todayCount: number
  averagePerPost: number
}

export default function CommentsManagementPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState<CommentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    fetchComments()
    fetchStats()
  }, [])

  const fetchComments = async () => {
    try {
      // Mock data
      setTimeout(() => {
        setComments([
          {
            id: '1',
            postId: 'post-1',
            postTitle: 'Getting Started with Next.js',
            author: {
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
              isRegistered: true
            },
            content: 'Great article! Really helped me understand the basics of Next.js. Looking forward to more content like this.',
            status: 'approved',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 5,
            dislikes: 0,
            isEdited: false,
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            flagged: false,
            flagReasons: []
          },
          {
            id: '2',
            postId: 'post-1',
            postTitle: 'Getting Started with Next.js',
            author: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              isRegistered: false
            },
            content: 'Thanks for sharing! Could you also cover deployment strategies?',
            status: 'pending',
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            likes: 2,
            dislikes: 0,
            isEdited: false,
            ipAddress: '192.168.1.2',
            userAgent: 'Mozilla/5.0...',
            flagged: false,
            flagReasons: []
          },
          {
            id: '3',
            postId: 'post-2',
            postTitle: 'Advanced React Patterns',
            author: {
              name: 'Spam Bot',
              email: 'spam@fake.com',
              isRegistered: false
            },
            content: 'Check out my amazing product at spamlink.com! Buy now for 50% off!!!',
            status: 'spam',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            likes: 0,
            dislikes: 3,
            isEdited: false,
            ipAddress: '192.168.1.3',
            userAgent: 'Bot/1.0',
            flagged: true,
            flagReasons: ['spam', 'inappropriate_content']
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    setStats({
      total: 127,
      approved: 89,
      pending: 15,
      spam: 18,
      trash: 5,
      todayCount: 8,
      averagePerPost: 4.2
    })
  }

  const updateCommentStatus = async (commentId: string, status: Comment['status']) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, status } : comment
    ))
  }

  const deleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      setComments(comments.filter(comment => comment.id !== commentId))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'spam': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'trash': return <Trash2 className="h-4 w-4 text-gray-500" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'spam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'trash': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    return matchesSearch && matchesStatus
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
          <h1 className="text-3xl font-bold gradient-text">Comments</h1>
          <p className="text-muted-foreground">
            Manage and moderate user comments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Flag className="h-4 w-4 mr-2" />
            Flagged ({comments.filter(c => c.flagged).length})
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.spam}
              </div>
              <div className="text-sm text-muted-foreground">Spam</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.trash}
              </div>
              <div className="text-sm text-muted-foreground">Trash</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.todayCount}
              </div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.averagePerPost.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg/Post</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Search */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments, authors, or posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="spam">Spam</option>
                <option value="trash">Trash</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No comments found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No comments have been posted yet'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className="glass hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {comment.author.avatar ? (
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author.name}</span>
                          {comment.author.isRegistered && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          )}
                          {comment.flagged && (
                            <Badge variant="destructive" className="text-xs">
                              <Flag className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {comment.author.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {comment.postTitle}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <Badge className={getStatusColor(comment.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(comment.status)}
                          {comment.status}
                        </span>
                      </Badge>
                    </div>

                    {/* Comment Content */}
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <p className="text-sm">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {comment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateCommentStatus(comment.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateCommentStatus(comment.id, 'spam')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Spam
                        </Button>

                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
