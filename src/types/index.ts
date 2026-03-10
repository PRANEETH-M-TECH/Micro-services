// ============================================
// USER TYPES (Customers Only)
// ============================================

export interface User {
  // Identity
  id: string;                    // Firebase Auth UID (same as document ID)
  email: string;                 // User email (unique)
  name: string;                  // Full name
  phone: string;                 // Phone number
  
  // Location
  societyId: string;             // Reference to societies collection
  block: string;                 // Block identifier (e.g., "A", "B", "1", "2")
  flatNumber: string;            // Flat number (e.g., "101", "2B", "301")
  
  // Profile
  profileImageUrl?: string;      // Firebase Storage URL for profile image
  
  // Stats
  totalOrders: number;           // Total orders placed (default: 0)
  totalSpent: number;            // Total amount spent in INR (default: 0)
  
  // Verification (Managed by Admin)
  isVerified: boolean;           // Customer data verified by admin (default: false)
  verifiedAt?: Date;             // Verification timestamp
  verifiedBy?: string;           // Admin ID who verified
  
  // Metadata
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
  lastLoginAt?: Date;            // Last login timestamp
  isActive: boolean;             // Account active status (default: true)
  createdBy?: string;            // Admin ID who created (if created by admin)
}

// ============================================
// VENDOR TYPES
// ============================================

export interface Vendor {
  // Identity
  id: string;                    // Firebase Auth UID (same as document ID)
  email: string;                 // Vendor email (unique)
  name: string;                  // Vendor name
  phone: string;                 // Phone number
  
  // Location
  societyId: string;            // Reference to societies collection
  
  // Profile
  profileImageUrl?: string;      // Firebase Storage URL for profile image
  
  // Stats
  rating: number;                // Average rating (1-5, default: 0)
  totalDeliveries: number;        // Total deliveries made (default: 0)
  totalEarnings: number;         // Total earnings in INR (default: 0)
  
  // Status
  status: 'online' | 'offline';  // Vendor availability status (default: "offline")
  
  // Management (Managed by Admin)
  isActive: boolean;             // Vendor active status (default: true)
  isApproved: boolean;           // Vendor approved by admin (default: false)
  approvedAt?: Date;             // Approval timestamp
  approvedBy?: string;           // Admin ID who approved
  
  // Metadata
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
  lastLoginAt?: Date;            // Last login timestamp
  createdBy: string;             // Admin ID who created the vendor
}

// ============================================
// VENDOR REQUEST TYPES (Self Registration)
// ============================================

export interface VendorRequest {
  id: string;                    // Firebase Auth UID (same as document ID)
  email: string;                 // Vendor email (unique)
  name: string;                  // Vendor name
  phone: string;                 // Phone number
  societyId: string;             // Reference to societies collection

  status: 'pending' | 'approved' | 'rejected';

  createdAt: Date;
  updatedAt: Date;

  approvedAt?: Date;
  approvedBy?: string;

  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface Admin {
  // Identity
  id: string;                    // Firebase Auth UID (same as document ID)
  email: string;                 // Admin email (unique)
  name: string;                  // Admin name
  phone: string;                 // Phone number
  
  // Role
  role: 'main_admin';            // Role type (for future: "main_admin" | "society_admin")
  societyId: string;            // Reference to societies collection
  
  // Profile
  profileImageUrl?: string;      // Firebase Storage URL for profile image
  
  // Permissions (for future multi-admin support)
  permissions: {
    manageVendors: boolean;      // Can add/edit/delete vendors (default: true)
    manageCustomers: boolean;    // Can verify/edit customers (default: true)
    manageOrders: boolean;      // Can view/manage all orders (default: true)
    manageBills: boolean;        // Can generate/manage bills (default: true)
    manageSettings: boolean;     // Can change society settings (default: true)
  };
  
  // Metadata
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
  lastLoginAt?: Date;            // Last login timestamp
  isActive: boolean;             // Account active status (default: true)
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
  // Identity
  id: string;                    // Document ID (auto-generated)
  orderNumber: string;           // Human-readable order number (e.g., "ORD-2024-001")
  
  // Relationships
  customerId: string;            // Reference to users collection (customer)
  vendorId?: string;             // Reference to vendors collection (assigned vendor)
  societyId: string;             // Reference to societies collection
  
  // Order Details
  quantity: number;              // Number of water cans (1-10 typically)
  waterPrice: number;            // Price per can (from priceConfig)
  waterCost: number;             // Total water cost (quantity × waterPrice)
  canIncluded: boolean;         // Whether customer needs can deposit
  canPrice?: number;             // Can deposit price (if canIncluded = true)
  canCharge: number;             // Total can charge (0 if canIncluded = false)
  totalCost: number;             // Total order amount (waterCost + canCharge)
  
  // Delivery Details
  block: string;                 // Delivery block
  flatNumber: string;            // Delivery flat number
  deliveryAddress?: string;      // Additional delivery instructions
  notes?: string;                // Customer notes/special instructions
  
  // Status & Timing
  status: 'pending' | 'received' | 'scheduled' | 'out_for_delivery' | 'delivered';
  scheduledTime?: Date;          // Scheduled delivery time (if status = "scheduled")
  deliveryTime?: Date;            // Actual delivery time (when status = "delivered")
  
  // Metadata
  createdAt: Date;               // Order creation timestamp
  updatedAt: Date;               // Last update timestamp
  createdBy: string;             // User ID who created (customerId)
  
  // Note: Cancelled orders are HARD DELETED, not stored
}

// ============================================
// BILL TYPES
// ============================================

export interface Bill {
  // Identity
  id: string;                    // Document ID (auto-generated)
  billNumber: string;            // Human-readable bill number (e.g., "BILL-2024-001")
  
  // Relationships
  customerId: string;            // Reference to users collection (customer)
  vendorId?: string;             // Reference to vendors collection (if specific vendor)
  societyId: string;             // Reference to societies collection
  
  // Bill Period (Flexible)
  periodType: 'daily' | 'weekly' | 'monthly'; // Billing period type
  periodStart: Date;              // Period start date
  periodEnd: Date;                // Period end date
  periodLabel: string;            // Human-readable label (e.g., "January 2024", "Week 1", "2024-01-15")
  
  // Order References
  orderIds: string[];            // Array of order IDs included in this bill
  
  // Bill Details
  itemsTotal: number;            // Total for items (sum of waterCost from orders)
  canCharge: number;             // Total can deposit charges
  totalAmount: number;            // Final bill amount (itemsTotal + canCharge)
  
  // Payment
  paid: boolean;                 // Payment status (default: false)
  paidAt?: Date;                 // Payment timestamp
  paymentMethod?: 'cash' | 'online' | 'upi' | 'card'; // Payment method
  paymentReferenceId?: string;   // Payment gateway transaction ID
  paymentNotes?: string;         // Additional payment notes
  
  // Metadata
  generatedAt: Date;             // Bill generation timestamp
  generatedBy: string;            // Admin ID who generated the bill
  dueDate?: Date;                // Payment due date
  createdAt: Date;               // Document creation timestamp
  updatedAt: Date;               // Last update timestamp
}

// ============================================
// CONVERSATION TYPES
// ============================================

export interface Conversation {
  // Identity
  id: string;                    // Document ID (auto-generated)
  
  // Participants
  customerId: string;            // Reference to users collection (customer)
  vendorId: string;              // Reference to vendors collection (vendor)
  societyId: string;             // Reference to societies collection
  
  // Conversation State
  lastMessage?: string;          // Last message text (denormalized for quick access)
  lastMessageTime?: Date;        // Last message timestamp
  lastMessageSenderId?: string;  // ID of last message sender
  
  // Unread Counts (per participant)
  customerUnreadCount: number;   // Unread messages for customer (default: 0)
  vendorUnreadCount: number;     // Unread messages for vendor (default: 0)
  
  // Metadata
  createdAt: Date;               // Conversation creation timestamp
  updatedAt: Date;               // Last update timestamp
  isArchived: boolean;           // Archive status (default: false)
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  // Identity
  id: string;                    // Document ID (auto-generated)
  
  // Relationships
  conversationId: string;        // Reference to conversations collection
  senderId: string;              // Reference to users/vendors collection (sender)
  
  // Message Content
  text: string;                  // Message text content
  senderName: string;            // Sender's name (denormalized)
  senderRole: 'customer' | 'vendor'; // Sender's role (denormalized)
  
  // Delivery Status
  status: 'sent' | 'delivered' | 'read'; // Message delivery status (default: "sent")
  sentAt: Date;                  // Sent timestamp
  deliveredAt?: Date;            // Delivered timestamp (when status = "delivered")
  readAt?: Date;                 // Read timestamp (when status = "read")
  
  // Metadata
  timestamp: Date;               // Message timestamp (same as sentAt)
  createdAt: Date;               // Document creation timestamp
}

// ============================================
// SOCIETY TYPES
// ============================================

export interface Society {
  // Identity
  id: string;                    // Society ID (same as document ID)
  name: string;                  // Society name (e.g., "URBAN-RISE-City of Joy")
  slug: string;                  // URL-friendly identifier (e.g., "urban-rise-city-of-joy")
  
  // Location
  address: string;               // Full address
  city: string;                  // City name
  state?: string;                // State name
  pincode: string;               // Postal code
  country: string;               // Country (default: "India")
  
  // Details
  description?: string;          // Society description
  totalBlocks: number;          // Number of blocks
  totalFlats?: number;           // Total number of flats (optional)
  imageUrl?: string;             // Society image URL
  
  // Configuration
  isActive: boolean;             // Society active status (default: true)
  adminId: string;               // Main admin ID (reference to admins collection)
  
  // Metadata
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}

// ============================================
// PRICE CONFIG TYPES
// ============================================

export interface PriceConfig {
  // Identity
  societyId: string;             // Reference to societies collection (same as document ID)
  
  // Pricing
  canPrice: number;              // Price per water can (in currency)
  waterPrice: number;            // Same as canPrice (for consistency)
  canDepositPrice: number;       // Can deposit/refundable charge
  
  // Currency
  currency: string;              // Currency code (default: "INR")
  currencySymbol: string;        // Currency symbol (default: "₹")
  
  // Metadata
  updatedAt: Date;               // Last update timestamp
  updatedBy: string;              // Admin ID who updated
}

// ============================================
// HELPER TYPES
// ============================================

export type UserRole = 'customer' | 'vendor' | 'admin';
export type OrderStatus = 'pending' | 'received' | 'scheduled' | 'out_for_delivery' | 'delivered';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type BillPeriodType = 'daily' | 'weekly' | 'monthly';
export type PaymentMethod = 'cash' | 'online' | 'upi' | 'card';
export type VendorStatus = 'online' | 'offline';
