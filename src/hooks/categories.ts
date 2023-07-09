/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 10:48:10 am
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  doc,
  setDoc,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { CategorySchema } from '@/types/schema/product';
import constants from '@/utils/constants';

export interface ISaveCategory {
  name: string;
  sequence: number;
  description?: string;
}

export interface IUpdateCategory extends ISaveCategory {
  id: string;
}

export interface ICategory extends ISaveCategory, IUpdateCategory {
  createdAt: string;
  updatedAt: string;
}

const useCategory = () => {
  const [documents, setDocuments] = useState<ICategory[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_CATEGORIES);
    let qry = query(ref, where('isArchived', '==', false), orderBy('sequence'));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
      let results: ICategory[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          name: doc.data()?.name,
          sequence: doc.data()?.sequence,
          description: doc.data()?.description,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, []);

  const createDoc = async (payload: ISaveCategory): Promise<void> => {
    try {
      const categoryPayload: CategorySchema = {
        name: payload.name,
        sequence: payload.sequence,
        description: payload?.description || '',
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_CATEGORIES), categoryPayload);

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_CATEGORIES, id);

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

  const updateDoc = async (payload: IUpdateCategory): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_CATEGORIES, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          description: payload.description,
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

export default useCategory;
