// Capstone marketplace types (Communa — society-restricted marketplace)

export type UserRole = 'consumer' | 'seller' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'
export type SellerStatus = 'pending' | 'approved' | 'rejected'
export type AdminActionType = 'approve' | 'reject'
export type AdminTargetType = 'user' | 'seller'

export interface AppUser {
  id: string
  email: string
  name: string
  phone: string
  flatNumber: string
  block?: string
  societyId: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
  approvedBy?: string
  rejectedAt?: Date
  rejectedBy?: string
  rejectedReason?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  order: number
}

export interface SellerListing {
  id: string
  userId: string
  category: string
  categorySlug: string
  title: string
  description: string
  priceRange: string
  contactNumber: string
  sellerName: string
  flatNumber: string
  block?: string
  societyId: string
  status: SellerStatus
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
  approvedBy?: string
  rejectedAt?: Date
  rejectedBy?: string
  rejectedReason?: string
}

export interface AdminAction {
  id: string
  adminId: string
  targetType: AdminTargetType
  targetId: string
  action: AdminActionType
  timestamp: Date
  notes?: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  phone: string
  flatNumber: string
  block?: string
  role: 'consumer' | 'seller'
  societyId?: string
}
