'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2)) // March 2024
  const [orders] = useState<{ [key: number]: number }>({
    5: 2,
    10: 3,
    15: 1,
    20: 2,
    25: 1,
    28: 2,
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Order Calendar</h1>
        <p className="text-blue-100 mt-1">View your order patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card-lg">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors ${
                  day
                    ? orders[day]
                      ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
                      : 'bg-gray-50 hover:bg-gray-100'
                    : ''
                }`}
              >
                {day && (
                  <>
                    <p className="text-sm font-semibold text-gray-900">{day}</p>
                    {orders[day] && (
                      <div className="flex items-center gap-1 mt-1">
                        <Droplets className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">{orders[day]}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm text-gray-700">Orders placed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 rounded border border-gray-200"></div>
              <span className="text-sm text-gray-700">No orders</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {/* Monthly Stats */}
          <div className="card-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Orders</span>
                <span className="font-bold text-2xl text-blue-600">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Cans</span>
                <span className="font-bold text-2xl text-blue-600">11</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average per Order</span>
                <span className="font-bold text-lg text-gray-900">1.8 cans</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-700">Estimated Cost</span>
                <span className="font-bold text-lg text-green-600">₹1,100</span>
              </div>
            </div>
          </div>

          {/* Top Days */}
          <div className="card-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Active Days</h3>
            <div className="space-y-2">
              {[
                { day: 'Tuesday', orders: 3 },
                { day: 'Sunday', orders: 2 },
                { day: 'Friday', orders: 2 },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-700">{item.day}</span>
                  <span className="font-semibold text-gray-900">{item.orders} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
