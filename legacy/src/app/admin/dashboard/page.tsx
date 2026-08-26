'use client'

import { useState, useEffect } from 'react'
import { Users, Package, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    unverifiedCustomers: 0,
    totalVendors: 0,
    unapprovedVendors: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch customers
      const customersRes = await fetch('/api/admin/customers/list')
      const customersData = await customersRes.json()
      
      // Fetch vendors
      const vendorsRes = await fetch('/api/admin/vendors/list')
      const vendorsData = await vendorsRes.json()

      setStats({
        totalCustomers: customersData.count || 0,
        unverifiedCustomers: customersData.customers?.filter((c: any) => !c.isVerified).length || 0,
        totalVendors: vendorsData.count || 0,
        unapprovedVendors: vendorsData.vendors?.filter((v: any) => !v.isApproved).length || 0,
        totalOrders: 0, // TODO: Add orders API
        pendingOrders: 0, // TODO: Add orders API
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-purple-100 mt-1">Manage vendors, customers, and orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Unverified Customers */}
        <Link href="/admin/customers?verified=false" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unverified Customers</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.unverifiedCustomers}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Click to verify</p>
        </Link>

        {/* Total Vendors */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Vendors</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalVendors}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Unapproved Vendors */}
        <Link href="/admin/vendors?approved=false" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unapproved Vendors</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.unapprovedVendors}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Click to approve</p>
        </Link>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/customers"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">Manage Customers</h3>
            <p className="text-sm text-gray-600">View and verify customers</p>
          </Link>

          <Link
            href="/admin/vendors"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Manage Vendors</h3>
            <p className="text-sm text-gray-600">Create and approve vendors</p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Package className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">View Orders</h3>
            <p className="text-sm text-gray-600">Monitor all orders</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
