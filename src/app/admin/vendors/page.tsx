'use client'

import { useState, useEffect } from 'react'
import { Package, CheckCircle2, XCircle, Plus } from 'lucide-react'
import Link from 'next/link'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  isApproved: boolean
  status: 'online' | 'offline'
  createdAt: any
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'unapproved'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    societyId: 'urban-rise-city-of-joy',
  })

  useEffect(() => {
    fetchVendors()
  }, [filter])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const approvedParam = filter === 'all' ? null : filter === 'approved' ? 'true' : 'false'
      const url = `/api/admin/vendors/list${approvedParam ? `?approved=${approvedParam}` : ''}`
      
      const res = await fetch(url)
      const data = await res.json()
      setVendors(data.vendors || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/vendors/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('Vendor created successfully!')
        setShowCreateForm(false)
        setFormData({ email: '', password: '', name: '', phone: '', societyId: 'urban-rise-city-of-joy' })
        fetchVendors()
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to create vendor')
      }
    } catch (error) {
      console.error('Error creating vendor:', error)
      alert('Failed to create vendor')
    }
  }

  const handleApprove = async (vendorId: string) => {
    try {
      const res = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId }),
      })

      if (res.ok) {
        fetchVendors() // Refresh list
        alert('Vendor approved successfully!')
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to approve vendor')
      }
    } catch (error) {
      console.error('Error approving vendor:', error)
      alert('Failed to approve vendor')
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendors</h1>
            <p className="text-green-100 mt-1">Create and manage vendors</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Vendor
            </button>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Create Vendor Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Create New Vendor</h2>
          <form onSubmit={handleCreateVendor} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Vendor
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All ({vendors.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Approved ({vendors.filter(v => v.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('unapproved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unapproved' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Unapproved ({vendors.filter(v => !v.isApproved).length})
          </button>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{vendor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vendor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vendor.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vendor.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Unapproved
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!vendor.isApproved && (
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
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
