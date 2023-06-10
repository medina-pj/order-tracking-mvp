/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 2:42:06 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '../config/firebase';
import { CategorySchema } from '../types/schema';

export interface ISaveCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory extends ISaveCategory {
  id: string;
}

const useCategory = () => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<CategorySchema[]>([]);

  useEffect(() => {
    let ref = collection(db, 'categories');
    let qry = query(ref, where('isArchived', '==', false));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
      let results: CategorySchema[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          name: doc.data()?.name,
          description: doc.data()?.description,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, []);

  const createDoc = async (payload: ISaveCategory): Promise<void> => {
    try {
      setError(null);

      const categoryPayload: CategorySchema = {
        name: payload.name,
        description: payload?.description || '',
        createdAt: moment().format(),
        updatedAt: moment().format(),
        isArchived: false,
      };

      await addDoc(collection(db, 'categories'), categoryPayload);

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, 'categories', id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().format(),
        },
        { merge: true }
      );

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  const updateDoc = async (payload: IUpdateCategory): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, 'categories', payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          description: payload.description,
          updatedAt: moment().format(),
        },
        { merge: true }
      );

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  return { error, documents, createDoc, deleteDoc, updateDoc };
};

export default useCategory;
