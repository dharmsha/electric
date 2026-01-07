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

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDB } from "./firebase";

/* =======================
   TYPES
======================= */

export type UserRole = "customer" | "shop_owner" | "admin";

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

  customerData?: {
    addresses: any[];
    favoriteShops: string[];
    totalOrders: number;
  };

  shopData?: {
    shopId: string;
    shopName: string;
    gstNumber: string;
    businessType: string;
    verificationStatus: "pending" | "verified" | "rejected";
    documents: string[];
  };
}

/* =======================
   MOCK MODE
======================= */

const isMockFirebase =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NODE_ENV === "development";

const mockUsers: Record<string, AppUser> = {};

/* =======================
   HELPERS
======================= */

const getAuthOrThrow = () => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth not initialized");
  return auth;
};

const getDBOrThrow = () => {
  const db = getFirebaseDB();
  if (!db) throw new Error("Firebase DB not initialized");
  return db;
};

/* =======================
   REGISTER
======================= */

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  phoneNumber: string,
  role: UserRole,
  additionalData?: any
): Promise<AppUser> => {
  if (isMockFirebase) {
    const user: AppUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName,
      phoneNumber,
      photoURL: "",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      ...(role === "customer" ? {
        customerData: {
          addresses: [],
          favoriteShops: [],
          totalOrders: 0
        }
      } : {}),
      ...(role === "shop_owner" ? {
        shopData: {
          shopId: `shop-${Date.now()}`,
          shopName: "",
          gstNumber: "",
          businessType: "",
          verificationStatus: "pending",
          documents: []
        }
      } : {}),
      ...additionalData
    };
    mockUsers[user.uid] = user;
    return user;
  }

  const auth = getAuthOrThrow();
  const db = getDBOrThrow();

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await updateProfile(user, { displayName });
  await sendEmailVerification(user);

  const userData: AppUser = {
    uid: user.uid,
    email: user.email!,
    displayName,
    phoneNumber,
    photoURL: user.photoURL || "",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: false,
    ...(role === "customer" ? {
      customerData: {
        addresses: [],
        favoriteShops: [],
        totalOrders: 0
      }
    } : {}),
    ...(role === "shop_owner" ? {
      shopData: {
        shopId: `shop-${user.uid}`,
        shopName: "",
        gstNumber: "",
        businessType: "",
        verificationStatus: "pending",
        documents: []
      }
    } : {}),
    ...additionalData
  };

  await setDoc(doc(db, "users", user.uid), userData);
  return userData;
};

/* =======================
   LOGIN
======================= */

export const loginUser = async (
  email: string,
  password: string
): Promise<AppUser> => {
  if (isMockFirebase) {
    const mockUser = Object.values(mockUsers).find(u => u.email === email);
    if (mockUser) return mockUser;
    throw new Error("Invalid credentials");
  }

  const auth = getAuthOrThrow();
  const db = getDBOrThrow();

  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));

  if (!snap.exists()) throw new Error("User not found");
  return snap.data() as AppUser;
};

/* =======================
   GOOGLE LOGIN
======================= */

export const signInWithGoogle = async (
  role: UserRole
): Promise<AppUser> => {
  if (isMockFirebase) {
    const mockUser: AppUser = {
      uid: `google-mock-${Date.now()}`,
      email: `mock${Date.now()}@gmail.com`,
      displayName: "Mock User",
      phoneNumber: "",
      photoURL: "",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true
    };
    mockUsers[mockUser.uid] = mockUser;
    return mockUser;
  }

  const auth = getAuthOrThrow();
  const db = getDBOrThrow();

  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data() as AppUser;

  const newUser: AppUser = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || "",
    phoneNumber: "",
    photoURL: user.photoURL || "",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: user.emailVerified,
    ...(role === "customer" ? {
      customerData: {
        addresses: [],
        favoriteShops: [],
        totalOrders: 0
      }
    } : {}),
    ...(role === "shop_owner" ? {
      shopData: {
        shopId: `shop-${user.uid}`,
        shopName: "",
        gstNumber: "",
        businessType: "",
        verificationStatus: "pending",
        documents: []
      }
    } : {})
  };

  await setDoc(ref, newUser);
  return newUser;
};

/* =======================
   LOGOUT
======================= */

export const logoutUser = async (): Promise<void> => {
  if (isMockFirebase) {
    return;
  }

  const auth = getAuthOrThrow();
  await signOut(auth);
};

/* =======================
   AUTH STATE
======================= */

export const onAuthStateChange = (
  callback: (user: AppUser | null) => void
) => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();

  if (isMockFirebase) {
    // Mock implementation
    const mockUser = Object.values(mockUsers)[0] || null;
    callback(mockUser);
    return () => {};
  }

  if (!auth || !db) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      callback(snap.exists() ? (snap.data() as AppUser) : null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      callback(null);
    }
  });
};

/* =======================
   RESET PASSWORD
======================= */

export const resetPassword = async (email: string): Promise<void> => {
  if (isMockFirebase) {
    console.log(`Password reset email sent to: ${email} (mock)`);
    return;
  }

  const auth = getAuthOrThrow();
  await sendPasswordResetEmail(auth, email);
};

/* =======================
   UPDATE PROFILE
======================= */

export const updateUserProfile = async (
  uid: string,
  data: Partial<AppUser>
): Promise<void> => {
  if (isMockFirebase) {
    if (mockUsers[uid]) {
      mockUsers[uid] = {
        ...mockUsers[uid],
        ...data,
        updatedAt: new Date()
      };
    }
    return;
  }

  const db = getDBOrThrow();
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date()
  });
};

/* =======================
   GET CURRENT USER
======================= */

export const getCurrentUser = async (): Promise<AppUser | null> => {
  if (isMockFirebase) {
    return Object.values(mockUsers)[0] || null;
  }

  const auth = getFirebaseAuth();
  const db = getFirebaseDB();
  
  if (!auth || !db) return null;
  
  const user = auth.currentUser;
  if (!user) return null;
  
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
};

/* =======================
   ADMIN CHECK
======================= */

export const isAdmin = (user: AppUser | null): boolean =>
  user?.role === "admin";

/* =======================
   CUSTOMER CHECK
======================= */

export const isCustomer = (user: AppUser | null): boolean =>
  user?.role === "customer";

/* =======================
   SHOP OWNER CHECK
======================= */

export const isShopOwner = (user: AppUser | null): boolean =>
  user?.role === "shop_owner";

/* =======================
   GET USER BY ID
======================= */

export const getUserById = async (uid: string): Promise<AppUser | null> => {
  if (isMockFirebase) {
    return mockUsers[uid] || null;
  }

  const db = getDBOrThrow();
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
};