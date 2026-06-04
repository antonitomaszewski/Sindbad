'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../../../logic/lib/users';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      await logoutUser();
      router.push('/'); // ← Zmienione z '/logowanie' na '/'
      router.refresh();
    }

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-main mb-4"></div>
        <p className="text-gray-600 text-lg">Wylogowywanie...</p>
      </div>
    </div>
  );
}