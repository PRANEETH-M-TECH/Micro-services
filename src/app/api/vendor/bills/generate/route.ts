import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS, generateBillNumber, generatePeriodLabel, calculatePeriodDates } from '@/lib/db-schema'
import { requireVendor } from '@/lib/auth'

/**
 * Generate Bill Route (Vendor Only)
 * 
 * Vendor generates bills for customers based on orders delivered.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify vendor access
    const vendor = await requireVendor()

    const body = await request.json()
    const { 
      customerId, 
      periodType, // 'daily' | 'weekly' | 'monthly'
      periodDate, // Date string for the period
      orderIds // Optional: specific order IDs, or will fetch all orders in period
    } = body

    // Validate input
    if (!customerId || !periodType || !periodDate) {
      return NextResponse.json(
        { message: 'Missing required fields: customerId, periodType, periodDate' },
        { status: 400 }
      )
    }

    // Validate period type
    if (!['daily', 'weekly', 'monthly'].includes(periodType)) {
      return NextResponse.json(
        { message: 'Invalid periodType. Must be: daily, weekly, or monthly' },
        { status: 400 }
      )
    }

    // Calculate period dates
    const periodDateObj = new Date(periodDate)
    const { start, end } = calculatePeriodDates(periodType, periodDateObj)
    const periodLabel = generatePeriodLabel(periodType, periodDateObj)

    // Get orders for this customer in the period
    let ordersToBill: any[] = []

    if (orderIds && orderIds.length > 0) {
      // Use specific order IDs provided
      for (const orderId of orderIds) {
        const orderDoc = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId))
        if (orderDoc.exists()) {
          const orderData = orderDoc.data()
          // Verify order belongs to customer and vendor
          if (orderData.customerId === customerId && 
              orderData.vendorId === vendor.id &&
              orderData.status === 'delivered') {
            ordersToBill.push({ id: orderDoc.id, ...orderData })
          }
        }
      }
    } else {
      // Fetch all delivered orders for this customer in the period
      const ordersQuery = query(
        collection(db, COLLECTIONS.ORDERS),
        where('customerId', '==', customerId),
        where('vendorId', '==', vendor.id),
        where('status', '==', 'delivered')
      )
      
      const ordersSnapshot = await getDocs(ordersQuery)
      ordersToBill = ordersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => {
          const orderDate = order.deliveryTime?.toDate() || order.createdAt?.toDate()
          return orderDate >= start && orderDate <= end
        })
    }

    if (ordersToBill.length === 0) {
      return NextResponse.json(
        { message: 'No delivered orders found for this period' },
        { status: 404 }
      )
    }

    // Calculate bill totals
    const itemsTotal = ordersToBill.reduce((sum, order) => sum + (order.waterCost || 0), 0)
    const canCharge = ordersToBill.reduce((sum, order) => sum + (order.canCharge || 0), 0)
    const totalAmount = itemsTotal + canCharge

    // Generate bill number
    const currentYear = new Date().getFullYear()
    const billNumber = generateBillNumber(currentYear, Date.now() % 1000)

    // Get customer document for societyId
    const customerDoc = await getDoc(doc(db, COLLECTIONS.USERS, customerId))
    if (!customerDoc.exists()) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      )
    }
    const customerData = customerDoc.data()

    // Create bill document
    const billDoc = await addDoc(collection(db, COLLECTIONS.BILLS), {
      billNumber,
      customerId,
      vendorId: vendor.id,
      societyId: customerData.societyId,
      periodType,
      periodStart: start,
      periodEnd: end,
      periodLabel,
      orderIds: ordersToBill.map(order => order.id),
      itemsTotal,
      canCharge,
      totalAmount,
      paid: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Bill generated successfully',
        billId: billDoc.id,
        billNumber,
        totalAmount,
        orderCount: ordersToBill.length,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Bill generation error:', error)

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to generate bill', error: error.message },
      { status: 500 }
    )
  }
}
