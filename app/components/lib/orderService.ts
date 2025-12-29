import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./firebase";

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'technician_assigned'
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cash' | 'online' | 'card' | 'upi';

export interface Order {
  id: string;
  customerId: string;
  shopId: string;
  type: 'repair' | 'service' | 'purchase' | 'installation';
  status: OrderStatus;
  
  // Service details
  service: {
    category: string;
    subCategory: string;
    description: string;
    estimatedTime: number; // in hours
    estimatedCost: {
      min: number;
      max: number;
      currency: 'INR';
    };
  };
  
  // Item details (for purchase orders)
  items?: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specifications: Record<string, string>;
  }[];
  
  // Location details
  location: {
    type: 'shop' | 'home';
    address: string;
    city: string;
    pincode: string;
    landmark: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Scheduling
  schedule: {
    preferredDate: string; // YYYY-MM-DD
    preferredTime: string; // HH:MM
    scheduledDate: Timestamp | null;
    completedDate: Timestamp | null;
  };
  
  // Payment
  payment: {
    status: PaymentStatus;
    method: PaymentMethod;
    amount: number;
    paidAmount: number;
    transactionId?: string;
    invoiceUrl?: string;
  };
  
  // Technician details
  technician?: {
    id: string;
    name: string;
    phone: string;
    photoUrl: string;
    rating: number;
    location?: {
      lat: number;
      lng: number;
    };
  };
  
  // Tracking
  tracking: {
    statusUpdates: {
      status: OrderStatus;
      timestamp: Timestamp;
      message: string;
      updatedBy: string;
    }[];
    currentLocation?: {
      lat: number;
      lng: number;
      timestamp: Timestamp;
    };
    estimatedArrival?: Timestamp;
  };
  
  // Communication
  chatId?: string;
  
  // Ratings and reviews
  rating?: {
    stars: number;
    review: string;
    images: string[];
    timestamp: Timestamp;
  };
  
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    platformFee: number;
    taxAmount: number;
    discountAmount: number;
  };
}

// Create new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'metadata'>): Promise<string> => {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const order: Order = {
      ...orderData,
      id: orderId,
      metadata: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        platformFee: orderData.payment.amount * 0.1, // 10% platform fee
        taxAmount: orderData.payment.amount * 0.18, // 18% GST
        discountAmount: 0
      }
    };
    
    await setDoc(doc(db, 'orders', orderId), order);
    
    // Update shop statistics
    await updateDoc(doc(db, 'shops', order.shopId), {
      'metadata.totalBookings': increment(1)
    });
    
    // Create chat room for order
    await createOrderChat(orderId, order.customerId, order.shopId);
    
    return orderId;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get orders for user
export const getUserOrders = async (userId: string, userRole: 'customer' | 'shop_owner'): Promise<Order[]> => {
  const field = userRole === 'customer' ? 'customerId' : 'shopId';
  const q = query(
    collection(db, 'orders'),
    where(field, '==', userId),
    orderBy('metadata.createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const orders: Order[] = [];
  
  snapshot.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });
  
  return orders;
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  message: string,
  updatedBy: string
): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  
  await updateDoc(orderRef, {
    status,
    'tracking.statusUpdates': arrayUnion({
      status,
      timestamp: Timestamp.now(),
      message,
      updatedBy
    }),
    'metadata.updatedAt': Timestamp.now()
  });
  
  // Send real-time notification
  await sendOrderNotification(orderId, status, message);
};

// Real-time order updates
export const subscribeToOrder = (
  orderId: string,
  callback: (order: Order) => void
): Unsubscribe => {
  return onSnapshot(doc(db, 'orders', orderId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Order);
    }
  });
};

// Assign technician to order
export const assignTechnician = async (
  orderId: string,
  technician: Order['technician']
): Promise<void> => {
  await updateDoc(doc(db, 'orders', orderId), {
    technician,
    status: 'technician_assigned',
    'tracking.statusUpdates': arrayUnion({
      status: 'technician_assigned',
      timestamp: Timestamp.now(),
      message: `Technician ${technician?.name} assigned to your order`,
      updatedBy: 'system'
    }),
    'metadata.updatedAt': Timestamp.now()
  });
};

// Update technician location
export const updateTechnicianLocation = async (
  orderId: string,
  location: { lat: number; lng: number }
): Promise<void> => {
  await updateDoc(doc(db, 'orders', orderId), {
    'tracking.currentLocation': {
      ...location,
      timestamp: Timestamp.now()
    },
    'metadata.updatedAt': Timestamp.now()
  });
};

// Helper functions (Firestore field values)
const { arrayUnion, increment } = {
  arrayUnion: (...elements: any[]) => elements,
  increment: (n: number) => n
};

// Chat system
const createOrderChat = async (orderId: string, customerId: string, shopId: string) => {
  await setDoc(doc(db, 'chats', orderId), {
    orderId,
    participants: [customerId, shopId],
    messages: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

// Notification system
const sendOrderNotification = async (orderId: string, status: OrderStatus, message: string) => {
  // Implement FCM or email notifications here
};