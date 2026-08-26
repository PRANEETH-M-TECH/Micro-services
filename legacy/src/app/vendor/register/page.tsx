'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Droplets } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await axios.post('/api/vendor/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        // For now we are only supporting URBAN-RISE-City of Joy
        societyId: 'urban-rise-city-of-joy',
      })

      toast.success('Registration submitted! Please wait for admin approval.')
      router.push('/vendor/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Vendor registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Urban Rise</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Registration</h2>
          <p className="text-gray-600 mb-6">
            Register as a water can vendor for URBAN-RISE-City of Joy. Your account will be reviewed by an admin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="label">
                Vendor Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="input"
                placeholder="Vendor Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className="input"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4"
            >
              {loading ? 'Submitting...' : 'Register as Vendor'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already registered?{' '}
              <Link href="/vendor/login" className="text-blue-600 font-semibold hover:underline">
                Go to Vendor Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

