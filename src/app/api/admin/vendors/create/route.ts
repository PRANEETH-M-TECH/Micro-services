import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS } from '@/lib/db-schema'
import { requireAdmin } from '@/lib/auth'

/**
 * Create Vendor Route (Admin Only)
 * 
 * Admin creates a vendor account. Vendor must be approved by admin before they can operate.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await requireAdmin()

    const body = await request.json()
    const { email, password, name, phone, societyId } = body

    // Validate input
    if (!email || !password || !name || !phone || !societyId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify society exists
    const societyDoc = await getDoc(doc(db, COLLECTIONS.SOCIETIES, societyId))
    if (!societyDoc.exists()) {
      return NextResponse.json(
        { message: 'Society not found' },
        { status: 404 }
      )
    }

    // Create vendor in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const vendorId = userCredential.user.uid

    // Create vendor document in Firestore
    await setDoc(doc(db, COLLECTIONS.VENDORS, vendorId), {
      id: vendorId,
      email,
      name,
      phone,
      societyId,
      rating: DEFAULTS.VENDOR.rating,
      totalDeliveries: DEFAULTS.VENDOR.totalDeliveries,
      totalEarnings: DEFAULTS.VENDOR.totalEarnings,
      status: DEFAULTS.VENDOR.status,
      isActive: DEFAULTS.VENDOR.isActive,
      isApproved: DEFAULTS.VENDOR.isApproved, // Not approved by default
      createdBy: admin.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Vendor created successfully',
        vendorId,
        note: 'Vendor needs to be approved by admin before they can operate'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Vendor creation error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      )
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { message: 'Password should be at least 6 characters' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to create vendor', error: error.message },
      { status: 500 }
    )
  }
}
