import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { requireCustomer } from '@/lib/auth'

/**
 * Verify Bill Route (Customer Only)
 * 
 * Customer verifies/approves a bill and marks it as paid.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify customer access
    const customer = await requireCustomer()

    const body = await request.json()
    const { billId, paymentMethod, paymentNotes } = body

    if (!billId) {
      return NextResponse.json(
        { message: 'Bill ID is required' },
        { status: 400 }
      )
    }

    // Check if bill exists
    const billDoc = await getDoc(doc(db, COLLECTIONS.BILLS, billId))
    if (!billDoc.exists()) {
      return NextResponse.json(
        { message: 'Bill not found' },
        { status: 404 }
      )
    }

    const billData = billDoc.data()

    // Verify bill belongs to this customer
    if (billData.customerId !== customer.id) {
      return NextResponse.json(
        { message: 'Unauthorized: This bill does not belong to you' },
        { status: 403 }
      )
    }

    // Check if already paid
    if (billData.paid) {
      return NextResponse.json(
        { message: 'Bill is already verified/paid' },
        { status: 400 }
      )
    }

    // Update bill as paid/verified
    await updateDoc(doc(db, COLLECTIONS.BILLS, billId), {
      paid: true,
      paidAt: serverTimestamp(),
      paymentMethod: paymentMethod || 'cash',
      paymentNotes: paymentNotes || null,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Bill verified and marked as paid successfully',
        billId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Bill verification error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to verify bill', error: error.message },
      { status: 500 }
    )
  }
}
