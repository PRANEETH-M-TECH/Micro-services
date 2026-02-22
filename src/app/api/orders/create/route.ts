import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      societyId,
      quantity,
      waterCost,
      canCharge,
      totalCost,
      canIncluded,
      notes,
      block,
      flatNumber,
    } = body

    // Validate input
    if (!customerId || !societyId || !quantity) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Create order in Firestore
    const ordersCollection = collection(db, 'orders')
    const orderDoc = await addDoc(ordersCollection, {
      customerId,
      societyId,
      quantity,
      waterCost,
      canCharge,
      totalCost,
      canIncluded,
      notes,
      block,
      flatNumber,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Update user stats
    const userRef = doc(db, 'users', customerId)
    await updateDoc(userRef, {
      totalOrders: increment(1),
      totalSpent: increment(totalCost),
    })

    return NextResponse.json(
      {
        message: 'Order created successfully',
        orderId: orderDoc.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create order', error: error.message },
      { status: 500 }
    )
  }
}
