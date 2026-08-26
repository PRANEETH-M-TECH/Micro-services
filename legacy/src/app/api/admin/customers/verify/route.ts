import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { requireAdmin } from '@/lib/auth'

/**
 * Verify Customer Route (Admin Only)
 * 
 * Admin verifies a customer so they can place orders.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdmin()

    const body = await request.json()
    const { customerId } = body

    if (!customerId) {
      return NextResponse.json(
        { message: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const customerDoc = await getDoc(doc(db, COLLECTIONS.USERS, customerId))
    if (!customerDoc.exists()) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      )
    }

    const customerData = customerDoc.data()

    // Check if already verified
    if (customerData.isVerified) {
      return NextResponse.json(
        { message: 'Customer is already verified' },
        { status: 400 }
      )
    }

    // Verify customer
    await updateDoc(doc(db, COLLECTIONS.USERS, customerId), {
      isVerified: true,
      verifiedAt: serverTimestamp(),
      verifiedBy: admin.id,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Customer verified successfully',
        customerId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Customer verification error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to verify customer', error: error.message },
      { status: 500 }
    )
  }
}
