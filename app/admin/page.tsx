'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/app/components/lib/firebase';
import AdminDashboard from '@/app/components/AdminDashboard';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        if (!user) {
          setIsLoading(false);
          router.push('/login');
          return;
        }

        const isAdminUser =
          user.email?.includes('admin') ||
          user.email === 'admin@electrohub.com';

        if (!isAdminUser) {
          setIsLoading(false);
          router.push('/');
          return;
        }

        setIsAdmin(true);
        setIsLoading(false);
      }
    );

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
