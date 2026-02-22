import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { requireAdmin } from '@/lib/auth'

/**
 * List Vendors Route (Admin Only)
 * 
 * Admin can view all vendors, filtered by approval status.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdmin()

    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved') // 'true' | 'false' | null (all)
    const societyId = searchParams.get('societyId')

    // Build query
    let vendorsQuery = collection(db, COLLECTIONS.VENDORS)

    // Apply filters
    const conditions: any[] = []
    if (societyId) {
      conditions.push(where('societyId', '==', societyId))
    }
    if (approved === 'true') {
      conditions.push(where('isApproved', '==', true))
    } else if (approved === 'false') {
      conditions.push(where('isApproved', '==', false))
    }

    // Execute query
    const vendorsSnapshot = await getDocs(
      conditions.length > 0 
        ? query(vendorsQuery, ...conditions)
        : vendorsQuery
    )

    const vendors = vendorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(
      {
        vendors,
        count: vendors.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('List vendors error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to list vendors', error: error.message },
      { status: 500 }
    )
  }
}
