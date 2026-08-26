'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

type RegisterRole = 'consumer' | 'seller'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    block: '',
    flatNumber: '',
    role: 'consumer' as RegisterRole,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        block: formData.block,
        flatNumber: formData.flatNumber,
        role: formData.role,
      })

      // Auto sign-in then redirect to pending screen
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      toast.success('Registered! Awaiting admin approval.')
      router.push('/pending')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1F1A] via-[#085041] to-[#0F6E56] flex items-center justify-center px-4 py-10">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#1D9E75] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F6E56] rounded-xl flex items-center justify-center">
              <span className="text-[#9FE1CB] font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">communa</span>
          </Link>
          <p className="text-[#9FE1CB] mt-3 text-sm">Join your society marketplace</p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#111827] mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">
            Register as a resident. Admin approval required.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="label">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {(['consumer', 'seller'] as RegisterRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                      formData.role === r
                        ? 'border-[#0F6E56] bg-[#E1F5EE] text-[#085041]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {r === 'consumer' ? '🛍️ Browse & Buy' : '🏪 Sell Services'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input id="name" type="text" name="name" className="input" placeholder="Your name"
                value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" name="email" className="input" placeholder="you@email.com"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="phone" className="label">Phone</label>
              <input id="phone" type="tel" name="phone" className="input" placeholder="9876543210"
                value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="block" className="label">Block</label>
                <input id="block" type="text" name="block" className="input" placeholder="A"
                  value={formData.block} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="flatNumber" className="label">Flat No.</label>
                <input id="flatNumber" type="text" name="flatNumber" className="input" placeholder="101"
                  value={formData.flatNumber} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input id="password" type="password" name="password" className="input"
                value={formData.password} onChange={handleChange} required minLength={6} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" className="input"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" disabled={loading} className="btn-communa w-full mt-2">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0F6E56] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
