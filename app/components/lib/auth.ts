// lib/auth.ts
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// User types
export type UserRole = 'customer' | 'shop_owner' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  
  // Customer specific
  customerData?: {
    addresses: CustomerAddress[];
    favoriteShops: string[];
    totalOrders: number;
  };
  
  // Shop owner specific
  shopData?: {
    shopId: string;
    shopName: string;
    gstNumber: string;
    businessType: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    documents: string[];
  };
}

export interface CustomerAddress {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

// Mock data for development
const mockUsers: Record<string, AppUser> = {
  'mock-uid': {
    uid: 'mock-uid',
    email: 'admin@electrohub.com',
    displayName: 'Admin User',
    phoneNumber: '9876543210',
    photoURL: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
  },
  'mock-customer': {
    uid: 'mock-customer',
    email: 'customer@test.com',
    displayName: 'Test Customer',
    phoneNumber: '9876543211',
    photoURL: 'https://ui-avatars.com/api/?name=Test+Customer&background=random',
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
    customerData: {
      addresses: [],
      favoriteShops: [],
      totalOrders: 0
    }
  }
};

// Check if using mock Firebase
const isMockFirebase = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NODE_ENV === 'development';

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string,
  role: UserRole,
  additionalData?: any
): Promise<AppUser> => {
  try {
    if (isMockFirebase) {
      // Mock registration
      const mockUser: AppUser = {
        uid: `mock-${Date.now()}`,
        email,
        displayName,
        phoneNumber,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
      };
      
      if (role === 'customer') {
        mockUser.customerData = {
          addresses: [],
          favoriteShops: [],
          totalOrders: 0
        };
      } else if (role === 'shop_owner') {
        mockUser.shopData = {
          shopId: mockUser.uid,
          shopName: additionalData?.shopName || displayName,
          gstNumber: additionalData?.gstNumber || '',
          businessType: additionalData?.businessType || '',
          verificationStatus: 'pending',
          documents: []
        };
      }
      
      mockUsers[mockUser.uid] = mockUser;
      return mockUser;
    }

    // Real Firebase registration
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, {
      displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    const userData: AppUser = {
      uid: user.uid,
      email: user.email!,
      displayName,
      phoneNumber,
      photoURL: user.photoURL || '',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
    };
    
    // Add role-specific data
    if (role === 'customer') {
      userData.customerData = {
        addresses: [],
        favoriteShops: [],
        totalOrders: 0
      };
    } else if (role === 'shop_owner') {
      userData.shopData = {
        shopId: user.uid,
        shopName: additionalData?.shopName || displayName,
        gstNumber: additionalData?.gstNumber || '',
        businessType: additionalData?.businessType || '',
        verificationStatus: 'pending',
        documents: []
      };
    }
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return userData;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<AppUser> => {
  try {
    if (isMockFirebase) {
      // Mock login for development
      if (email === 'admin@electrohub.com' && password === 'admin123') {
        return mockUsers['mock-uid'];
      }
      if (email === 'customer@test.com' && password === 'password') {
        return mockUsers['mock-customer'];
      }
      throw new Error('Invalid credentials');
    }

    // Real Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    return userDoc.data() as AppUser;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

// Google Sign In
export const signInWithGoogle = async (role: UserRole): Promise<AppUser> => {
  try {
    if (isMockFirebase) {
      // Mock Google sign in
      const mockUser: AppUser = {
        uid: `google-mock-${Date.now()}`,
        email: 'google-user@test.com',
        displayName: 'Google User',
        phoneNumber: '',
        photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=random',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
      };
      
      if (role === 'customer') {
        mockUser.customerData = {
          addresses: [],
          favoriteShops: [],
          totalOrders: 0
        };
      }
      
      mockUsers[mockUser.uid] = mockUser;
      return mockUser;
    }

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData: AppUser = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        phoneNumber: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: user.emailVerified,
      };
      
      if (role === 'customer') {
        userData.customerData = {
          addresses: [],
          favoriteShops: [],
          totalOrders: 0
        };
      }
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    }
    
    return userDoc.data() as AppUser;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw new Error(error.message || 'Google sign in failed');
  }
};

// Logout
export const logoutUser = async (): Promise<void> => {
  try {
    if (isMockFirebase) {
      console.log('Mock logout');
      return;
    }
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  if (isMockFirebase) {
    // Mock auth state - return null for now
    callback(null);
    return () => {}; // Return cleanup function
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as AppUser);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (isMockFirebase) {
      console.log(`Mock password reset email sent to ${email}`);
      return;
    }
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Password reset failed');
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, data: Partial<AppUser>): Promise<void> => {
  try {
    if (isMockFirebase) {
      console.log(`Mock update profile for ${uid}:`, data);
      if (mockUsers[uid]) {
        mockUsers[uid] = { ...mockUsers[uid], ...data, updatedAt: new Date() };
      }
      return;
    }
    
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Update profile failed');
  }
};

// Get current user
export const getCurrentUser = (): AppUser | null => {
  if (isMockFirebase) {
    return null; // Mock implementation
  }
  
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  
  // Note: This won't have Firestore data, just Firebase Auth data
  // For complete user data, use onAuthStateChange
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    phoneNumber: firebaseUser.phoneNumber || '',
    photoURL: firebaseUser.photoURL || '',
    role: 'customer', // Default role
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    updatedAt: new Date(),
    emailVerified: firebaseUser.emailVerified,
  };
};

// Check if user is admin
export const isAdmin = (user: AppUser | null): boolean => {
  return user?.role === 'admin';
};