'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 6th 2023, 11:41:02 pm
 * ---------------------------------------------
 */

import useAuth from '@/hooks/auth';
import Loader from '@/components/Loader';
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
    // Redirect to the login page if the user is not authenticated
    if (!user) router.replace('/');
    // Redirect to the dashboard if the user is authenticated
    else if (path === '/' || path === '') router.push('/dashboard');
  }, [user, loading, path]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return children;
}
