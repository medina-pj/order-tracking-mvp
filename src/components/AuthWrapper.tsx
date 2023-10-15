'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: October 15th 2023, 1:20:25 pm
 * ---------------------------------------------
 */

import useAuth from '@/hooks/auth';
import Loader from '@/components/Loader';
import { useRouter, usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { UserTypes } from '@/types/schema/user';

const adminRoutes = ['accounts', 'stores', 'category'];
const exceptionRoutes = ['tables'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, userInfo } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const path = usePathname();

  console.log({
    userInfo,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
      setCheckingAuth(false);
    } else if (!loading && userInfo) {
      const currentPath = path.split('/');

      // Redirect to the login page if the user is not authenticated
      if (!userInfo) {
        router.replace('/');
      }

      // Redirect to the dashboard if the user is accessing unauthorized routes
      else if (
        userInfo &&
        userInfo.userType !== UserTypes.ADMIN &&
        adminRoutes.includes(currentPath[1]) &&
        !exceptionRoutes.includes(currentPath[2])
      ) {
        router.push('/dashboard');
      }

      // Redirect to the dashboard if the user is authenticated
      else if (path === '/' || path === '') {
        router.push('/dashboard');
      }

      // Render component if authentication is done
      else {
        setCheckingAuth(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, userInfo, path]);

  if (checkingAuth) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return children;
}
