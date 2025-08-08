// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { AdminLayout } from '@/components/admin-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Claudia Blog Admin',
  description: 'Admin panel for Claudia Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </AuthProvider>
      </body>
    </html>
  )
}