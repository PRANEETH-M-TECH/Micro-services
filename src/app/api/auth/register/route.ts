import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, block, flatNumber, role, societyId } = body

    // Validate input
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      id: uid,
      email,
      name,
      phone,
      role,
      societyId,
      block,
      flatNumber,
      createdAt: serverTimestamp(),
      totalOrders: 0,
      totalSpent: 0,
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

    return NextResponse.json(
      { message: 'Registration failed', error: error.message },
      { status: 500 }
    )
  }
}
