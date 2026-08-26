import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { requireAdmin } from '@/lib/auth'

/**
 * Approve Vendor Route (Admin Only)
 * 
 * Admin approves a vendor so they can start operating.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdmin()

    const body = await request.json()
    const { vendorId } = body

    if (!vendorId) {
      return NextResponse.json(
        { message: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Check if vendor exists
    const vendorDoc = await getDoc(doc(db, COLLECTIONS.VENDORS, vendorId))
    if (!vendorDoc.exists()) {
      return NextResponse.json(
        { message: 'Vendor not found' },
        { status: 404 }
      )
    }

    const vendorData = vendorDoc.data()

    // Check if already approved
    if (vendorData.isApproved) {
      return NextResponse.json(
        { message: 'Vendor is already approved' },
        { status: 400 }
      )
    }

    // Approve vendor
    await updateDoc(doc(db, COLLECTIONS.VENDORS, vendorId), {
      isApproved: true,
      approvedAt: serverTimestamp(),
      approvedBy: admin.id,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Vendor approved successfully',
        vendorId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Vendor approval error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to approve vendor', error: error.message },
      { status: 500 }
    )
  }
}
