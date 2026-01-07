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
  Unsubscribe,
  arrayUnion,
  increment
} from "firebase/firestore";
import { getFirebaseDB } from "./firebase";

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

/* =======================
   HELPERS
======================= */

const getDBOrThrow = () => {
  const db = getFirebaseDB();
  if (!db) throw new Error("Firebase DB not initialized");
  return db;
};

// Mock mode for development
const isMockFirebase =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NODE_ENV === "development";

const mockOrders: Record<string, Order> = {};

/* =======================
   CREATE ORDER
======================= */

export const createOrder = async (orderData: Omit<Order, 'id' | 'metadata'>): Promise<string> => {
  try {
    if (isMockFirebase) {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const order: Order = {
        ...orderData,
        id: orderId,
        metadata: {
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          platformFee: orderData.payment.amount * 0.1,
          taxAmount: orderData.payment.amount * 0.18,
          discountAmount: 0
        }
      };
      
      mockOrders[orderId] = order;
      return orderId;
    }

    const db = getDBOrThrow();
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

/* =======================
   GET USER ORDERS
======================= */

export const getUserOrders = async (userId: string, userRole: 'customer' | 'shop_owner'): Promise<Order[]> => {
  if (isMockFirebase) {
    const field = userRole === 'customer' ? 'customerId' : 'shopId';
    const filteredOrders = Object.values(mockOrders).filter(order => order[field] === userId);
    return filteredOrders.sort((a, b) => b.metadata.createdAt.toMillis() - a.metadata.createdAt.toMillis());
  }

  const db = getDBOrThrow();
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

/* =======================
   GET ORDER BY ID
======================= */

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  if (isMockFirebase) {
    return mockOrders[orderId] || null;
  }

  const db = getDBOrThrow();
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  
  return null;
};

/* =======================
   UPDATE ORDER STATUS
======================= */

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  message: string,
  updatedBy: string
): Promise<void> => {
  if (isMockFirebase) {
    if (mockOrders[orderId]) {
      mockOrders[orderId].status = status;
      mockOrders[orderId].tracking.statusUpdates.push({
        status,
        timestamp: Timestamp.now(),
        message,
        updatedBy
      });
      mockOrders[orderId].metadata.updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
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

/* =======================
   REAL-TIME ORDER UPDATES
======================= */

export const subscribeToOrder = (
  orderId: string,
  callback: (order: Order | null) => void
): Unsubscribe => {
  if (isMockFirebase) {
    // Initial call
    callback(mockOrders[orderId] || null);
    
    const interval = setInterval(() => {
      callback(mockOrders[orderId] || null);
    }, 5000);
    
    return () => clearInterval(interval);
  }

  const db = getDBOrThrow();
  return onSnapshot(doc(db, 'orders', orderId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Order);
    } else {
      callback(null);
    }
  });
};

/* =======================
   ASSIGN TECHNICIAN
======================= */

export const assignTechnician = async (
  orderId: string,
  technician: Order['technician']
): Promise<void> => {
  if (isMockFirebase) {
    if (mockOrders[orderId] && technician) {
      mockOrders[orderId].technician = technician;
      mockOrders[orderId].status = 'technician_assigned';
      mockOrders[orderId].tracking.statusUpdates.push({
        status: 'technician_assigned',
        timestamp: Timestamp.now(),
        message: `Technician ${technician.name} assigned to your order`,
        updatedBy: 'system'
      });
      mockOrders[orderId].metadata.updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  
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

/* =======================
   UPDATE TECHNICIAN LOCATION
======================= */

export const updateTechnicianLocation = async (
  orderId: string,
  location: { lat: number; lng: number }
): Promise<void> => {
  if (isMockFirebase) {
    if (mockOrders[orderId]) {
      mockOrders[orderId].tracking.currentLocation = {
        ...location,
        timestamp: Timestamp.now()
      };
      mockOrders[orderId].metadata.updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  
  await updateDoc(doc(db, 'orders', orderId), {
    'tracking.currentLocation': {
      ...location,
      timestamp: Timestamp.now()
    },
    'metadata.updatedAt': Timestamp.now()
  });
};

/* =======================
   UPDATE PAYMENT STATUS
======================= */

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  transactionId?: string,
  invoiceUrl?: string
): Promise<void> => {
  if (isMockFirebase) {
    if (mockOrders[orderId]) {
      mockOrders[orderId].payment.status = paymentStatus;
      if (transactionId) mockOrders[orderId].payment.transactionId = transactionId;
      if (invoiceUrl) mockOrders[orderId].payment.invoiceUrl = invoiceUrl;
      mockOrders[orderId].metadata.updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  const updateData: any = {
    'payment.status': paymentStatus,
    'metadata.updatedAt': Timestamp.now()
  };
  
  if (transactionId) updateData['payment.transactionId'] = transactionId;
  if (invoiceUrl) updateData['payment.invoiceUrl'] = invoiceUrl;
  
  await updateDoc(doc(db, 'orders', orderId), updateData);
};

/* =======================
   GET SHOP ORDERS
======================= */

export const getShopOrders = async (
  shopId: string,
  status?: OrderStatus,
  limit: number = 50
): Promise<Order[]> => {
  if (isMockFirebase) {
    let orders = Object.values(mockOrders).filter(order => order.shopId === shopId);
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    return orders.sort((a, b) => b.metadata.createdAt.toMillis() - a.metadata.createdAt.toMillis()).slice(0, limit);
  }

  const db = getDBOrThrow();
  let q;
  
  if (status) {
    q = query(
      collection(db, 'orders'),
      where('shopId', '==', shopId),
      where('status', '==', status),
      orderBy('metadata.createdAt', 'desc')
    );
  } else {
    q = query(
      collection(db, 'orders'),
      where('shopId', '==', shopId),
      orderBy('metadata.createdAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  const orders: Order[] = [];
  
  snapshot.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });
  
  return orders.slice(0, limit);
};

/* =======================
   SUBMIT RATING
======================= */

export const submitOrderRating = async (
  orderId: string,
  rating: Order['rating']
): Promise<void> => {
  if (isMockFirebase) {
    if (mockOrders[orderId]) {
      mockOrders[orderId].rating = rating;
      mockOrders[orderId].metadata.updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  
  await updateDoc(doc(db, 'orders', orderId), {
    rating,
    'metadata.updatedAt': Timestamp.now()
  });
};

/* =======================
   ORDER STATISTICS INTERFACE
======================= */

export interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  technician_assigned: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  refunded: number;
  revenue: number;
}

/* =======================
   GET ORDER STATISTICS
======================= */

export const getOrderStatistics = async (
  userId: string,
  userRole: 'customer' | 'shop_owner'
): Promise<OrderStats> => {
  const orders = await getUserOrders(userId, userRole);
  
  const stats: OrderStats = {
    total: orders.length,
    pending: 0,
    accepted: 0,
    technician_assigned: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
    revenue: 0
  };
  
  orders.forEach(order => {
    // Increment the appropriate status counter
    switch (order.status) {
      case 'pending':
        stats.pending += 1;
        break;
      case 'accepted':
        stats.accepted += 1;
        break;
      case 'technician_assigned':
        stats.technician_assigned += 1;
        break;
      case 'in_progress':
        stats.in_progress += 1;
        break;
      case 'completed':
        stats.completed += 1;
        break;
      case 'cancelled':
        stats.cancelled += 1;
        break;
      case 'refunded':
        stats.refunded += 1;
        break;
    }
    
    if (userRole === 'shop_owner' && order.status === 'completed') {
      stats.revenue += order.payment.paidAmount;
    }
  });
  
  return stats;
};

/* =======================
   GET RECENT ORDERS
======================= */

export const getRecentOrders = async (
  userId: string,
  userRole: 'customer' | 'shop_owner',
  limit: number = 10
): Promise<Order[]> => {
  const orders = await getUserOrders(userId, userRole);
  return orders.slice(0, limit);
};

/* =======================
   CANCEL ORDER
======================= */

export const cancelOrder = async (
  orderId: string,
  reason: string,
  cancelledBy: string
): Promise<void> => {
  await updateOrderStatus(
    orderId,
    'cancelled',
    `Order cancelled: ${reason}`,
    cancelledBy
  );
};

/* =======================
   COMPLETE ORDER
======================= */

export const completeOrder = async (
  orderId: string,
  completedBy: string
): Promise<void> => {
  const db = getDBOrThrow();
  
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'completed',
    'schedule.completedDate': Timestamp.now(),
    'tracking.statusUpdates': arrayUnion({
      status: 'completed',
      timestamp: Timestamp.now(),
      message: 'Order completed successfully',
      updatedBy: completedBy
    }),
    'metadata.updatedAt': Timestamp.now()
  });
};

/* =======================
   GET ORDERS BY STATUS
======================= */

export const getOrdersByStatus = async (
  userId: string,
  userRole: 'customer' | 'shop_owner',
  status: OrderStatus
): Promise<Order[]> => {
  if (isMockFirebase) {
    const field = userRole === 'customer' ? 'customerId' : 'shopId';
    return Object.values(mockOrders)
      .filter(order => order[field] === userId && order.status === status)
      .sort((a, b) => b.metadata.createdAt.toMillis() - a.metadata.createdAt.toMillis());
  }

  const db = getDBOrThrow();
  const field = userRole === 'customer' ? 'customerId' : 'shopId';
  
  const q = query(
    collection(db, 'orders'),
    where(field, '==', userId),
    where('status', '==', status),
    orderBy('metadata.createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const orders: Order[] = [];
  
  snapshot.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });
  
  return orders;
};

/* =======================
   HELPER FUNCTIONS
======================= */

// Chat system
const createOrderChat = async (orderId: string, customerId: string, shopId: string) => {
  if (isMockFirebase) return;

  const db = getDBOrThrow();
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
  console.log(`Notification: Order ${orderId} - ${status}: ${message}`);
  // TODO: Add Firebase Cloud Messaging or email implementation
};

/* =======================
   ORDER ANALYTICS
======================= */

export interface OrderAnalytics {
  totalOrders: number;
  completedOrders: number;
  cancellationRate: number;
  averageOrderValue: number;
  revenueByMonth: Record<string, number>;
  popularServices: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
}

export const getOrderAnalytics = async (
  shopId: string,
  months: number = 6
): Promise<OrderAnalytics> => {
  const orders = await getShopOrders(shopId);
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - months);
  
  const recentOrders = orders.filter(order => 
    order.metadata.createdAt.toDate() >= sixMonthsAgo
  );
  
  const analytics: OrderAnalytics = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    cancellationRate: orders.length > 0 
      ? (orders.filter(o => o.status === 'cancelled').length / orders.length) * 100 
      : 0,
    averageOrderValue: orders.length > 0
      ? orders.reduce((sum, order) => sum + order.payment.amount, 0) / orders.length
      : 0,
    revenueByMonth: {},
    popularServices: []
  };
  
  // Calculate revenue by month
  recentOrders.forEach(order => {
    const month = order.metadata.createdAt.toDate().toISOString().slice(0, 7); // YYYY-MM
    analytics.revenueByMonth[month] = (analytics.revenueByMonth[month] || 0) + order.payment.amount;
  });
  
  // Calculate popular services
  const serviceCounts: Record<string, { count: number; revenue: number }> = {};
  
  orders.forEach(order => {
    const service = order.service.category;
    if (!serviceCounts[service]) {
      serviceCounts[service] = { count: 0, revenue: 0 };
    }
    serviceCounts[service].count += 1;
    serviceCounts[service].revenue += order.payment.amount;
  });
  
  analytics.popularServices = Object.entries(serviceCounts)
    .map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return analytics;
};