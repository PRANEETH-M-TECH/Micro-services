'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { getPostLoginPath } from '@/lib/routing'

interface AuthGateProps {
  children: ReactNode
  /** Roles allowed to view this route */
  allowedRoles?: Array<'consumer' | 'seller' | 'admin'>
  /** If true, only approved users can access */
  requireApproved?: boolean
}

/**
 * Protects routes based on auth state, approval status, and role.
 */
export function AuthGate({
  children,
  allowedRoles,
  requireApproved = true,
}: AuthGateProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (requireApproved && user.status === 'pending') {
      router.replace('/pending')
      return
    }

    if (requireApproved && user.status === 'rejected') {
      router.replace('/pending')
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(getPostLoginPath(user))
    }
  }, [user, loading, router, allowedRoles, requireApproved])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0F6E56] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  if (requireApproved && (user.status === 'pending' || user.status === 'rejected')) return null
  if (allowedRoles && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
