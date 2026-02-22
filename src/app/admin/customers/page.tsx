'use client'

import { useState, useEffect } from 'react'
import { Users, CheckCircle2, XCircle, Search } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  block: string
  flatNumber: string
  isVerified: boolean
  createdAt: any
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all')

  useEffect(() => {
    fetchCustomers()
  }, [filter])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const verifiedParam = filter === 'all' ? null : filter === 'verified' ? 'true' : 'false'
      const url = `/api/admin/customers/list${verifiedParam ? `?verified=${verifiedParam}` : ''}`
      
      const res = await fetch(url)
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (customerId: string) => {
    try {
      const res = await fetch('/api/admin/customers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })

      if (res.ok) {
        fetchCustomers() // Refresh list
        alert('Customer verified successfully!')
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to verify customer')
      }
    } catch (error) {
      console.error('Error verifying customer:', error)
      alert('Failed to verify customer')
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-blue-100 mt-1">Manage and verify customers</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Verified ({customers.filter(c => c.isVerified).length})
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unverified' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Unverified ({customers.filter(c => !c.isVerified).length})
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      Block {customer.block}, Flat {customer.flatNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!customer.isVerified && (
                        <button
                          onClick={() => handleVerify(customer.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
