'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Settings, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Globe,
  BarChart3,
  Mail,
  MessageSquare,
  Search,
  Shield,
  Database,
  Cloud,
  Webhook,
  RefreshCw,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: 'analytics' | 'email' | 'seo' | 'social' | 'backup' | 'security' | 'comments'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  icon: any
  website: string
  features: string[]
  apiKey?: string
  lastSync?: string
  isEnabled: boolean
  settings?: { [key: string]: any }
}

export default function APIIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [connectingService, setConnectingService] = useState<string | null>(null)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    const mockIntegrations: Integration[] = [
      {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Track website traffic, user behavior, and conversion metrics',
        category: 'analytics',
        status: 'connected',
        icon: BarChart3,
        website: 'https://analytics.google.com',
        features: ['Real-time tracking', 'Audience insights', 'Conversion tracking', 'Custom reports'],
        apiKey: 'GA-123456789',
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isEnabled: true
      },
      {
        id: 'google-search-console',
        name: 'Google Search Console',
        description: 'Monitor search performance and SEO health',
        category: 'seo',
        status: 'connected',
        icon: Search,
        website: 'https://search.google.com/search-console',
        features: ['Search analytics', 'Index coverage', 'Mobile usability', 'Core Web Vitals'],
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isEnabled: true
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing automation and subscriber management',
        category: 'email',
        status: 'disconnected',
        icon: Mail,
        website: 'https://mailchimp.com',
        features: ['Email campaigns', 'Audience segmentation', 'A/B testing', 'Analytics'],
        isEnabled: false
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment processing for premium content',
        category: 'analytics',
        status: 'disconnected',
        icon: DollarSign,
        website: 'https://stripe.com',
        features: ['Payment processing', 'Subscription billing', 'Analytics', 'Webhooks'],
        isEnabled: false
      }
    ]

    setIntegrations(mockIntegrations)
    setLoading(false)
  }

  const connectService = async (serviceId: string) => {
    setConnectingService(serviceId)
    
    setTimeout(() => {
      setIntegrations(integrations.map(integration => 
        integration.id === serviceId 
          ? { ...integration, status: 'connected', isEnabled: true, lastSync: new Date().toISOString() }
          : integration
      ))
      setConnectingService(null)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      default: return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'disconnected': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'all' || integration.category === selectedCategory
  )

  const categories = [
    { id: 'all', name: 'All Services', icon: Globe },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'seo', name: 'SEO', icon: Search },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'social', name: 'Social Media', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'backup', name: 'Backup', icon: Database },
    { id: 'comments', name: 'Comments', icon: MessageSquare }
  ]

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
          <h1 className="text-3xl font-bold gradient-text">API Integrations</h1>
          <p className="text-muted-foreground">
            Connect external services to enhance your blog's functionality
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </Button>
          <Button>
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
        </div>
      </div>

      {/* Connected Services Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {integrations.filter(i => i.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {integrations.filter(i => i.status === 'error').length}
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {integrations.filter(i => i.isEnabled).length}
            </div>
            <div className="text-sm text-muted-foreground">Enabled</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card key={integration.id} className="glass hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={getStatusColor(integration.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(integration.status)}
                          {integration.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(integration.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Last Sync */}
                {integration.lastSync && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3" />                 <span>Last synced: {new Date(integration.lastSync).toLocaleString()}</span>
                 </div>
               )}

               {/* Connection Status & Actions */}
               <div className="space-y-2">
                 <div className="flex gap-2">
                   {integration.status === 'connected' ? (
                     <>
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => {}}
                       >
                         Disconnect
                       </Button>
                       <Button size="sm">
                         <Settings className="h-3 w-3 mr-1" />
                         Configure
                       </Button>
                     </>
                   ) : (
                     <Button
                       size="sm"
                       onClick={() => connectService(integration.id)}
                       loading={connectingService === integration.id}
                       disabled={connectingService === integration.id}
                     >
                       {connectingService === integration.id ? (
                         <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                       ) : (
                         <Zap className="h-3 w-3 mr-1" />
                       )}
                       Connect
                     </Button>
                   )}
                 </div>
               </div>
             </CardContent>
           </Card>
         )
       })}
     </div>

     {/* API Usage & Limits */}
     <Card className="glass">
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <BarChart3 className="h-5 w-5" />
           API Usage & Limits
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid md:grid-cols-3 gap-6">
           <div>
             <h4 className="font-medium mb-3">Google Analytics API</h4>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span>Requests Today</span>
                 <span className="font-medium">2,347 / 10,000</span>
               </div>
               <div className="w-full bg-muted rounded-full h-2">
                 <div className="bg-green-500 h-2 rounded-full" style={{ width: '23.47%' }} />
               </div>
             </div>
           </div>

           <div>
             <h4 className="font-medium mb-3">Search Console API</h4>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span>Requests Today</span>
                 <span className="font-medium">892 / 1,200</span>
               </div>
               <div className="w-full bg-muted rounded-full h-2">
                 <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '74.33%' }} />
               </div>
             </div>
           </div>

           <div>
             <h4 className="font-medium mb-3">Mailchimp API</h4>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span>Requests Today</span>
                 <span className="font-medium">156 / 10,000</span>
               </div>
               <div className="w-full bg-muted rounded-full h-2">
                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '1.56%' }} />
               </div>
             </div>
           </div>
         </div>
       </CardContent>
     </Card>
   </div>
 )
}
