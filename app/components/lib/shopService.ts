import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  GeoPoint,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  increment
} from "firebase/firestore";
import { getFirebaseDB, getFirebaseStorage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Shop {
  id: string;
  ownerId: string;
  shopName: string;
  description: string;
  category: string[]; // ['mobile_repair', 'electronics_store', 'ac_service']
  services: string[]; // Specific services offered
  products: string[]; // Products sold
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    location: GeoPoint; // For geolocation queries
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  businessHours: {
    [key: string]: { // Day: 'monday', 'tuesday'
      open: string; // '09:00'
      close: string; // '21:00'
      isOpen: boolean;
    };
  };
  facilities: string[]; // ['home_service', 'pickup_drop', 'warranty', 'emergency']
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    verifiedAt: Timestamp | null;
    verifiedBy: string;
    documents: string[]; // URLs to uploaded documents
  };
  rating: {
    average: number;
    totalReviews: number;
    breakdown: {
      [key: number]: number; // 1-5 stars count
    };
  };
  images: string[]; // Shop photos URLs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  metadata: {
    totalBookings: number;
    totalSales: number;
    responseTime: number; // in minutes
    completionRate: number; // percentage
  };
}

export interface ShopRegistrationData {
  shopName: string;
  description: string;
  category: string[];
  services: string[];
  products: string[];
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  facilities: string[];
  documents: File[]; // GST, license, etc.
  images: File[]; // Shop photos
}

/* =======================
   HELPERS
======================= */

const getDBOrThrow = () => {
  const db = getFirebaseDB();
  if (!db) throw new Error("Firebase DB not initialized");
  return db;
};

const getStorageOrThrow = () => {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage not initialized");
  return storage;
};

// Mock mode for development
const isMockFirebase =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NODE_ENV === "development";

const mockShops: Record<string, Shop> = {};

/* =======================
   CREATE SHOP
======================= */

export const createShop = async (
  ownerId: string,
  data: ShopRegistrationData
): Promise<Shop> => {
  try {
    const shopId = `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (isMockFirebase) {
      const shopData: Shop = {
        id: shopId,
        ownerId,
        shopName: data.shopName,
        description: data.description,
        category: data.category,
        services: data.services,
        products: data.products,
        address: {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          pincode: data.address.pincode,
          landmark: data.address.landmark,
          location: new GeoPoint(data.address.lat, data.address.lng)
        },
        contact: data.contact,
        businessHours: data.businessHours,
        facilities: data.facilities,
        verification: {
          status: 'pending',
          verifiedAt: null,
          verifiedBy: '',
          documents: data.documents.map((_, i) => `mock-doc-url-${i}`)
        },
        rating: {
          average: 0,
          totalReviews: 0,
          breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        images: data.images.map((_, i) => `mock-image-url-${i}`),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: false, // Activate after verification
        metadata: {
          totalBookings: 0,
          totalSales: 0,
          responseTime: 0,
          completionRate: 0
        }
      };
      
      mockShops[shopId] = shopData;
      return shopData;
    }

    // Upload documents
    const documentUrls: string[] = [];
    for (const file of data.documents) {
      const documentUrl = await uploadFile(file, `shops/${shopId}/documents`);
      documentUrls.push(documentUrl);
    }
    
    // Upload images
    const imageUrls: string[] = [];
    for (const file of data.images) {
      const imageUrl = await uploadFile(file, `shops/${shopId}/images`);
      imageUrls.push(imageUrl);
    }
    
    // Create shop data
    const shopData: Shop = {
      id: shopId,
      ownerId,
      shopName: data.shopName,
      description: data.description,
      category: data.category,
      services: data.services,
      products: data.products,
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        pincode: data.address.pincode,
        landmark: data.address.landmark,
        location: new GeoPoint(data.address.lat, data.address.lng)
      },
      contact: data.contact,
      businessHours: data.businessHours,
      facilities: data.facilities,
      verification: {
        status: 'pending',
        verifiedAt: null,
        verifiedBy: '',
        documents: documentUrls
      },
      rating: {
        average: 0,
        totalReviews: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      },
      images: imageUrls,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: false, // Activate after verification
      metadata: {
        totalBookings: 0,
        totalSales: 0,
        responseTime: 0,
        completionRate: 0
      }
    };
    
    // Save to Firestore
    const db = getDBOrThrow();
    await setDoc(doc(db, 'shops', shopId), shopData);
    
    // Update user's shop data
    await setDoc(doc(db, 'users', ownerId), {
      shopData: {
        shopId,
        shopName: data.shopName,
        verificationStatus: 'pending'
      }
    }, { merge: true });
    
    return shopData;
  } catch (error: any) {
    throw new Error(`Failed to create shop: ${error.message}`);
  }
};

/* =======================
   GET SHOP BY ID
======================= */

export const getShop = async (shopId: string): Promise<Shop | null> => {
  if (isMockFirebase) {
    return mockShops[shopId] || null;
  }

  const db = getDBOrThrow();
  const shopDoc = await getDoc(doc(db, 'shops', shopId));
  return shopDoc.exists() ? (shopDoc.data() as Shop) : null;
};

/* =======================
   GET SHOPS BY OWNER
======================= */

export const getShopsByOwner = async (ownerId: string): Promise<Shop[]> => {
  if (isMockFirebase) {
    return Object.values(mockShops).filter(shop => shop.ownerId === ownerId);
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return shops;
};

/* =======================
   GET SHOPS BY LOCATION
======================= */

export const getShopsNearLocation = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  category?: string,
  service?: string
): Promise<Shop[]> => {
  if (isMockFirebase) {
    let shops = Object.values(mockShops).filter(shop => 
      shop.isActive && shop.verification.status === 'verified'
    );
    
    if (category) {
      shops = shops.filter(shop => shop.category.includes(category));
    }
    
    return shops.sort((a, b) => b.rating.average - a.rating.average).slice(0, 20);
  }

  const db = getDBOrThrow();
  let q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    orderBy('rating.average', 'desc'),
    limit(20)
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  // Filter by category and service
  let filteredShops = shops;
  if (category) {
    filteredShops = filteredShops.filter(shop => shop.category.includes(category));
  }
  if (service) {
    filteredShops = filteredShops.filter(shop => shop.services.includes(service));
  }
  
  return filteredShops;
};

/* =======================
   UPDATE SHOP
======================= */

export const updateShop = async (shopId: string, data: Partial<Shop>): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId] = {
        ...mockShops[shopId],
        ...data,
        updatedAt: Timestamp.now()
      };
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, 'shops', shopId), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

/* =======================
   DELETE SHOP
======================= */

export const deleteShop = async (shopId: string): Promise<void> => {
  if (isMockFirebase) {
    delete mockShops[shopId];
    return;
  }

  const db = getDBOrThrow();
  await deleteDoc(doc(db, 'shops', shopId));
};

/* =======================
   VERIFY SHOP (ADMIN) - FIXED
======================= */

export const verifyShop = async (
  shopId: string, 
  status: 'verified' | 'rejected', 
  verifiedBy: string,
  comments?: string
): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].verification.status = status;
      mockShops[shopId].verification.verifiedAt = Timestamp.now();
      mockShops[shopId].verification.verifiedBy = verifiedBy;
      mockShops[shopId].isActive = status === 'verified';
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  
  // Update shop document
  await updateDoc(doc(db, 'shops', shopId), {
    'verification.status': status,
    'verification.verifiedAt': Timestamp.now(),
    'verification.verifiedBy': verifiedBy,
    isActive: status === 'verified',
    updatedAt: Timestamp.now()
  });
  
  // Update user's shop data - FIXED: Proper nested update
  const shop = await getShop(shopId);
  if (shop) {
    // Get current user data first
    const userRef = doc(db, 'users', shop.ownerId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentShopData = userData.shopData || {};
      
      // Update shopData with new verification status
      const updatedShopData = {
        ...currentShopData,
        verificationStatus: status
      };
      
      // Update the entire shopData object
      await updateDoc(userRef, {
        shopData: updatedShopData
      });
    }
  }
};

/* =======================
   SEARCH SHOPS
======================= */

export const searchShops = async (
  queryText: string,
  city: string,
  category?: string
): Promise<Shop[]> => {
  if (isMockFirebase) {
    let shops = Object.values(mockShops).filter(shop => 
      shop.isActive && 
      shop.verification.status === 'verified' &&
      shop.address.city.toLowerCase().includes(city.toLowerCase())
    );
    
    if (queryText) {
      shops = shops.filter(shop => 
        shop.shopName.toLowerCase().includes(queryText.toLowerCase()) ||
        shop.description.toLowerCase().includes(queryText.toLowerCase()) ||
        shop.services.some(service => service.toLowerCase().includes(queryText.toLowerCase())) ||
        shop.products.some(product => product.toLowerCase().includes(queryText.toLowerCase()))
      );
    }
    
    if (category) {
      shops = shops.filter(shop => shop.category.includes(category));
    }
    
    return shops.sort((a, b) => b.rating.average - a.rating.average);
  }

  const db = getDBOrThrow();
  let q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    orderBy('rating.average', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    const shop = { id: doc.id, ...doc.data() } as Shop;
    
    // Filter by city
    if (shop.address.city.toLowerCase() !== city.toLowerCase()) {
      return;
    }
    
    // Client-side search
    if (queryText) {
      const searchableText = `${shop.shopName} ${shop.description} ${shop.services.join(' ')} ${shop.products.join(' ')}`.toLowerCase();
      if (!searchableText.includes(queryText.toLowerCase())) {
        return;
      }
    }
    
    if (!category || shop.category.includes(category)) {
      shops.push(shop);
    }
  });
  
  return shops;
};

/* =======================
   GET FEATURED SHOPS
======================= */

export const getFeaturedShops = async (limitCount: number = 10): Promise<Shop[]> => {
  if (isMockFirebase) {
    const shops = Object.values(mockShops).filter(shop => 
      shop.isActive && shop.verification.status === 'verified'
    );
    return shops
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limitCount);
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    orderBy('rating.average', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return shops;
};

/* =======================
   UPDATE SHOP RATING - FIXED
======================= */

export const updateShopRating = async (
  shopId: string,
  newRating: number // 1-5
): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      const shop = mockShops[shopId];
      const breakdown = { ...shop.rating.breakdown };
      breakdown[newRating] = (breakdown[newRating] || 0) + 1;
      
      const totalReviews = shop.rating.totalReviews + 1;
      const totalStars = Object.entries(breakdown).reduce((sum, [stars, count]) => 
        sum + (parseInt(stars) * count), 0
      );
      const average = totalStars / totalReviews;
      
      mockShops[shopId].rating = {
        average,
        totalReviews,
        breakdown
      };
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  const shop = await getShop(shopId);
  
  if (!shop) throw new Error('Shop not found');
  
  const breakdown = { ...shop.rating.breakdown };
  breakdown[newRating] = (breakdown[newRating] || 0) + 1;
  
  const totalReviews = shop.rating.totalReviews + 1;
  const totalStars = Object.entries(breakdown).reduce((sum, [stars, count]) => 
    sum + (parseInt(stars) * count), 0
  );
  const average = parseFloat((totalStars / totalReviews).toFixed(1));
  
  // FIXED: Use separate update object
  const updateData: Record<string, any> = {
    'rating.average': average,
    'rating.totalReviews': totalReviews,
    updatedAt: Timestamp.now()
  };
  
  // Add breakdown update
  updateData[`rating.breakdown.${newRating}`] = breakdown[newRating];
  
  await updateDoc(doc(db, 'shops', shopId), updateData);
};

/* =======================
   UPLOAD FILE
======================= */

const uploadFile = async (file: File, path: string): Promise<string> => {
  if (isMockFirebase) {
    return `mock-${path}/${file.name}_${Date.now()}`;
  }

  const storage = getStorageOrThrow();
  const storageRef = ref(storage, `${path}/${file.name}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/* =======================
   GET PENDING VERIFICATION SHOPS (ADMIN)
======================= */

export const getPendingVerificationShops = async (): Promise<Shop[]> => {
  if (isMockFirebase) {
    return Object.values(mockShops).filter(shop => 
      shop.verification.status === 'pending'
    );
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('verification.status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return shops;
};

/* =======================
   GET SHOPS BY CATEGORY
======================= */

export const getShopsByCategory = async (
  category: string,
  limitCount: number = 20
): Promise<Shop[]> => {
  if (isMockFirebase) {
    const shops = Object.values(mockShops).filter(shop => 
      shop.isActive && 
      shop.verification.status === 'verified' &&
      shop.category.includes(category)
    );
    return shops
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limitCount);
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    where('category', 'array-contains', category),
    orderBy('rating.average', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return shops;
};

/* =======================
   UPDATE SHOP METADATA - FIXED
======================= */

export const updateShopMetadata = async (
  shopId: string,
  metadata: Partial<Shop['metadata']>
): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].metadata = {
        ...mockShops[shopId].metadata,
        ...metadata
      };
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  
  // Build update object properly
  const updateData: Record<string, any> = {
    updatedAt: Timestamp.now()
  };
  
  // Add metadata fields with dot notation
  Object.entries(metadata).forEach(([key, value]) => {
    updateData[`metadata.${key}`] = value;
  });
  
  await updateDoc(doc(db, 'shops', shopId), updateData);
};

/* =======================
   GET SHOP STATISTICS
======================= */

export interface ShopStatistics {
  totalShops: number;
  activeShops: number;
  pendingVerification: number;
  verifiedShops: number;
  averageRating: number;
  totalBookings: number;
}

export const getShopStatistics = async (): Promise<ShopStatistics> => {
  if (isMockFirebase) {
    const shops = Object.values(mockShops);
    return {
      totalShops: shops.length,
      activeShops: shops.filter(s => s.isActive).length,
      pendingVerification: shops.filter(s => s.verification.status === 'pending').length,
      verifiedShops: shops.filter(s => s.verification.status === 'verified').length,
      averageRating: shops.length > 0 
        ? shops.reduce((sum, shop) => sum + shop.rating.average, 0) / shops.length 
        : 0,
      totalBookings: shops.reduce((sum, shop) => sum + shop.metadata.totalBookings, 0)
    };
  }

  const db = getDBOrThrow();
  const shopsSnapshot = await getDocs(collection(db, 'shops'));
  
  const shops: Shop[] = [];
  shopsSnapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return {
    totalShops: shops.length,
    activeShops: shops.filter(s => s.isActive).length,
    pendingVerification: shops.filter(s => s.verification.status === 'pending').length,
    verifiedShops: shops.filter(s => s.verification.status === 'verified').length,
    averageRating: shops.length > 0 
      ? parseFloat((shops.reduce((sum, shop) => sum + shop.rating.average, 0) / shops.length).toFixed(1))
      : 0,
    totalBookings: shops.reduce((sum, shop) => sum + shop.metadata.totalBookings, 0)
  };
};

/* =======================
   ADDITIONAL FUNCTIONS
======================= */

// Get shops with pagination
export const getShopsWithPagination = async (
  lastDoc: QueryDocumentSnapshot | null = null,
  limitCount: number = 10
): Promise<{ shops: Shop[]; lastDoc: QueryDocumentSnapshot | null }> => {
  if (isMockFirebase) {
    const shops = Object.values(mockShops)
      .filter(shop => shop.isActive && shop.verification.status === 'verified')
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, limitCount);
    
    return { shops, lastDoc: null };
  }

  const db = getDBOrThrow();
  let q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    orderBy('rating.average', 'desc'),
    limit(limitCount)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  
  return { shops, lastDoc: newLastDoc };
};

// Update shop facilities
export const updateShopFacilities = async (
  shopId: string,
  facilities: string[]
): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].facilities = facilities;
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, 'shops', shopId), {
    facilities,
    updatedAt: Timestamp.now()
  });
};

// Update shop business hours
export const updateBusinessHours = async (
  shopId: string,
  businessHours: Shop['businessHours']
): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].businessHours = businessHours;
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, 'shops', shopId), {
    businessHours,
    updatedAt: Timestamp.now()
  });
};

// Check if shop name is available
export const isShopNameAvailable = async (shopName: string): Promise<boolean> => {
  if (isMockFirebase) {
    return !Object.values(mockShops).some(shop => 
      shop.shopName.toLowerCase() === shopName.toLowerCase()
    );
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('shopName', '==', shopName)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.empty;
};

// Increment shop bookings count
export const incrementShopBookings = async (shopId: string): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].metadata.totalBookings += 1;
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, 'shops', shopId), {
    'metadata.totalBookings': increment(1),
    updatedAt: Timestamp.now()
  });
};

// Get shops by service
export const getShopsByService = async (service: string): Promise<Shop[]> => {
  if (isMockFirebase) {
    return Object.values(mockShops).filter(shop => 
      shop.isActive && 
      shop.verification.status === 'verified' &&
      shop.services.includes(service)
    );
  }

  const db = getDBOrThrow();
  const q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    where('services', 'array-contains', service),
    orderBy('rating.average', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  return shops;
};

// Toggle shop active status
export const toggleShopStatus = async (shopId: string, isActive: boolean): Promise<void> => {
  if (isMockFirebase) {
    if (mockShops[shopId]) {
      mockShops[shopId].isActive = isActive;
      mockShops[shopId].updatedAt = Timestamp.now();
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, 'shops', shopId), {
    isActive,
    updatedAt: Timestamp.now()
  });
};