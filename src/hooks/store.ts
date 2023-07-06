/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 6th 2023, 11:24:10 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '../config/firebase';
import { StoreSchema } from '../types/schema/store';
import constants from '@/utils/constants';

export interface ISaveStore {
  name: string;
  location?: string;
  contactNumber?: string;
  staff?: string[];
}

export interface IUpdateStore extends ISaveStore {
  id: string;
}

export interface IStore extends ISaveStore, IUpdateStore {
  createdAt: string;
  updatedAt: string;
}

const useStore = () => {
  const [documents, setDocuments] = useState<IStore[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_STORE);
    let qry = query(ref, where('isArchived', '==', false));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
      let results: IStore[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          name: doc.data()?.name,
          location: doc.data()?.location,
          contactNumber: doc.data()?.contactNumber,
          staff: doc.data()?.staff,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, []);

  const createDoc = async (payload: ISaveStore): Promise<void> => {
    try {
      const storePayload: StoreSchema = {
        name: payload.name,
        location: payload?.location || '',
        contactNumber: payload?.contactNumber || '',
        staff: payload?.staff || [],
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_STORE), storePayload);

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_STORE, id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const updateDoc = async (payload: IUpdateStore): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_STORE, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          location: payload.location,
          contactNumber: payload.contactNumber,
          staff: payload.staff,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  return { documents, createDoc, deleteDoc, updateDoc };
};

export default useStore;
