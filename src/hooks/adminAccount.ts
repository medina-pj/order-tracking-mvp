/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 12:01:33 pm
 * ---------------------------------------------
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, addDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';

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

export interface IAdminUpdate {
  id: string;
  name: string;
  contactNumber: string;
  userType: 'admin' | 'staff';
}

const useAdminAccount = (user: UserSchema) => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<UserSchema[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_ADMINS);
    let qry = query(ref, where('isArchived', '==', false), where('id', '!=', user.id));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
      let results: UserSchema[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          authId: doc.data().authId,
          username: doc.data().username,
          name: doc.data()?.name,
          contactNumber: doc.data()?.contactNumber,
          userType: doc.data().userType,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, [user.id]);

  const create = async (payload: IAdminSignUp): Promise<void> => {
    try {
      setError(null);

      // create firebase auth account
      const { user: createdUser } = await createUserWithEmailAndPassword(
        auth,
        payload.username,
        payload.password
      );

      if (!createdUser) {
        throw new Error('Failed to create account.');
      }

      // save account details
      const accountPayload = {
        authId: createdUser.uid,
        username: payload.username,
        name: payload.name,
        contactNumber: payload.contactNumber,
        userType: payload.userType || 'staff',
        isArchived: false,
        createdBy: user.id,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      };

      await addDoc(collection(db, constants.DB_ADMINS), accountPayload);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const update = async (payload: IAdminUpdate): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_ADMINS, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          contactNumber: payload.contactNumber,
          userType: payload.userType,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_ADMINS, id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  return { create, update, deleteDoc, documents, error };
};

export default useAdminAccount;
