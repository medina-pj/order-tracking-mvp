/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 1st 2023, 5:54:38 pm
 * ---------------------------------------------
 */

import { useAuthState } from 'react-firebase-hooks/auth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { auth, db } from '@/config/firebase';
import constants from '@/utils/constants';
import { useState } from 'react';

export interface IAdminSignUp {
  username: string;
  password: string;
  name: string;
  contactNumber: string;
  userType?: 'admin' | 'staff';
}

const useAuth = () => {
  const [user, loading] = useAuthState(auth);

  console.log({
    loading,
    user,
  });

  const signUp = async (payload: IAdminSignUp) => {
    try {
      // setError(null);

      console.log(payload);

      // create firebase auth account
      const { user } = await createUserWithEmailAndPassword(
        auth,
        payload.username,
        payload.password
      );

      // save account details
      const accountPayload = {
        authUID: user.uid,
        username: payload.username,
        passsword: payload.password,
        name: payload.name,
        contactNumber: payload.contactNumber,
        userType: payload.userType || 'staff',
        isArchived: false,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      };

      const createAccount = await addDoc(collection(db, constants.DB_ADMINS), accountPayload);

      return {
        auth: user,
        account: {
          id: createAccount.id,
          ...accountPayload,
        },
      };
    } catch (err: any) {
      console.log(err);
      // setError(err.message);
    }
  };

  return { signUp };
};

export default useAuth;
