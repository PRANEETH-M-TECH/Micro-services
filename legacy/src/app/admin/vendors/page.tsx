'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, XCircle, Plus, Clock } from 'lucide-react'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  doc
} from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS } from '@/lib/db-schema'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  isApproved: boolean
  status: 'online' | 'offline'
  createdAt: any
}

interface VendorRequest {
  id: string
  name: string
  email: string
  phone: string
  societyId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: any
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorRequests, setVendorRequests] = useState<VendorRequest[]>([])
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

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true)
      const vendorsRef = collection(db, COLLECTIONS.VENDORS)
      const conditions: any[] = []

      if (filter === 'approved') {
        conditions.push(where('isApproved', '==', true))
      } else if (filter === 'unapproved') {
        conditions.push(where('isApproved', '==', false))
      }

      const qs = query(
        vendorsRef,
        ...conditions,
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(qs)
      setVendors(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      )
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  const fetchVendorRequests = useCallback(async () => {
    try {
      const reqRef = collection(db, COLLECTIONS.VENDOR_REQUESTS)
      const qs = query(reqRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(qs)
      setVendorRequests(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      )
    } catch (error) {
      console.error('Error fetching vendor requests:', error)
    }
  }, [])

  useEffect(() => {
    void fetchVendors()
    void fetchVendorRequests()
  }, [fetchVendors, fetchVendorRequests])

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      alert(
        'Admin-created vendors are now expected to self-register first. Ask the vendor to register from the Vendor Registration page, then approve the request here.'
      )
    } catch (error) {
      console.error('Error creating vendor:', error)
      alert('Failed to create vendor')
    }
  }

  const handleApproveExistingVendor = async (vendorId: string) => {
    try {
      const uid = auth.currentUser?.uid
      if (!uid) {
        alert('Not authenticated. Please log in as admin.')
        return
      }

      await updateDoc(doc(db, COLLECTIONS.VENDORS, vendorId), {
        isApproved: true,
        approvedAt: serverTimestamp(),
        approvedBy: uid,
        updatedAt: serverTimestamp(),
      })

      await fetchVendors()
      alert('Vendor approved successfully!')
    } catch (error) {
      console.error('Error approving vendor:', error)
      alert('Failed to approve vendor')
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const adminId = auth.currentUser?.uid
      if (!adminId) {
        alert('Not authenticated. Please log in as admin.')
        return
      }

      const request = vendorRequests.find((r) => r.id === requestId)
      if (!request) {
        alert('Vendor request not found.')
        return
      }

      const batch = writeBatch(db)
      const vendorRef = doc(db, COLLECTIONS.VENDORS, requestId)
      const reqRef = doc(db, COLLECTIONS.VENDOR_REQUESTS, requestId)

      batch.set(vendorRef, {
        id: requestId,
        email: request.email,
        name: request.name,
        phone: request.phone,
        societyId: request.societyId,
        rating: DEFAULTS.VENDOR.rating,
        totalDeliveries: DEFAULTS.VENDOR.totalDeliveries,
        totalEarnings: DEFAULTS.VENDOR.totalEarnings,
        status: DEFAULTS.VENDOR.status,
        isActive: true,
        isApproved: true,
        approvedAt: serverTimestamp(),
        approvedBy: adminId,
        createdBy: adminId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      batch.update(reqRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminId,
        updatedAt: serverTimestamp(),
      })

      await batch.commit()

      await fetchVendorRequests()
      await fetchVendors()
      alert('Vendor request approved and vendor created.')
    } catch (error) {
      console.error('Error approving vendor request:', error)
      alert('Failed to approve vendor request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const adminId = auth.currentUser?.uid
      if (!adminId) {
        alert('Not authenticated. Please log in as admin.')
        return
      }

      await updateDoc(doc(db, COLLECTIONS.VENDOR_REQUESTS, requestId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: adminId,
        updatedAt: serverTimestamp(),
      })

      await fetchVendorRequests()
      alert('Vendor request rejected.')
    } catch (error) {
      console.error('Error rejecting vendor request:', error)
      alert('Failed to reject vendor request')
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

      {/* Pending Vendor Requests */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold">Pending Vendor Requests</h2>
          </div>
          <span className="text-sm text-gray-600">{vendorRequests.length} pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendorRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No pending vendor requests
                  </td>
                </tr>
              ) : (
                vendorRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{req.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                          onClick={() => handleApproveExistingVendor(vendor.id)}
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
