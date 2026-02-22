'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { Droplets, Minus, Plus, AlertCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const WATER_PRICE = 100 // per can
const CAN_PRICE = 50 // first order only

export default function NewOrderPage() {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const waterCost = quantity * WATER_PRICE
  const canCharge = isNewCustomer ? CAN_PRICE : 0
  const totalCost = waterCost + canCharge

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      await axios.post('/api/orders/create', {
        customerId: user?.id,
        societyId: user?.societyId,
        quantity,
        waterCost,
        canCharge,
        totalCost,
        canIncluded: isNewCustomer,
        notes,
        block: user?.block,
        flatNumber: user?.flatNumber,
      })

      toast.success('Order placed successfully!')
      setQuantity(1)
      setNotes('')
      setIsNewCustomer(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Place New Order</h1>
        <p className="text-blue-100 mt-1">URBAN-RISE-City of Joy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Info */}
          <div className="card-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Block</p>
                  <p className="font-semibold text-gray-900">{user?.block}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Flat</p>
                  <p className="font-semibold text-gray-900">{user?.flatNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Can Selection */}
          <div className="card-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Select Quantity
            </h2>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <button onClick={() => handleQuantityChange(-1)} className="p-2 hover:bg-gray-200 rounded-lg">
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{quantity}</p>
                <p className="text-sm text-gray-600 mt-1">water cans</p>
              </div>
              <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-200 rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Can Charge Option */}
          <div className="card-lg">
            <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-blue-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={isNewCustomer}
                onChange={(e) => setIsNewCustomer(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <div>
                <p className="font-semibold text-gray-900">Include New Can Charge</p>
                <p className="text-sm text-gray-600">₹{CAN_PRICE} for a new water can</p>
              </div>
            </label>
          </div>

          {/* Notes */}
          <div className="card-lg">
            <label htmlFor="notes" className="label">
              Delivery Notes (Optional)
            </label>
            <textarea
              id="notes"
              className="input"
              placeholder="e.g., Please deliver after 6 PM"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card-lg sticky top-24 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  {quantity} Water Can{quantity !== 1 ? 's' : ''}
                </p>
                <p className="font-semibold text-gray-900">₹{waterCost}</p>
              </div>

              {isNewCustomer && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <p className="text-gray-700">Can Charge (New)</p>
                  <p className="font-semibold text-gray-900">₹{canCharge}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-blue-600">₹{totalCost}</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Delivery:</strong> Usually within 2-4 hours
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            {/* Payment Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-800">
                  Payment will be collected at the time of delivery. Cash or Account transfer accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
