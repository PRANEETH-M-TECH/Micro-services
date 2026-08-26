import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { normalizeAppUser } from '@/lib/routing'
import { requireAuthToken } from '@/lib/verify-token'

/**
 * GET /api/users/me — current authenticated user profile
 * Requires: Authorization: Bearer <Firebase ID token>
 */
export async function GET(request: NextRequest) {
  try {
    const { uid } = await requireAuthToken(request)

    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid))
    if (userDoc.exists()) {
      const user = normalizeAppUser(userDoc.id, userDoc.data() as Record<string, unknown>)
      return NextResponse.json({ user }, { status: 200 })
    }

    // Legacy admin account in admins collection
    const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, uid))
    if (adminDoc.exists()) {
      const data = adminDoc.data() as Record<string, unknown>
      const user = normalizeAppUser(adminDoc.id, {
        ...data,
        role: 'admin',
        status: 'approved',
        flatNumber: data.flatNumber ?? 'Admin',
      })
      return NextResponse.json({ user }, { status: 200 })
    }

    return NextResponse.json({ message: 'User profile not found' }, { status: 404 })
  } catch (error: unknown) {
    const err = error as { message?: string }
    if (err.message?.includes('Unauthorized')) {
      return NextResponse.json({ message: err.message }, { status: 401 })
    }
    return NextResponse.json(
      { message: 'Failed to fetch profile', error: err.message },
      { status: 500 }
    )
  }
}
