'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { isAdmin } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[admin-login] Submit clicked', { email })
    setLoading(true)
    setError('')

    try {
      // Sign in with Firebase Auth
      console.log('[admin-login] Calling signInWithEmailAndPassword')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('[admin-login] Firebase signInWithEmailAndPassword succeeded', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      })
      
      // Check if user is admin in Firestore
      console.log('[admin-login] Verifying admin role via isAdmin')
      const admin = await isAdmin(userCredential.user.uid)
      
      if (!admin) {
        console.warn('[admin-login] User is not registered as admin in Firestore', {
          uid: userCredential.user.uid,
        })
        setError('Access denied: User account exists in Firebase Auth but is NOT registered as admin in the database. Ask an administrator to create your admin account properly.')
        await auth.signOut()
        setShowTroubleshooting(true)
        return
      }

      console.log('[admin-login] Admin verification passed, redirecting to /admin/dashboard')
      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('[admin-login] Login error', {
        code: error?.code,
        message: error?.message,
      })
      
      // Provide detailed error messages
      if (error.code === 'auth/user-not-found') {
        setError('Email not found. Admin account must be created first. See troubleshooting below.')
        setShowTroubleshooting(true)
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.')
      } else {
        setError(error.message || 'Failed to login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">URBAN-RISE Water Delivery</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="admin@urbanrise.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Troubleshooting Section */}
        <div className="mt-6">
          <button
            onClick={() => setShowTroubleshooting(!showTroubleshooting)}
            className="w-full text-left text-purple-600 hover:text-purple-700 font-medium text-sm underline"
          >
            {showTroubleshooting ? '▼ Hide Troubleshooting' : '▶ Show Troubleshooting'}
          </button>

          {showTroubleshooting && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 space-y-3">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">📋 Admin Account Setup:</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Admin accounts need BOTH Firebase Auth credentials AND Firestore admin record.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Option 1: Using Admin Creation API (Recommended)</h4>
                <code className="bg-white p-2 rounded text-xs block border border-gray-300 overflow-auto">
                  POST /api/auth/register-admin<br/>
                  {'{'}email, password, name, phone, societyId{'}'}<br/>
                  (include setupToken for first admin)
                </code>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Option 2: Manual Firebase Console Setup</h4>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Firebase Console → Authentication → Add User</li>
                  <li>Create account with admin email/password</li>
                  <li>Copy the generated UID</li>
                  <li>Firestore → admins collection → Use UID as document ID</li>
                </ol>
              </div>

              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-500">
                  Once both accounts are created, you'll be able to login here.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
