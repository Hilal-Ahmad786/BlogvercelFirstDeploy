'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Image, 
  BarChart3, 
  Users,
  Settings,
  LogOut,
  MessageSquare,
  Search,
  Zap
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Posts', href: '/posts', icon: FileText },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'Comments', href: '/comments', icon: MessageSquare },
  { name: 'Users', href: '/users', icon: Users, adminOnly: true },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'SEO Tools', href: '/seo', icon: Search },
  { name: 'Integrations', href: '/integrations', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  )

  return (
    <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-card border-r border-border">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold gradient-text">Claudia Admin</h1>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-6">
          <nav className="flex-1 space-y-1 px-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User info and logout */}
        <div className="flex flex-shrink-0 border-t border-border p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="ml-2 p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
