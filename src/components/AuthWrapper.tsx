'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 9:05:30 am
 * ---------------------------------------------
 */

import useAuth from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      // Handle the loading state if needed
      return;
    }

    if (!user) {
      // Redirect to the login page if the user is not authenticated
      router.replace('/');
    } else {
      // Redirect to the dashboard if the user is authenticated
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>LOADING...</div>;
  }

  return children;
}
