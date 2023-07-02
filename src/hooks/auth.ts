/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 8:54:23 am
 * ---------------------------------------------
 */

import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { auth, db } from '@/config/firebase';
import constants from '@/utils/constants';
import { useEffect, useState } from 'react';
import { UserSchema } from '@/types/schema/user';

export interface IAdminSignUp {
  username: string;
  password: string;
  name: string;
  contactNumber: string;
  userType?: 'admin' | 'staff';
}

const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserSchema | null>(null);

  useEffect(() => {
    (async function () {
      if (user && !userInfo) {
        await fetchUserInfo(user.uid);
      }
    })();
  }, [user, userInfo]);

  const fetchUserInfo = async (authId: string) => {
    try {
      setError(null);

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
      setError(err.message);
    }
  };

  const signup = async (payload: IAdminSignUp) => {
    try {
      setError(null);

      // create firebase auth account
      const { user } = await createUserWithEmailAndPassword(auth, payload.username, payload.password);

      if (!user) {
        throw new Error('Failed to create account.');
      }

      // save account details
      const accountPayload = {
        authId: user.uid,
        username: payload.username,
        name: payload.name,
        contactNumber: payload.contactNumber,
        userType: payload.userType || 'staff',
        isArchived: false,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      };

      await addDoc(collection(db, constants.DB_ADMINS), accountPayload);

      await fetchUserInfo(user.uid);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setError(null);

      // signin using firebase auth
      const { user } = await signInWithEmailAndPassword(auth, username, password);

      if (!user) {
        throw new Error('Invalid username/password.');
      }

      await fetchUserInfo(user.uid);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserInfo(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { signup, login, logout, error, loading, user };
};

export default useAuth;
