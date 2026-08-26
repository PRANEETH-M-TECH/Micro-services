'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import { getPostLoginPath } from '@/lib/routing'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const profile = await signIn(email, password)
      toast.success('Welcome back!')
      router.push(getPostLoginPath(profile))
    } catch (error: unknown) {
      const err = error as { message?: string }
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1F1A] via-[#085041] to-[#0F6E56] flex items-center justify-center px-4 py-10">
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#9FE1CB] rounded-full blur-[120px] opacity-10 pointer-events-none" />

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
          <p className="text-[#9FE1CB] mt-3 text-sm">Enter your community</p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#111827] mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm mb-6">Access your society marketplace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" className="input" placeholder="you@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input id="password" type="password" className="input" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn-communa w-full">
              {loading ? 'Signing in...' : 'Enter Community'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{' '}
            <Link href="/register" className="text-[#0F6E56] font-semibold hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t text-center">
            <Link href="/admin/login" className="text-sm text-gray-500 hover:text-[#0F6E56]">
              Admin login →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
