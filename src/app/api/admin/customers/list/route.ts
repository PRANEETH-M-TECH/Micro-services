import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { requireAdmin } from '@/lib/auth'

/**
 * List Customers Route (Admin Only)
 * 
 * Admin can view all customers, filtered by verification status.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const verified = searchParams.get('verified') // 'true' | 'false' | null (all)
    const societyId = searchParams.get('societyId')

    // Build query
    let customersQuery = collection(db, COLLECTIONS.USERS)

    // Apply filters
    const conditions: any[] = []
    if (societyId) {
      conditions.push(where('societyId', '==', societyId))
    }
    if (verified === 'true') {
      conditions.push(where('isVerified', '==', true))
    } else if (verified === 'false') {
      conditions.push(where('isVerified', '==', false))
    }

    // Execute query
    const customersSnapshot = await getDocs(
      conditions.length > 0 
        ? query(customersQuery, ...conditions)
        : customersQuery
    )

    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(
      {
        customers,
        count: customers.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('List customers error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to list customers', error: error.message },
      { status: 500 }
    )
  }
}
