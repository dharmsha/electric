'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/app/components/lib/firebase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase not initialized');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user: User = userCredential.user;

      // 🔐 Admin check (temporary logic)
      const isAdmin =
        user.email?.includes('admin') ||
        user.email === 'admin@electrohub.com';

      if (isAdmin) {
        router.push('/admin');
      } else {
        await auth.signOut();
        setError('Access denied. Admin only.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}
