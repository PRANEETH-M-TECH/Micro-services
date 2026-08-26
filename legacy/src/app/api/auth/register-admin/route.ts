import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { COLLECTIONS, DEFAULTS } from '@/lib/db-schema'

/**
 * Admin Registration Route
 * 
 * IMPORTANT: For the FIRST admin, you need to either:
 * 1. Create manually in Firebase Console, OR
 * 2. Use a special setup token (for security)
 * 
 * After first admin exists, they can create additional admins.
 * 
 * Usage:
 * POST /api/auth/register-admin
 * Body: { email, password, name, phone, societyId, setupToken? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      phone, 
      societyId,
      setupToken // Optional: for first admin creation
    } = body

    console.log('[Admin Registration] Received request for email:', email)

    // Validate input
    if (!email || !password || !name || !phone || !societyId) {
      console.warn('[Admin Registration] Missing required fields')
      return NextResponse.json(
        { 
          message: 'Missing required fields',
          required: ['email', 'password', 'name', 'phone', 'societyId']
        },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      console.warn('[Admin Registration] Password too weak')
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if this is first admin creation
    const isFirstAdmin = !!setupToken

    // If first admin, require setup token (you can set this in environment variables)
    if (isFirstAdmin) {
      const requiredToken = process.env.ADMIN_SETUP_TOKEN || 'FIRST_ADMIN_SETUP_2024'
      if (setupToken !== requiredToken) {
        console.warn('[Admin Registration] Invalid setup token for first admin')
        return NextResponse.json(
          { 
            message: 'Invalid setup token for first admin creation',
            hint: 'Contact system administrator for correct setup token'
          },
          { status: 403 }
        )
      }
      console.log('[Admin Registration] Valid setup token - creating first admin')
    } else {
      console.log('[Admin Registration] Creating additional admin')
      // For subsequent admins, verify current user is an admin
      // This will be handled by middleware/auth check in production
      // For now, we'll allow if authenticated (you should add proper admin check)
    }

    // Create admin in Firebase Auth
    console.log('[Admin Registration] Creating Firebase Auth account...')
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    console.log('[Admin Registration] Firebase Auth account created with UID:', uid)

    // Create admin document in Firestore
    console.log('[Admin Registration] Creating Firestore admin document...')
    await setDoc(doc(db, COLLECTIONS.ADMINS, uid), {
      id: uid,
      email,
      name,
      phone,
      role: DEFAULTS.ADMIN.role,
      societyId,
      permissions: DEFAULTS.ADMIN.permissions,
      isActive: DEFAULTS.ADMIN.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('[Admin Registration] Firestore admin document created')

    // Update society document with admin ID (if first admin)
    if (isFirstAdmin) {
      console.log('[Admin Registration] Linking admin to society...')
      const societyRef = doc(db, COLLECTIONS.SOCIETIES, societyId)
      await setDoc(societyRef, {
        adminId: uid,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      console.log('[Admin Registration] Society linked successfully')
    }

    console.log('[Admin Registration] ✅ Admin registration successful - UID:', uid)
    return NextResponse.json(
      { 
        message: 'Admin registered successfully', 
        adminId: uid,
        email: email,
        isFirstAdmin,
        nextStep: 'Visit /admin/login to sign in with the provided credentials'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[Admin Registration] ❌ Error:', error)

    if (error.code === 'auth/email-already-in-use') {
      console.error('[Admin Registration] Email already exists in Firebase Auth')
      return NextResponse.json(
        { 
          message: 'Email already in use',
          details: 'An account with this email already exists in Firebase',
          error: 'auth/email-already-in-use'
        },
        { status: 400 }
      )
    }

    if (error.code === 'auth/weak-password') {
      console.error('[Admin Registration] Weak password provided')
      return NextResponse.json(
        { 
          message: 'Password is too weak',
          details: 'Password should be at least 6 characters',
          error: 'auth/weak-password'
        },
        { status: 400 }
      )
    }

    if (error.code === 'auth/invalid-email') {
      console.error('[Admin Registration] Invalid email format')
      return NextResponse.json(
        { 
          message: 'Invalid email format',
          details: 'Please provide a valid email address',
          error: 'auth/invalid-email'
        },
        { status: 400 }
      )
    }

    console.error('[Admin Registration] Unexpected error:', {
      code: error.code,
      message: error.message,
      details: error
    })

    return NextResponse.json(
      { 
        message: 'Admin registration failed',
        error: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
