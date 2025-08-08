// components/admin-layout.tsx
'use client'

import { useAuth, ProtectedRoute } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}