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
  QueryDocumentSnapshot
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

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

// Create new shop
export const createShop = async (
  ownerId: string,
  data: ShopRegistrationData
): Promise<Shop> => {
  try {
    const shopId = `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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
    await setDoc(doc(db, 'shops', shopId), shopData);
    
    // Update user's shop data
    await setDoc(doc(db, 'users', ownerId), {
      shopData: {
        shopId,
        verificationStatus: 'pending'
      }
    }, { merge: true });
    
    return shopData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get shop by ID
export const getShop = async (shopId: string): Promise<Shop | null> => {
  const shopDoc = await getDoc(doc(db, 'shops', shopId));
  return shopDoc.exists() ? (shopDoc.data() as Shop) : null;
};

// Get shops by location (radius search)
export const getShopsNearLocation = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  category?: string,
  service?: string
): Promise<Shop[]> => {
  // Note: Firestore doesn't support native geo queries
  // We'll implement geohashing or use a third-party service
  // For now, query by city or implement client-side filtering
  
  let q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    orderBy('rating.average', 'desc'),
    limit(20)
  );
  
  if (category) {
    q = query(q, where('category', 'array-contains', category));
  }
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  
  // Filter by distance (client-side for now)
  // In production, use geohash or Algolia/Google Places
  return shops;
};

// Update shop
export const updateShop = async (shopId: string, data: Partial<Shop>): Promise<void> => {
  await updateDoc(doc(db, 'shops', shopId), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// Upload file to Firebase Storage
const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${file.name}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Search shops by query
export const searchShops = async (
  queryText: string,
  city: string,
  category?: string
): Promise<Shop[]> => {
  let q = query(
    collection(db, 'shops'),
    where('isActive', '==', true),
    where('verification.status', '==', 'verified'),
    where('address.city', '==', city.toLowerCase()),
    orderBy('rating.average', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const shops: Shop[] = [];
  
  snapshot.forEach(doc => {
    const shop = { id: doc.id, ...doc.data() } as Shop;
    
    // Client-side search (for now)
    // In production, use Algolia or Elasticsearch
    const searchableText = `${shop.shopName} ${shop.description} ${shop.services.join(' ')} ${shop.products.join(' ')}`.toLowerCase();
    
    if (searchableText.includes(queryText.toLowerCase())) {
      if (!category || shop.category.includes(category)) {
        shops.push(shop);
      }
    }
  });
  
  return shops;
};