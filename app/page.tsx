'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './lib/auth-context';

export default function Home() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (currentUser) {
      if (currentUser.isFirstLogin) {
        router.replace('/change-password');
      } else {
        router.replace('/dashboard');
      }
    } else {
      router.replace('/login');
    }
  }, [currentUser, loading, router]);

  return (
    <div className="page-redirect">
      <div className="spinner spinner-dark" />
    </div>
  );
}
