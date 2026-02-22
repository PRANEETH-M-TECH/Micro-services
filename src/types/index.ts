// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'vendor';
  societyId: string;
  block: string;
  flatNumber: string;
  createdAt: Date;
  profileImageUrl?: string;
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  phone: string;
  societyId: string;
  rating: number;
  totalDeliveries: number;
  status: 'online' | 'offline';
  createdAt: Date;
  profileImageUrl?: string;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  vendorId?: string;
  societyId: string;
  items: OrderItem[];
  quantity: number;
  totalPrice: number;
  date: Date;
  status: 'pending' | 'received' | 'scheduled' | 'out_for_delivery' | 'delivered' | 'cancelled';
  scheduledTime?: Date;
  deliveryTime?: Date;
  notes?: string;
  canIncluded: boolean;
  canPrice?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Chat Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'vendor';
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  vendorId: string;
  societyId: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

// Payment/Bill Types
export interface Bill {
  id: string;
  orderId: string;
  customerId: string;
  vendorId: string;
  societyId: string;
  itemsTotal: number;
  canCharge: number;
  totalAmount: number;
  generatedAt: Date;
  paid: boolean;
  paidAt?: Date;
  paymentMethod?: string;
}

// Society Config
export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  imageUrl?: string;
  totalBlocks: number;
  description: string;
  createdAt: Date;
}

export interface PriceConfig {
  societyId: string;
  canPrice: number;
  waterPrice: number;
  currency: string;
}
