'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Droplets } from 'lucide-react'
import toast from 'react-hot-toast'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getVendorDoc } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'

export default function VendorLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1) Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      // 2) Check vendor profile in Firestore
      const vendor = await getVendorDoc(uid)

      if (!vendor) {
        // If vendor doc doesn't exist, check if there is a pending vendor request.
        const reqSnap = await getDoc(doc(db, COLLECTIONS.VENDOR_REQUESTS, uid))
        if (reqSnap.exists()) {
          const reqData = reqSnap.data() as any
          await signOut(auth)
          if (reqData?.status === 'pending') {
            toast.error('Your vendor registration is pending admin approval.')
            return
          }
          if (reqData?.status === 'rejected') {
            toast.error('Your vendor registration was rejected. Please contact the admin.')
            return
          }
          toast.error('Vendor account setup is not complete yet. Please contact the admin.')
          return
        }

        await signOut(auth)
        toast.error('No vendor profile found. Please register as a vendor first.')
        router.push('/vendor/register')
        return
      }

      if (!vendor.isActive) {
        await signOut(auth)
        toast.error('Vendor account is inactive. Please contact the admin.')
        return
      }

      if (!vendor.isApproved) {
        await signOut(auth)
        toast.error('Your vendor account is pending admin approval.')
        return
      }

      toast.success('Vendor login successful!')
      router.push('/vendor/dashboard')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast.error('Vendor account not found. Please register first.')
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password.')
      } else {
        toast.error(error.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Login</h2>
          <p className="text-gray-600 mb-6">
            Sign in to manage your water can orders
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="vendor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New vendor?{' '}
              <Link href="/vendor/register" className="text-blue-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t space-y-2">
            <p className="text-center text-sm text-gray-600">
              Are you a customer?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Customer Login
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              Are you an admin?{' '}
              <Link href="/admin/login" className="text-purple-600 font-semibold hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Vendor Onboarding:</strong>
            <br />
            Register your account and wait for admin approval before logging in.
          </p>
        </div>
      </div>
    </div>
  )
}
