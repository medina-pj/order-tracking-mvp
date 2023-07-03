/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 3rd 2023, 9:52:31 pm
 * ---------------------------------------------
 */

import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { auth, db } from '@/config/firebase';
import constants from '@/utils/constants';
import { useEffect, useState } from 'react';
import { UserSchema } from '@/types/schema/user';

const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState<UserSchema | null>(null);

  useEffect(() => {
    (async function () {
      if (user && !userInfo) {
        await fetchUserInfo(user.uid);
      }
    })();
  }, [user, userInfo]);

  const fetchUserInfo = async (authId: string): Promise<void> => {
    try {
      // get account details
      const ref = collection(db, constants.DB_ADMINS);
      const q = query(ref, where('authId', '==', authId), where('isArchived', '==', false));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        throw new Error('No account details found.');
      }

      const account = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      setUserInfo({
        ...(account[0] as UserSchema),
      });
    } catch (err: any) {
      throw err;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // signin using firebase auth
      const { user } = await signInWithEmailAndPassword(auth, username, password);

      if (!user) {
        throw new Error('Invalid username/password.');
      }

      await fetchUserInfo(user.uid);
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserInfo(null);
    } catch (err: any) {
      throw err;
    }
  };

  return { login, logout, loading, user, userInfo };
};

export default useAuth;
