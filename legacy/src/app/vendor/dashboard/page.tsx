'use client'

import { useState, useEffect } from 'react'
import { Package, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    thisMonth: {
      orders: 0,
      revenue: 0,
    },
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    // Mock data
    setStats({
      totalOrders: 145,
      pendingOrders: 8,
      totalCustomers: 78,
      totalRevenue: 45320,
      thisMonth: {
        orders: 42,
        revenue: 12840,
      },
    })

    setRecentOrders([
      {
        id: '1',
        customerId: 'C001',
        customerName: 'Rajesh Sharma',
        block: 'A',
        flatNumber: '101',
        quantity: 2,
        status: 'pending',
        amount: 200,
        time: '10 minutes ago',
      },
      {
        id: '2',
        customerId: 'C002',
        customerName: 'Priya Verma',
        block: 'B',
        flatNumber: '205',
        quantity: 3,
        status: 'scheduled',
        amount: 300,
        time: '2 hours ago',
      },
      {
        id: '3',
        customerId: 'C003',
        customerName: 'Amit Patel',
        block: 'C',
        flatNumber: '310',
        quantity: 1,
        status: 'out_for_delivery',
        amount: 100,
        time: '4 hours ago',
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pending',
      scheduled: 'Scheduled',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    }
    return labels[status] || 'Unknown'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome to Your Vendor Dashboard</h1>
        <p className="text-blue-100 mt-1">Manage orders and customers efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">All time</p>
        </div>

        {/* Pending Orders */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Awaiting action</p>
        </div>

        {/* Total Customers */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Customers</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Active</p>
        </div>

        {/* Total Revenue */}
        <div className="card-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">All time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href="/vendor/orders" className="text-blue-600 text-sm font-semibold hover:underline">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">
                        Block {order.block}, Flat {order.flatNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.quantity} cans</p>
                        <p className="text-sm text-gray-600">₹{order.amount}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* This Month */}
          <div className="card-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm mb-1">Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.thisMonth.orders}</p>
              </div>
              <div>
                <p className="text-gray-700 text-sm mb-1">Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.thisMonth.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/vendor/orders" className="block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-center font-medium">
                View All Orders
              </Link>
              <Link href="/vendor/customers" className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium">
                Manage Customers
              </Link>
              <Link href="/vendor/messages" className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium">
                View Messages
              </Link>
            </div>
          </div>

          {/* Alert */}
          <div className="card-lg border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-yellow-800">Pending Orders</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You have {stats.pendingOrders} orders waiting for action
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
