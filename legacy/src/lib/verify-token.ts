import { NextRequest } from 'next/server'

interface VerifiedToken {
  uid: string
  email?: string
}

/**
 * Verify Firebase ID token via Identity Toolkit REST API (no Admin SDK required).
 */
export async function verifyIdToken(request: NextRequest): Promise<VerifiedToken | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const idToken = authHeader.slice(7)
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    const user = data.users?.[0]
    if (!user?.localId) return null

    return {
      uid: user.localId,
      email: user.email,
    }
  } catch {
    return null
  }
}

/** Require a valid Bearer token; throws if missing/invalid */
export async function requireAuthToken(request: NextRequest): Promise<VerifiedToken> {
  const verified = await verifyIdToken(request)
  if (!verified) {
    throw new Error('Unauthorized: Invalid or missing authentication token')
  }
  return verified
}
