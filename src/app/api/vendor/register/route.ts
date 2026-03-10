import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS } from '@/lib/db-schema'

/**
 * Public Vendor Registration Route
 *
 * Allows a vendor to self-register. The vendor account is created in Firebase Auth
 * and a vendor document is created in Firestore with isApproved = false.
 * Admins must later approve the vendor via the existing admin/vendor approval flow.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, societyId } = body

    // Validate input
    if (!email || !password || !name || !phone || !societyId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 1) Create vendor in Firebase Auth (this signs in the new user in this runtime)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const vendorId = userCredential.user.uid

    try {
      // 2) Verify society exists (requires auth in your current rules)
      const societyDoc = await getDoc(doc(db, COLLECTIONS.SOCIETIES, societyId))
      if (!societyDoc.exists()) {
        await deleteUser(userCredential.user)
        return NextResponse.json(
          { message: 'Society not found' },
          { status: 404 }
        )
      }

      // 3) Create a pending vendor request (admin will approve and create vendors/{vendorId})
      await setDoc(doc(db, COLLECTIONS.VENDOR_REQUESTS, vendorId), {
        id: vendorId,
        email,
        name,
        phone,
        societyId,
        status: 'pending',
        createdBy: 'self-register',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      // If Firestore write fails (e.g. rules), delete the newly created auth user to avoid orphans.
      try {
        await deleteUser(userCredential.user)
      } catch {
        // ignore cleanup failures
      }
      throw err
    }

    return NextResponse.json(
      {
        message: 'Registration submitted. Awaiting admin approval.',
        vendorId,
        note: 'You will be able to access vendor services only after an admin approves your account.',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Vendor registration error:', error)

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
          error:
            'Please ensure: 1) Authentication is enabled in Firebase Console, 2) Email/Password provider is enabled, 3) Environment variables are correct. See FIREBASE_SETUP.md for details.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to register vendor', error: error.message },
      { status: 500 }
    )
  }
}

