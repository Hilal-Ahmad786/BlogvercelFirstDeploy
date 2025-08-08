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

export function generateAnalyticsData(range: '7d' | '30d' | '90d'): AnalyticsData {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  
  // Generate chart data
  const chartData = {
    views: Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toISOString(),
        views: Math.floor(Math.random() * 500) + 100
      }
    }),
    posts: Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toISOString(),
        posts: Math.floor(Math.random() * 5)
      }
    })
  }

  const totalViews = chartData.views.reduce((sum, day) => sum + day.views, 0)
  const totalPosts = chartData.posts.reduce((sum, day) => sum + day.posts, 0)

  return {
    overview: {
      totalViews: totalViews,
      totalPosts: Math.max(totalPosts, 15),
      totalCategories: 8,
      totalMedia: 42,
      viewsGrowth: Math.floor(Math.random() * 40) - 10, // -10 to +30
      postsGrowth: Math.floor(Math.random() * 30) - 5,  // -5 to +25
    },
    chartData,
    topPosts: [
      {
        id: '1',
        title: 'Getting Started with Next.js 14',
        views: 2847,
        growth: 23,
        category: 'Technology'
      },
      {
        id: '2', 
        title: 'The Future of Web Development',
        views: 1923,
        growth: 15,
        category: 'Technology'
      },
      {
        id: '3',
        title: 'Building Better User Experiences',
        views: 1456,
        growth: -8,
        category: 'Design'
      },
      {
        id: '4',
        title: 'Modern CSS Techniques',
        views: 1203,
        growth: 31,
        category: 'Design'
      },
      {
        id: '5',
        title: 'Productivity Tips for Developers',
        views: 987,
        growth: 12,
        category: 'Lifestyle'
      }
    ],
    topCategories: [
      {
        id: '1',
        name: 'Technology',
        posts: 8,
        views: 12450,
        color: '#3B82F6'
      },
      {
        id: '2',
        name: 'Design',
        posts: 5,
        views: 8920,
        color: '#8B5CF6'
      },
      {
        id: '3',
        name: 'Lifestyle',
        posts: 3,
        views: 5670,
        color: '#10B981'
      },
      {
        id: '4',
        name: 'Business',
        posts: 2,
        views: 3240,
        color: '#F59E0B'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'post_published',
        title: 'Advanced React Patterns',
        time: '2 hours ago'
      },
      {
        id: '2',
        type: 'media_uploaded',
        title: 'hero-banner.jpg',
        time: '4 hours ago'
      },
      {
        id: '3',
        type: 'post_created',
        title: 'TypeScript Best Practices',
        time: '6 hours ago'
      },
      {
        id: '4',
        type: 'category_created',
        title: 'Tutorials',
        time: '1 day ago'
      },
      {
        id: '5',
        type: 'post_published',
        title: 'CSS Grid Mastery',
        time: '2 days ago'
      },
      {
        id: '6',
        type: 'media_uploaded',
        title: 'code-screenshot.png',
        time: '3 days ago'
      }
    ],
    performance: {
      avgReadTime: 4.2,
      bounceRate: 32,
      returningVisitors: 68,
      topTrafficSources: [
        { source: 'Google Search', visitors: 12340, percentage: 45 },
        { source: 'Direct', visitors: 6890, percentage: 25 },
        { source: 'Social Media', visitors: 4120, percentage: 15 },
        { source: 'Referrals', visitors: 2750, percentage: 10 },
        { source: 'Email', visitors: 1370, percentage: 5 }
      ]
    }
  }
}
