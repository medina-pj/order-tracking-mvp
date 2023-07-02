'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 2nd 2023, 5:59:19 pm
 * ---------------------------------------------
 */

import useAuth from '@/hooks/auth';
import { useRouter, usePathname } from 'next/navigation';

import { useEffect } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

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
      if (path === '/' || path === '') router.push('/dashboard');
      else router.push(path);
    }
  }, [user, loading, router, path]);

  if (loading) {
    return <div>LOADING...</div>;
  }

  return children;
}
