import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS, SOCIETY_ID } from '@/lib/db-schema'
import { validateEmail, validatePhoneNumber } from '@/lib/db-schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      flatNumber,
      block,
      role = 'consumer',
      societyId = SOCIETY_ID,
    } = body

    if (!email || !password || !name || !phone || !flatNumber) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (role !== 'consumer' && role !== 'seller') {
      return NextResponse.json(
        { message: 'Role must be consumer or seller' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 })
    }

    if (!validatePhoneNumber(phone)) {
      return NextResponse.json(
        { message: 'Invalid phone number (10 digits required)' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      id: uid,
      email,
      name,
      phone,
      flatNumber,
      block: block || null,
      societyId,
      role,
      status: DEFAULTS.APP_USER.status,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Registration successful. Awaiting admin approval.',
        userId: uid,
        role,
        status: 'pending',
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    console.error('Registration error:', err)

    if (err.code === 'auth/email-already-in-use') {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
    }
    if (err.code === 'auth/weak-password') {
      return NextResponse.json(
        { message: 'Password should be at least 6 characters' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Registration failed', error: err.message },
      { status: 500 }
    )
  }
}
