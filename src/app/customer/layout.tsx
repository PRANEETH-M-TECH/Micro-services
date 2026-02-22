'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Menu, X, LogOut, Settings, MessageSquare, MapPin } from 'lucide-react'

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : ''
  }

  const navigationItems = [
    { label: 'Dashboard', href: '/customer/dashboard', icon: '📊' },
    { label: 'New Order', href: '/customer/order/new', icon: '🛒' },
    { label: 'Order History', href: '/customer/orders', icon: '📋' },
    { label: 'Calendar', href: '/customer/calendar', icon: '📅' },
    { label: 'Messages', href: '/customer/messages', icon: '💬' },
    { label: 'Bills', href: '/customer/bills', icon: '💰' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 left-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Urban Rise</h1>
            <p className="text-sm text-gray-600 mt-1">URBAN-RISE-City of Joy</p>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b mx-4 my-4 rounded-lg bg-blue-50">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600">{user.block}/{user.flatNumber}</p>
              <p className="text-xs text-gray-600 mt-1">{user.phone}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(
                      item.href
                    )} hover:bg-gray-100`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Settings & Logout */}
          <div className="p-4 border-t space-y-2">
            <Link
              href="/customer/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Profile Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
              Smart Water Delivery
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MapPin className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
