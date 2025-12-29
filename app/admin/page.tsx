'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/components/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminDashboard from '@/app/components/AdminDashboard';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is admin (in real app, check from Firestore)
      // For now, we'll check email or add admin flag
      const isAdminUser = user.email?.includes('admin') || user.email === 'admin@electrohub.com';
      
      if (!isAdminUser) {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  return <AdminDashboard />;
}