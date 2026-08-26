'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/db-schema'
import { AppUser, UserRole } from '@/types/capstone'
import { normalizeAppUser } from '@/lib/routing'

interface AuthContextType {
  user: AppUser | null
  firebaseUser: FirebaseUser | null
  role: UserRole | null
  status: AppUser['status'] | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AppUser>
  signOut: () => Promise<void>
  refreshUser: () => Promise<AppUser | null>
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid))
  if (userDoc.exists()) {
    return normalizeAppUser(userDoc.id, userDoc.data() as Record<string, unknown>)
  }

  const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, uid))
  if (adminDoc.exists()) {
    const data = adminDoc.data() as Record<string, unknown>
    return normalizeAppUser(adminDoc.id, {
      ...data,
      role: 'admin',
      status: 'approved',
      flatNumber: data.flatNumber ?? 'Admin',
    })
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async (): Promise<AppUser | null> => {
    const uid = auth.currentUser?.uid
    if (!uid) {
      setUser(null)
      return null
    }
    const profile = await fetchUserProfile(uid)
    setUser(profile)
    return profile
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          const profile = await fetchUserProfile(fbUser.uid)
          setUser(profile)
        } catch (error) {
          console.error('[auth-context] Error fetching profile:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<AppUser> => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const profile = await fetchUserProfile(credential.user.uid)
    if (!profile) {
      await firebaseSignOut(auth)
      throw new Error('Account not found. Please register first.')
    }
    setUser(profile)
    return profile
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
  }

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null
    return auth.currentUser.getIdToken()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role ?? null,
        status: user?.status ?? null,
        loading,
        signIn,
        signOut,
        refreshUser,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
