/**
 * Authentication and Authorization Utilities
 * 
 * Helper functions for checking user roles and permissions
 */

import { auth, db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { User, Vendor, Admin } from '@/types'
import { COLLECTIONS } from './db-schema'

// ============================================
// ROLE CHECKING FUNCTIONS
// ============================================

/**
 * Get current authenticated user ID
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null
}

/**
 * Get user document from Firestore
 */
export async function getUserDoc(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User
    }
    return null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * Get vendor document from Firestore
 */
export async function getVendorDoc(vendorId: string): Promise<Vendor | null> {
  try {
    const vendorDoc = await getDoc(doc(db, COLLECTIONS.VENDORS, vendorId))
    if (vendorDoc.exists()) {
      return { id: vendorDoc.id, ...vendorDoc.data() } as Vendor
    }
    return null
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return null
  }
}

/**
 * Get admin document from Firestore
 */
export async function getAdminDoc(adminId: string): Promise<Admin | null> {
  try {
    console.log('[auth:getAdminDoc] Fetching admin document', { adminId })
    const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, adminId))
    if (adminDoc.exists()) {
      const adminData = adminDoc.data()
      console.log('[auth:getAdminDoc] Admin document found', {
        adminId: adminDoc.id,
        isActive: (adminData as any)?.isActive,
        role: (adminData as any)?.role,
      })
      return { id: adminDoc.id, ...adminData } as Admin
    }
    console.warn('[auth:getAdminDoc] No admin document for id', { adminId })
    return null
  } catch (error) {
    const err = error as any
    console.error('[auth:getAdminDoc] Error fetching admin document', {
      adminId,
      code: err?.code,
      message: err?.message,
    })
    return null
  }
}

/**
 * Check if current user is a customer
 */
export async function isCustomer(userId?: string): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  
  const user = await getUserDoc(uid)
  return user !== null && user.isActive === true
}

/**
 * Check if current user is a verified customer
 */
export async function isVerifiedCustomer(userId?: string): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  
  const user = await getUserDoc(uid)
  return user !== null && user.isActive === true && user.isVerified === true
}

/**
 * Check if current user is a vendor
 */
export async function isVendor(userId?: string): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  
  const vendor = await getVendorDoc(uid)
  return vendor !== null && 
         vendor.isActive === true && 
         vendor.isApproved === true
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  console.log('[auth:isAdmin] Checking admin status for user', { uid })
  const admin = await getAdminDoc(uid)
  const isAdminUser = admin !== null && admin.isActive === true
  console.log('[auth:isAdmin] Result', {
    uid,
    hasAdminDoc: !!admin,
    isActive: admin?.isActive,
    isAdmin: isAdminUser,
  })
  return isAdminUser
}

/**
 * Check if current user is main admin
 */
export async function isMainAdmin(userId?: string): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  
  const admin = await getAdminDoc(uid)
  return admin !== null && 
         admin.isActive === true && 
         admin.role === 'main_admin'
}

/**
 * Get user role type
 */
export async function getUserRole(userId?: string): Promise<'customer' | 'vendor' | 'admin' | null> {
  const uid = userId || getCurrentUserId()
  if (!uid) return null
  
  // Check admin first (admins might also exist in other collections)
  if (await isAdmin(uid)) return 'admin'
  if (await isVendor(uid)) return 'vendor'
  if (await isCustomer(uid)) return 'customer'
  
  return null
}

/**
 * Check if user has permission
 */
export async function hasPermission(
  permission: 'manageVendors' | 'manageCustomers' | 'manageOrders' | 'manageBills' | 'manageSettings',
  userId?: string
): Promise<boolean> {
  const uid = userId || getCurrentUserId()
  if (!uid) return false
  
  const admin = await getAdminDoc(uid)
  if (!admin || !admin.isActive) return false
  
  return admin.permissions[permission] === true
}

/**
 * Get current user's full profile (user, vendor, or admin)
 */
export async function getCurrentUserProfile(): Promise<User | Vendor | Admin | null> {
  const uid = getCurrentUserId()
  if (!uid) return null
  
  // Try admin first
  const admin = await getAdminDoc(uid)
  if (admin) return admin
  
  // Try vendor
  const vendor = await getVendorDoc(uid)
  if (vendor) return vendor
  
  // Try customer
  const user = await getUserDoc(uid)
  if (user) return user
  
  return null
}

// ============================================
// AUTHORIZATION HELPERS FOR API ROUTES
// ============================================

/**
 * Verify user is authenticated (for API routes)
 */
export function requireAuth(): string {
  const uid = getCurrentUserId()
  if (!uid) {
    throw new Error('Unauthorized: User not authenticated')
  }
  return uid
}

/**
 * Verify user is a customer (for API routes)
 */
export async function requireCustomer(userId?: string): Promise<User> {
  const uid = userId || requireAuth()
  const user = await getUserDoc(uid)
  
  if (!user || !user.isActive) {
    throw new Error('Unauthorized: User is not an active customer')
  }
  
  return user
}

/**
 * Verify user is a verified customer (for API routes)
 */
export async function requireVerifiedCustomer(userId?: string): Promise<User> {
  const user = await requireCustomer(userId)
  
  if (!user.isVerified) {
    throw new Error('Unauthorized: Customer is not verified')
  }
  
  return user
}

/**
 * Verify user is a vendor (for API routes)
 */
export async function requireVendor(userId?: string): Promise<Vendor> {
  const uid = userId || requireAuth()
  const vendor = await getVendorDoc(uid)
  
  if (!vendor || !vendor.isActive || !vendor.isApproved) {
    throw new Error('Unauthorized: User is not an approved vendor')
  }
  
  return vendor
}

/**
 * Verify user is an admin (for API routes)
 */
export async function requireAdmin(userId?: string): Promise<Admin> {
  const uid = userId || requireAuth()
  const admin = await getAdminDoc(uid)
  
  if (!admin || !admin.isActive) {
    throw new Error('Unauthorized: User is not an admin')
  }
  
  return admin
}

/**
 * Verify user has specific permission (for API routes)
 */
export async function requirePermission(
  permission: 'manageVendors' | 'manageCustomers' | 'manageOrders' | 'manageBills' | 'manageSettings',
  userId?: string
): Promise<Admin> {
  const admin = await requireAdmin(userId)
  
  if (!admin.permissions[permission]) {
    throw new Error(`Unauthorized: Admin does not have ${permission} permission`)
  }
  
  return admin
}

// ============================================
// OWNERSHIP CHECKING
// ============================================

/**
 * Check if user owns a resource
 */
export function isOwner(resourceUserId: string, userId?: string): boolean {
  const uid = userId || getCurrentUserId()
  return uid === resourceUserId
}

/**
 * Verify user owns a resource (for API routes)
 */
export function requireOwnership(resourceUserId: string, userId?: string): void {
  if (!isOwner(resourceUserId, userId)) {
    throw new Error('Unauthorized: User does not own this resource')
  }
}
