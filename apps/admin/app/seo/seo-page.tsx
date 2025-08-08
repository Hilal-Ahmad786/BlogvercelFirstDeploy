'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Globe, 
  BarChart3, 
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Eye,
  Link,
  Image,
  FileText,
  Settings,
  Download,
  Upload,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react'

interface SEOAnalysis {
  score: number
  issues: {
    critical: SEOIssue[]
    warnings: SEOIssue[]
    suggestions: SEOIssue[]
  }
  keywords: {
    primary: string[]
    secondary: string[]
    density: { [key: string]: number }
  }
  technical: {
    pageSpeed: number
    mobileOptimized: boolean
    httpsEnabled: boolean
    structured: boolean
    sitemap: boolean
    robotsTxt: boolean
  }
  content: {
    wordCount: number
    readabilityScore: number
    headingStructure: { [key: string]: number }
    imagesOptimized: number
    internalLinks: number
    externalLinks: number
  }
}

interface SEOIssue {
  id: string
  type: 'critical' | 'warning' | 'suggestion'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  fixable: boolean
}

interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: string
  priority: number
  status: 'indexed' | 'pending' | 'error'
}

export default function SEOToolsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'keywords' | 'sitemap' | 'settings'>('overview')
  const [seoData, setSeoData] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [targetKeyword, setTargetKeyword] = useState('')
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([])

  useEffect(() => {
    fetchSEOData()
    fetchSitemap()
  }, [])

  const fetchSEOData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setSeoData({
          score: 87,
          issues: {
            critical: [
              {
                id: '1',
                type: 'critical',
                title: 'Missing Meta Description',
                description: '3 pages are missing meta descriptions',
                priority: 'high',
                fixable: true
              },
              {
                id: '2',
                type: 'critical',
                title: 'Duplicate Title Tags',
                description: '2 pages have duplicate title tags',
                priority: 'high',
                fixable: true
              }
            ],
            warnings: [
              {
                id: '3',
                type: 'warning',
                title: 'Large Images',
                description: '5 images are larger than 1MB',
                priority: 'medium',
                fixable: true
              },
              {
                id: '4',
                type: 'warning',
                title: 'Missing Alt Text',
                description: '8 images missing alt text',
                priority: 'medium',
                fixable: true
              }
            ],
            suggestions: [
              {
                id: '5',
                type: 'suggestion',
                title: 'Add Schema Markup',
                description: 'Consider adding structured data to improve rich snippets',
                priority: 'low',
                fixable: false
              },
              {
                id: '6',
                type: 'suggestion',
                title: 'Improve Internal Linking',
                description: 'Add more internal links to improve site structure',
                priority: 'low',
                fixable: false
              }
            ]
          },
          keywords: {
            primary: ['blog admin', 'content management', 'next.js'],
            secondary: ['dashboard', 'analytics', 'SEO tools'],
            density: {
              'blog': 2.3,
              'admin': 1.8,
              'content': 3.1,
              'management': 1.5,
              'dashboard': 0.9
            }
          },
          technical: {
            pageSpeed: 92,
            mobileOptimized: true,
            httpsEnabled: true,
            structured: true,
            sitemap: true,
            robotsTxt: true
          },
          content: {
            wordCount: 1247,
            readabilityScore: 78,
            headingStructure: { 'h1': 1, 'h2': 4, 'h3': 8, 'h4': 2 },
            imagesOptimized: 12,
            internalLinks: 23,
            externalLinks: 7
          }
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch SEO data:', error)
      setLoading(false)
    }
  }

  const fetchSitemap = async () => {
    // Mock sitemap data
    setSitemapEntries([
      {
        url: '/blog/getting-started',
        lastmod: '2024-01-15',
        changefreq: 'monthly',
        priority: 0.8,
        status: 'indexed'
      },
      {
        url: '/blog/advanced-features',
        lastmod: '2024-01-10',
        changefreq: 'weekly',
        priority: 0.9,
        status: 'indexed'
      },
      {
        url: '/blog/troubleshooting',
        lastmod: '2024-01-05',
        changefreq: 'monthly',
        priority: 0.7,
        status: 'pending'
      }
    ])
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'suggestion': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  const generateSitemap = async () => {
    // Simulate sitemap generation
    console.log('Generating sitemap...')
  }

  const analyzePage = async () => {
    setLoading(true)
    await fetchSEOData()
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">SEO Tools</h1>
          <p className="text-muted-foreground">
            Optimize your blog for search engines and improve rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={analyzePage}>
            <Zap className="h-4 w-4 mr-2" />
            Analyze Site
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analysis')}
            >
              <Search className="h-4 w-4 mr-2" />
              Analysis
            </Button>
            <Button
              variant={activeTab === 'keywords' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('keywords')}
            >
              <Target className="h-4 w-4 mr-2" />
              Keywords
            </Button>
            <Button
              variant={activeTab === 'sitemap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('sitemap')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Sitemap
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && seoData && (
        <div className="space-y-6">
          {/* SEO Score */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                SEO Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(seoData.score)}`}>
                    {seoData.score}/100
                  </div>
                  <p className="text-muted-foreground">
                    {seoData.score >= 80 ? 'Excellent' : seoData.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
                <div className="w-32 h-32 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${seoData.score * 2.51} 251`}
                      className={getScoreColor(seoData.score)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getScoreColor(seoData.score)}`}>
                      {seoData.score}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {seoData.issues.critical.length}
                </div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {seoData.issues.warnings.length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {seoData.technical.pageSpeed}
                </div>
                <div className="text-sm text-muted-foreground">Page Speed</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {seoData.content.wordCount}
                </div>
                <div className="text-sm text-muted-foreground">Total Words</div>
              </CardContent>
            </Card>
          </div>

          {/* Technical SEO Status */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Technical SEO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HTTPS Enabled</span>
                    {seoData.technical.httpsEnabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile Optimized</span>
                    {seoData.technical.mobileOptimized ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Structured Data</span>
                    {seoData.technical.structured ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">XML Sitemap</span>
                    {seoData.technical.sitemap ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Robots.txt</span>
                    {seoData.technical.robotsTxt ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page Speed Score</span>
                    <span className={`font-medium ${getScoreColor(seoData.technical.pageSpeed)}`}>
                      {seoData.technical.pageSpeed}/100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && seoData && (
        <div className="space-y-6">
          {/* Critical Issues */}
          <Card className="glass border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Critical Issues ({seoData.issues.critical.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoData.issues.critical.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-3 p-3 border border-red-200 rounded-lg">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="destructive" className="text-xs">
                          {issue.priority} priority
                        </Badge>
                        {issue.fixable && (
                          <Button size="sm" variant="outline">
                            Fix Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card className="glass border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Warnings ({seoData.issues.warnings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoData.issues.warnings.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-3 p-3 border border-yellow-200 rounded-lg">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          {issue.priority} priority
                        </Badge>
                        {issue.fixable && (
                          <Button size="sm" variant="outline">
                            Fix Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="glass border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                Suggestions ({seoData.issues.suggestions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoData.issues.suggestions.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-3 p-3 border border-blue-200 rounded-lg">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {issue.priority} priority
                        </Badge>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && seoData && (
        <div className="space-y-6">
          {/* Keyword Research */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Keyword Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Enter target keyword..."
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Research
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Primary Keywords</h4>
                  <div className="space-y-2">
                    {seoData.keywords.primary.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <span>{keyword}</span>
                        <Badge variant="outline">
                          {seoData.keywords.density[keyword]?.toFixed(1) || '0.0'}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Secondary Keywords</h4>
                  <div className="space-y-2">
                    {seoData.keywords.secondary.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <span>{keyword}</span>
                        <Badge variant="outline">
                          {seoData.keywords.density[keyword]?.toFixed(1) || '0.0'}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Analysis */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Word Count</span>
                    <span className="font-medium">{seoData.content.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Readability Score</span>
                    <span className={`font-medium ${getScoreColor(seoData.content.readabilityScore)}`}>
                      {seoData.content.readabilityScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Links</span>
                    <span className="font-medium">{seoData.content.internalLinks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>External Links</span>
                    <span className="font-medium">{seoData.content.externalLinks}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Heading Structure</h4>
                  <div className="space-y-2">
                    {Object.entries(seoData.content.headingStructure).map(([tag, count]) => (
                      <div key={tag} className="flex justify-between">
                        <span className="uppercase">{tag}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sitemap Tab */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  XML Sitemap
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={generateSitemap}>
                    <Upload className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="p-3">URL</th>
                      <th className="p-3">Last Modified</th>
                      <th className="p-3">Change Frequency</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sitemapEntries.map((entry, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Link className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">{entry.url}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {entry.lastmod}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {entry.changefreq}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">{entry.priority}</span>
                        </td>
                        <td className="p-3">
                          <Badge 
                            className={`text-xs ${
                              entry.status === 'indexed' ? 'bg-green-100 text-green-800' :
                              entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {entry.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Robots.txt */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Robots.txt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 p-3 border border-border rounded-lg bg-background font-mono text-sm"
                  defaultValue={`User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://yourblog.com/sitemap.xml`}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    Reset to Default
                  </Button>
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  defaultValue="100lesme Blog - Modern Blog Admin System"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used as the default title tag
                </p>
              </div>

              <div>
                <Label htmlFor="site-description">Site Description</Label>
                <textarea
                  id="site-description"
                  defaultValue="A comprehensive blog admin system built with Next.js, featuring rich content management, analytics, and SEO tools."
                  className="w-full mt-1 p-3 border border-border rounded-lg bg-background resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used as the default meta description
                </p>
              </div>

              <div>
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  placeholder="G-XXXXXXXXXX"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="google-search-console">Search Console Verification</Label>
                <Input
                  id="google-search-console"
                  placeholder="google-site-verification=..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="social-image">Default Social Image URL</Label>
                <Input
                  id="social-image"
                  placeholder="https://yourblog.com/og-image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-sitemap" defaultChecked />
                <Label htmlFor="auto-sitemap">Auto-generate sitemap</Label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-meta" defaultChecked />
                <Label htmlFor="auto-meta">Auto-generate meta descriptions</Label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="structured-data" defaultChecked />
                <Label htmlFor="structured-data">Enable structured data</Label>
              </div>

              <div className="flex justify-end">
                <Button>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
