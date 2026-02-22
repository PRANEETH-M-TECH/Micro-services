import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS } from '@/lib/db-schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, block, flatNumber, societyId } = body

    // Validate input
    if (!email || !password || !name || !phone || !block || !flatNumber || !societyId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Create user document in Firestore (customers only)
    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      id: uid,
      email,
      name,
      phone,
      societyId,
      block,
      flatNumber,
      totalOrders: DEFAULTS.USER.totalOrders,
      totalSpent: DEFAULTS.USER.totalSpent,
      isVerified: DEFAULTS.USER.isVerified,
      isActive: DEFAULTS.USER.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      { message: 'User registered successfully', userId: uid },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

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

    if (error.code === 'auth/configuration-not-found') {
      return NextResponse.json(
        { 
          message: 'Firebase Authentication not configured properly',
          error: 'Please ensure: 1) Authentication is enabled in Firebase Console, 2) Email/Password provider is enabled, 3) Environment variables are correct. See FIREBASE_SETUP.md for details.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Registration failed', error: error.message, code: error.code },
      { status: 500 }
    )
  }
}
