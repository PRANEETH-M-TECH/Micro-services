'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { User, Vendor, Admin } from '@/types'
import { COLLECTIONS } from '@/lib/db-schema'

type UserRole = 'customer' | 'vendor' | 'admin' | null

interface AuthContextType {
  user: User | Vendor | Admin | null
  firebaseUser: FirebaseUser | null
  role: UserRole
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Vendor | Admin | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          // Check all collections to determine role (automatic role detection)
          // Priority: Admin > Vendor > Customer
          
          // Check if admin
          const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, fbUser.uid))
          if (adminDoc.exists()) {
            const adminData = adminDoc.data()
            if (adminData.isActive) {
              setUser({ id: fbUser.uid, ...adminData } as Admin)
              setRole('admin')
              setLoading(false)
              return
            }
          }

          // Check if vendor
          const vendorDoc = await getDoc(doc(db, COLLECTIONS.VENDORS, fbUser.uid))
          if (vendorDoc.exists()) {
            const vendorData = vendorDoc.data()
            if (vendorData.isActive) {
              setUser({ id: fbUser.uid, ...vendorData } as Vendor)
              setRole('vendor')
              setLoading(false)
              return
            }
          }

          // Check if customer
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, fbUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            if (userData.isActive) {
              setUser({ id: fbUser.uid, ...userData } as User)
              setRole('customer')
              setLoading(false)
              return
            }
          }

          // User exists in Auth but not in any collection
          setUser(null)
          setRole(null)
        } catch (error) {
          console.error('Error fetching user:', error)
          setUser(null)
          setRole(null)
        }
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Role will be automatically detected in useEffect above
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setRole(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, role, loading, signIn, signOut }}>
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
