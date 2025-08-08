'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Users,
  FileText,
  Heart,
  MessageSquare,
  Globe,
  Calendar,
  Clock,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalViews: number
    totalPosts: number
    totalCategories: number
    totalMedia: number
    viewsGrowth: number
    postsGrowth: number
  }
  chartData: {
    views: { date: string; views: number }[]
    posts: { date: string; posts: number }[]
  }
  topPosts: {
    id: string
    title: string
    views: number
    growth: number
    category: string
  }[]
  topCategories: {
    id: string
    name: string
    posts: number
    views: number
    color: string
  }[]
  recentActivity: {
    id: string
    type: 'post_created' | 'post_published' | 'media_uploaded' | 'category_created'
    title: string
    time: string
  }[]
  performance: {
    avgReadTime: number
    bounceRate: number
    returningVisitors: number
    topTrafficSources: { source: string; visitors: number; percentage: number }[]
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <span className="h-4 w-4" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-500'
    if (growth < 0) return 'text-red-500'
    return 'text-muted-foreground'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post_created': return <FileText className="h-4 w-4 text-blue-500" />
      case 'post_published': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'media_uploaded': return <Globe className="h-4 w-4 text-purple-500" />
      case 'category_created': return <Star className="h-4 w-4 text-orange-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'post_created': return `Created post "${activity.title}"`
      case 'post_published': return `Published "${activity.title}"`
      case 'media_uploaded': return `Uploaded "${activity.title}"`
      case 'category_created': return `Created category "${activity.title}"`
      default: return activity.title
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          Failed to load analytics data
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-muted-foreground">
            Track your blog's performance and insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
           variant={timeRange === '30d' ? 'default' : 'outline'}
           size="sm"
           onClick={() => setTimeRange('30d')}
         >
           30 Days
         </Button>
         <Button
           variant={timeRange === '90d' ? 'default' : 'outline'}
           size="sm"
           onClick={() => setTimeRange('90d')}
         >
           90 Days
         </Button>
       </div>
     </div>

     {/* Overview Stats */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       <Card className="glass">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Total Views</p>
               <p className="text-2xl font-bold">{formatNumber(data.overview.totalViews)}</p>
               <div className={`flex items-center gap-1 text-sm ${getGrowthColor(data.overview.viewsGrowth)}`}>
                 {getGrowthIcon(data.overview.viewsGrowth)}
                 <span>{Math.abs(data.overview.viewsGrowth)}%</span>
               </div>
             </div>
             <Eye className="h-8 w-8 text-blue-500" />
           </div>
         </CardContent>
       </Card>

       <Card className="glass">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
               <p className="text-2xl font-bold">{data.overview.totalPosts}</p>
               <div className={`flex items-center gap-1 text-sm ${getGrowthColor(data.overview.postsGrowth)}`}>
                 {getGrowthIcon(data.overview.postsGrowth)}
                 <span>{Math.abs(data.overview.postsGrowth)}%</span>
               </div>
             </div>
             <FileText className="h-8 w-8 text-green-500" />
           </div>
         </CardContent>
       </Card>

       <Card className="glass">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Categories</p>
               <p className="text-2xl font-bold">{data.overview.totalCategories}</p>
               <p className="text-sm text-muted-foreground">Active</p>
             </div>
             <Star className="h-8 w-8 text-purple-500" />
           </div>
         </CardContent>
       </Card>

       <Card className="glass">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Media Files</p>
               <p className="text-2xl font-bold">{data.overview.totalMedia}</p>
               <p className="text-sm text-muted-foreground">Uploaded</p>
             </div>
             <Globe className="h-8 w-8 text-orange-500" />
           </div>
         </CardContent>
       </Card>
     </div>

     {/* Charts Row */}
     <div className="grid md:grid-cols-2 gap-6">
       {/* Views Chart */}
       <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <BarChart3 className="h-5 w-5" />
             Views Over Time
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-64 flex items-end justify-between gap-1">
             {data.chartData.views.map((item, index) => {
               const maxViews = Math.max(...data.chartData.views.map(d => d.views))
               const height = (item.views / maxViews) * 100
               return (
                 <div key={index} className="flex flex-col items-center group">
                   <div
                     className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-colors"
                     style={{ height: `${height}%` }}
                   />
                   <span className="text-xs text-muted-foreground mt-2 rotate-45 origin-bottom-left">
                     {new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                   </span>
                 </div>
               )
             })}
           </div>
         </CardContent>
       </Card>

       {/* Performance Metrics */}
       <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Activity className="h-5 w-5" />
             Performance Metrics
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex justify-between items-center">
             <span className="text-sm text-muted-foreground">Avg. Read Time</span>
             <span className="font-medium">{data.performance.avgReadTime} min</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-sm text-muted-foreground">Bounce Rate</span>
             <span className="font-medium">{data.performance.bounceRate}%</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-sm text-muted-foreground">Returning Visitors</span>
             <span className="font-medium">{data.performance.returningVisitors}%</span>
           </div>
           
           <div className="pt-4 border-t border-border">
             <h4 className="text-sm font-medium mb-3">Top Traffic Sources</h4>
             <div className="space-y-2">
               {data.performance.topTrafficSources.map((source, index) => (
                 <div key={index} className="flex items-center justify-between">
                   <span className="text-sm">{source.source}</span>
                   <div className="flex items-center gap-2">
                     <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary rounded-full"
                         style={{ width: `${source.percentage}%` }}
                       />
                     </div>
                     <span className="text-sm text-muted-foreground w-8">
                       {source.percentage}%
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </CardContent>
       </Card>
     </div>

     {/* Top Content Row */}
     <div className="grid md:grid-cols-2 gap-6">
       {/* Top Posts */}
       <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <TrendingUp className="h-5 w-5" />
             Top Performing Posts
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             {data.topPosts.map((post, index) => (
               <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                     {index + 1}
                   </div>
                   <div>
                     <p className="font-medium text-sm">{post.title}</p>
                     <p className="text-xs text-muted-foreground">{post.category}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-medium text-sm">{formatNumber(post.views)}</p>
                   <div className={`flex items-center gap-1 text-xs ${getGrowthColor(post.growth)}`}>
                     {getGrowthIcon(post.growth)}
                     <span>{Math.abs(post.growth)}%</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>

       {/* Top Categories */}
       <Card className="glass">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Star className="h-5 w-5" />
             Popular Categories
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             {data.topCategories.map((category, index) => (
               <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                 <div className="flex items-center gap-3">
                   <div 
                     className="w-4 h-4 rounded-full"
                     style={{ backgroundColor: category.color }}
                   />
                   <div>
                     <p className="font-medium text-sm">{category.name}</p>
                     <p className="text-xs text-muted-foreground">{category.posts} posts</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-medium text-sm">{formatNumber(category.views)}</p>
                   <p className="text-xs text-muted-foreground">views</p>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
     </div>

     {/* Recent Activity */}
     <Card className="glass">
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <Clock className="h-5 w-5" />
           Recent Activity
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className="space-y-3">
           {data.recentActivity.map((activity) => (
             <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
               {getActivityIcon(activity.type)}
               <div className="flex-1">
                 <p className="text-sm">{getActivityText(activity)}</p>
                 <p className="text-xs text-muted-foreground">{activity.time}</p>
               </div>
             </div>
           ))}
         </div>
       </CardContent>
     </Card>
   </div>
 )
}
