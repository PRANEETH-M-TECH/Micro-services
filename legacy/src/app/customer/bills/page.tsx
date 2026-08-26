'use client'

import { useState, useEffect } from 'react'
import { Download, Eye, Filter } from 'lucide-react'

interface Bill {
  id: string
  orderId: string
  date: Date
  items: { description: string; qty: number; price: number }[]
  subtotal: number
  tax: number
  total: number
  paid: boolean
  paidDate?: Date
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockBills: Bill[] = [
      {
        id: 'BILL-001',
        orderId: '1',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        items: [{ description: 'Water (2 cans)', qty: 2, price: 100 }],
        subtotal: 200,
        tax: 20,
        total: 220,
        paid: true,
        paidDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'BILL-002',
        orderId: '2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        items: [{ description: 'Water (3 cans)', qty: 3, price: 100 }],
        subtotal: 300,
        tax: 30,
        total: 330,
        paid: true,
        paidDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'BILL-003',
        orderId: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        items: [{ description: 'Water (2 cans)', qty: 2, price: 100 }],
        subtotal: 200,
        tax: 20,
        total: 220,
        paid: false,
      },
    ]
    setBills(mockBills)
    setLoading(false)
  }, [])

  const filteredBills = filter === 'all' ? bills : filter === 'paid' ? bills.filter((b) => b.paid) : bills.filter((b) => !b.paid)

  const handleDownloadBill = (bill: Bill) => {
    // Generate PDF or download
    console.log('Download bill:', bill.id)
  }

  const totalPaid = bills.filter((b) => b.paid).reduce((sum, b) => sum + b.total, 0)
  const totalDue = bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Bills & Payments</h1>
        <p className="text-blue-100 mt-1">Manage your invoices and payments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Total Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totalPaid}</p>
        </div>
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Amount Due</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{totalDue}</p>
        </div>
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Total Bills</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{bills.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All Bills' },
          { value: 'paid', label: 'Paid' },
          { value: 'unpaid', label: 'Unpaid' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
        </div>
      ) : filteredBills.length > 0 ? (
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <div key={bill.id} className="card-lg hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Bill Info */}
                <div>
                  <p className="font-bold text-gray-900">{bill.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(bill.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{bill.items[0].description}</p>
                </div>

                {/* Amount & Status */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{bill.total}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {bill.paid ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          ✓ Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                          Unpaid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDownloadBill(bill)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                    {!bill.paid && (
                      <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-lg text-center py-12">
          <p className="text-gray-600 text-lg">No bills found</p>
        </div>
      )}
    </div>
  )
}
