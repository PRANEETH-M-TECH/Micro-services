/**
 * Database Schema Constants and Utilities
 * 
 * This file contains collection names, field names, and helper functions
 * for working with the Firestore database schema.
 */

// ============================================
// COLLECTION NAMES
// ============================================

export const COLLECTIONS = {
  USERS: 'users',
  VENDORS: 'vendors',
  VENDOR_REQUESTS: 'vendorRequests',
  ADMINS: 'admins',
  ORDERS: 'orders',
  BILLS: 'bills',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  SOCIETIES: 'societies',
  PRICE_CONFIG: 'priceConfig',
} as const;

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULTS = {
  USER: {
    totalOrders: 0,
    totalSpent: 0,
    isVerified: false,
    isActive: true,
  },
  VENDOR: {
    rating: 0,
    totalDeliveries: 0,
    totalEarnings: 0,
    status: 'offline' as const,
    isActive: true,
    isApproved: false,
  },
  ADMIN: {
    role: 'main_admin' as const,
    permissions: {
      manageVendors: true,
      manageCustomers: true,
      manageOrders: true,
      manageBills: true,
      manageSettings: true,
    },
    isActive: true,
  },
  ORDER: {
    status: 'pending' as const,
    canCharge: 0,
  },
  BILL: {
    paid: false,
    orderIds: [] as string[],
  },
  CONVERSATION: {
    customerUnreadCount: 0,
    vendorUnreadCount: 0,
    isArchived: false,
  },
  MESSAGE: {
    status: 'sent' as const,
  },
  SOCIETY: {
    country: 'India',
    isActive: true,
  },
  PRICE_CONFIG: {
    currency: 'INR',
    currencySymbol: '₹',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a human-readable order number
 * Format: ORD-YYYY-XXX (e.g., ORD-2024-001)
 */
export function generateOrderNumber(year: number, sequence: number): string {
  return `ORD-${year}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Generate a human-readable bill number
 * Format: BILL-YYYY-XXX (e.g., BILL-2024-001)
 */
export function generateBillNumber(year: number, sequence: number): string {
  return `BILL-${year}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Generate period label for bills
 */
export function generatePeriodLabel(
  periodType: 'daily' | 'weekly' | 'monthly',
  startDate: Date
): string {
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1;
  const day = startDate.getDate();

  switch (periodType) {
    case 'daily':
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    case 'weekly':
      // Get week number
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() - startDate.getDay());
      const weekNum = Math.ceil((startDate.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      return `Week ${weekNum}, ${year}`;
    case 'monthly':
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[month - 1]} ${year}`;
    default:
      return startDate.toISOString().split('T')[0];
  }
}

/**
 * Calculate period dates based on type
 */
export function calculatePeriodDates(
  periodType: 'daily' | 'weekly' | 'monthly',
  date: Date = new Date()
): { start: Date; end: Date } {
  const start = new Date(date);
  const end = new Date(date);

  switch (periodType) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      // Start of week (Sunday)
      start.setDate(date.getDate() - date.getDay());
      start.setHours(0, 0, 0, 0);
      // End of week (Saturday)
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      // Start of month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      // End of month
      end.setMonth(date.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Basic validation: 10 digits or with country code
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get collection path helper
 */
export function getCollectionPath(collection: string, ...segments: string[]): string {
  return [collection, ...segments].join('/');
}

// ============================================
// FIELD VALIDATION
// ============================================

export const VALIDATION = {
  ORDER: {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 10,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
} as const;
