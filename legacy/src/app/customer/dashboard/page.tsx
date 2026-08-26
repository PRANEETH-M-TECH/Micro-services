'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Droplets, TrendingUp, Calendar, AlertCircle, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

type Order = {
  id: string
  quantity: number
  cans: string
  status: string
  date: Date
  amount: number
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<{
    totalOrders: number
    thisMonthOrders: number
    totalSpent: number
    nextDelivery: Date | null
  }>({
    totalOrders: 0,
    thisMonthOrders: 0,
    totalSpent: 0,
    nextDelivery: null,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // TODO: Fetch from API
        setStats({
          totalOrders: 15,
          thisMonthOrders: 3,
          totalSpent: 2450,
          nextDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        })
        setRecentOrders([
          {
            id: '1',
            quantity: 2,
            cans: '2 cans',
            status: 'delivered',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            amount: 200,
          },
          {
            id: '2',
            quantity: 3,
            cans: '3 cans',
            status: 'out_for_delivery',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            amount: 300,
          },
          {
            id: '3',
            quantity: 2,
            cans: '2 cans',
            status: 'pending',
            date: new Date(),
            amount: 200,
          },
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      received: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Received' },
      scheduled: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Scheduled' },
      out_for_delivery: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Out for Delivery' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>{config.label}</span>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">Block {(user as any)?.block}, Flat {(user as any)?.flatNumber} • {user?.phone}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Lifetime orders</p>
        </div>

        {/* This Month */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisMonthOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">March 2024</p>
        </div>

        {/* Total Spent */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalSpent}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Droplets className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">All time</p>
        </div>

        {/* Next Delivery */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Next Delivery</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {stats.nextDelivery
                  ? new Date(stats.nextDelivery).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Scheduled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href="/customer/orders" className="text-blue-600 text-sm font-semibold hover:underline">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{order.cans}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.amount}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="card-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <Link href="/customer/order/new" className="btn btn-primary w-full mb-3">
              + Place New Order
            </Link>
            <Link href="/customer/messages" className="btn btn-secondary w-full mb-3">
              Chat with Vendor
            </Link>
            <Link href="/customer/bills" className="btn btn-ghost w-full">
              View Bills
            </Link>
          </div>

          {/* Tips */}
          <div className="card-lg border-l-4 border-yellow-500 bg-yellow-50">
            <h3 className="text-sm font-bold text-gray-900 mb-2">💡 Quick Tip</h3>
            <p className="text-sm text-gray-700">
              Order before 10 AM for same-day delivery. Use calendar to track your order patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
