/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 10:56:52 pm
 * ---------------------------------------------
 */

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, query, where, addDoc, onSnapshot, doc, setDoc, documentId } from 'firebase/firestore';

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db, firebaseConfig, initializeApp } from '@/config/firebase';
import constants from '@/utils/constants';
import { useEffect, useState } from 'react';
import { UserSchema } from '@/types/schema/user';
import useAuth from './auth';
import { deleteApp } from 'firebase/app';

export interface ICreateAccount {
  username: string;
  password: string;
  name: string;
  contactNumber: string;
  userType?: string;
}

export interface IUpdateAccount {
  id: string;
  name: string;
  contactNumber: string;
  userType: string;
}

const useAdminAccount = () => {
  const { userInfo } = useAuth();
  const [documents, setDocuments] = useState<UserSchema[]>([]);

  useEffect(() => {
    if (userInfo !== null && userInfo?.userType === 'admin') {
      let ref = collection(db, constants.DB_ADMINS);
      let qry = query(ref, where('isArchived', '==', false), where(documentId(), '!=', userInfo.id));

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
    }
  }, [userInfo]);

  const createAccount = async (payload: ICreateAccount): Promise<void> => {
    try {
      if (userInfo !== null && userInfo?.userType === 'admin') {
        //initialize new app reference
        const appRef = initializeApp(firebaseConfig, 'Secondary');
        const authRef = getAuth(appRef);

        // create firebase auth account
        const { user: createdUser } = await createUserWithEmailAndPassword(
          authRef,
          payload.username,
          payload.password
        );

        if (!createdUser) {
          throw new Error('Failed to create account.');
        }

        // save account details in firestore
        const accountPayload = {
          authId: createdUser.uid,
          username: payload.username,
          name: payload.name,
          contactNumber: payload.contactNumber,
          userType: payload.userType || 'staff',
          isArchived: false,
          createdBy: userInfo.id,
          createdAt: moment().toDate().getTime(),
          updatedAt: moment().toDate().getTime(),
        };

        await addDoc(collection(db, constants.DB_ADMINS), accountPayload);
        await deleteApp(appRef);
      } else {
        throw new Error('Only admins can create an account.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const updateAccount = async (payload: IUpdateAccount): Promise<void> => {
    try {
      if (userInfo !== null && userInfo?.userType === 'admin') {
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
      } else {
        throw new Error('Only admins can update an account.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const deleteAccount = async (id: string): Promise<void> => {
    try {
      if (userInfo !== null && userInfo?.userType === 'admin') {
        const docRef = doc(db, constants.DB_ADMINS, id);

        await setDoc(
          docRef,
          {
            isArchived: true,
            updatedAt: moment().toDate().getTime(),
          },
          { merge: true }
        );
      } else {
        throw new Error('Only admins can update an account.');
      }
    } catch (err: any) {
      throw err;
    }
  };

  return { createAccount, updateAccount, deleteAccount, documents };
};

export default useAdminAccount;
