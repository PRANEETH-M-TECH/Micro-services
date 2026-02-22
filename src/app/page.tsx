import Link from 'next/link'
import { Droplets, Users, Clock, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Urban Rise</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Water Delivery Made Simple
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Order water cans for URBAN-RISE-City of Joy. Track deliveries in real-time, 
                manage orders, and connect with your vendor seamlessly.
              </p>
              <div className="flex gap-4">
                <Link href="/login" className="btn btn-primary">
                  Customer Login
                </Link>
                <Link href="/vendor/login" className="btn btn-secondary">
                  Vendor Login
                </Link>
              </div>
            </div>

            {/* Right Features */}
            <div className="space-y-6">
              <div className="card-lg flex gap-4">
                <div className="bg-blue-100 p-3 rounded-lg h-fit">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Easy Ordering</h3>
                  <p className="text-gray-600">Order water cans with just a few clicks. Transparent pricing with no hidden charges.</p>
                </div>
              </div>

              <div className="card-lg flex gap-4">
                <div className="bg-green-100 p-3 rounded-lg h-fit">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
                  <p className="text-gray-600">Get instant notifications when your order is out for delivery.</p>
                </div>
              </div>

              <div className="card-lg flex gap-4">
                <div className="bg-purple-100 p-3 rounded-lg h-fit">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Direct Chat</h3>
                  <p className="text-gray-600">Communicate directly with your vendor for any queries.</p>
                </div>
              </div>

              <div className="card-lg flex gap-4">
                <div className="bg-orange-100 p-3 rounded-lg h-fit">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  <p className="text-gray-600">View your order history with calendar view and generate bills.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Society Info Section */}
        <section className="bg-white py-20 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">About URBAN-RISE-City of Joy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600">Residential Units</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <p className="text-gray-600">Water Vendors</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Customer Support</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 URBAN-RISE Water Delivery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
