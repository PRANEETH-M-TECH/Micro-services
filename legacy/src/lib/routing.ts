import type { AppUser, UserRole, UserStatus } from '@/types/capstone'

/** Resolve post-login destination based on role and approval status */
export function getPostLoginPath(user: Pick<AppUser, 'role' | 'status'>): string {
  if (user.status === 'pending') return '/pending'
  if (user.status === 'rejected') return '/pending'

  switch (user.role) {
    case 'admin':
      return '/admin/dashboard'
    case 'seller':
    case 'consumer':
      return '/marketplace'
    default:
      return '/login'
  }
}

/** Map legacy Firestore user fields to capstone AppUser shape */
export function normalizeAppUser(id: string, data: Record<string, unknown>): AppUser {
  const role = resolveRole(data)
  const status = resolveStatus(data)

  return {
    id,
    email: String(data.email ?? ''),
    name: String(data.name ?? ''),
    phone: String(data.phone ?? ''),
    flatNumber: String(data.flatNumber ?? data.flat_no ?? ''),
    block: data.block ? String(data.block) : undefined,
    societyId: String(data.societyId ?? 'urban-rise-city-of-joy'),
    role,
    status,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    approvedAt: data.approvedAt ? toDate(data.approvedAt) : undefined,
    approvedBy: data.approvedBy ? String(data.approvedBy) : undefined,
    rejectedAt: data.rejectedAt ? toDate(data.rejectedAt) : undefined,
    rejectedBy: data.rejectedBy ? String(data.rejectedBy) : undefined,
    rejectedReason: data.rejectedReason ? String(data.rejectedReason) : undefined,
  }
}

function resolveRole(data: Record<string, unknown>): UserRole {
  if (data.role === 'admin' || data.role === 'seller' || data.role === 'consumer') {
    return data.role
  }
  // Legacy: customer → consumer
  if (data.role === 'customer') return 'consumer'
  return 'consumer'
}

function resolveStatus(data: Record<string, unknown>): UserStatus {
  if (data.status === 'pending' || data.status === 'approved' || data.status === 'rejected') {
    return data.status
  }
  // Legacy: isVerified flag
  if (data.isVerified === true) return 'approved'
  if (data.isVerified === false) return 'pending'
  // Admins from legacy collection are always approved
  if (data.role === 'admin' || data.role === 'main_admin') return 'approved'
  return 'pending'
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value)
  }
  return new Date()
}
