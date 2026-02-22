'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, LogOut, Settings, Users, TrendingUp } from 'lucide-react'

export default function VendorLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    // TODO: Implement signout logic
    router.push('/')
  }

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : ''
  }

  const navigationItems = [
    { label: 'Dashboard', href: '/vendor/dashboard', icon: '📊' },
    { label: 'Orders', href: '/vendor/orders', icon: '📦' },
    { label: 'Customers', href: '/vendor/customers', icon: '👥' },
    { label: 'Messages', href: '/vendor/messages', icon: '💬' },
    { label: 'Analytics', href: '/vendor/analytics', icon: '📈' },
    { label: 'Settings', href: '/vendor/settings', icon: '⚙️' },
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
            <p className="text-sm text-gray-600 mt-1">Vendor Dashboard</p>
          </div>

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

          {/* Logout */}
          <div className="p-4 border-t">
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
              Vendor Management System
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-gray-600" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5 text-gray-600" />
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
