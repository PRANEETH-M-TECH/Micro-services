'use client'

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch orders
    const fetchOrders = async () => {
      try {
        // TODO: Fetch from API
        const mockOrders = [
          {
            id: '1',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            quantity: 2,
            amount: 200,
            status: 'delivered',
          },
          {
            id: '2',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            quantity: 3,
            amount: 300,
            status: 'delivered',
          },
          {
            id: '3',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            quantity: 2,
            amount: 200,
            status: 'out_for_delivery',
          },
          {
            id: '4',
            date: new Date(),
            quantity: 1,
            amount: 100,
            status: 'pending',
          },
        ]
        setOrders(mockOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const getStatusConfig = (status: string) => {
    const config: { [key: string]: { bg: string; text: string; label: string; icon: string } } = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
        icon: '⏳',
      },
      received: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Received',
        icon: '📦',
      },
      scheduled: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Scheduled',
        icon: '📅',
      },
      out_for_delivery: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Out for Delivery',
        icon: '🚚',
      },
      delivered: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Delivered',
        icon: '✅',
      },
    }
    return config[status] || config.pending
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-blue-100 mt-1">View all your past and current orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All Orders' },
          { value: 'pending', label: 'Pending' },
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered', label: 'Delivered' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const config = getStatusConfig(order.status)
            return (
              <div key={order.id} className="card-lg hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{config.icon}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{order.quantity}</p>
                    <p className="text-xs text-gray-600">water cans</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{order.amount}</p>
                    <button className="text-blue-600 text-sm font-semibold mt-1 hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card-lg text-center py-12">
          <p className="text-gray-600 text-lg">No orders found in this category</p>
        </div>
      )}
    </div>
  )
}
