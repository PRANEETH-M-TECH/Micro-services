import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS, generateOrderNumber } from '@/lib/db-schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      societyId,
      quantity,
      waterPrice,
      waterCost,
      canCharge,
      totalCost,
      canIncluded,
      canPrice,
      notes,
      block,
      flatNumber,
      deliveryAddress,
    } = body

    // Validate input
    if (!customerId || !societyId || !quantity || !waterPrice || !waterCost || totalCost === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ message: 'Quantity must be between 1 and 10' }, { status: 400 })
    }

    // Generate order number
    const currentYear = new Date().getFullYear()
    // TODO: Get sequence from a counter collection or use timestamp-based approach
    const orderNumber = generateOrderNumber(currentYear, Date.now() % 1000)

    // Create order in Firestore
    const ordersCollection = collection(db, COLLECTIONS.ORDERS)
    const orderDoc = await addDoc(ordersCollection, {
      orderNumber,
      customerId,
      societyId,
      quantity,
      waterPrice,
      waterCost,
      canIncluded: canIncluded || false,
      canPrice: canPrice || 0,
      canCharge: canCharge || DEFAULTS.ORDER.canCharge,
      totalCost,
      block,
      flatNumber,
      deliveryAddress: deliveryAddress || null,
      notes: notes || null,
      status: DEFAULTS.ORDER.status,
      createdBy: customerId,
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
