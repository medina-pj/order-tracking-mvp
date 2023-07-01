/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 7:45:56 am
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { ProductSchema } from '@/types/schema';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';

export interface ISaveProduct {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  note?: string;
}

export interface IUpdateProduct extends ISaveProduct {
  id: string;
  isAvailable: boolean;
}

export interface IProduct extends ISaveProduct, IUpdateProduct {
  productCode: string;
  createdAt: string;
  updatedAt: string;
}

const useProduct = () => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<IProduct[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_PRODUCTS);
    let qry = query(ref, where('isArchived', '==', false));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
      let results: IProduct[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          productCode: doc.data().productCode,
          name: doc.data().name,
          price: doc.data().price,
          categoryId: doc.data().categoryId,
          description: doc.data().description,
          note: doc.data().note,
          isAvailable: doc.data().isAvailable,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, []);

  const createDoc = async (payload: ISaveProduct): Promise<void> => {
    try {
      setError(null);

      const productPayload: ProductSchema = {
        productCode: generateNanoId(5),
        name: payload.name,
        price: payload.price,
        categoryId: payload.categoryId,
        description: payload?.description || '',
        note: payload?.note || '',
        isAvailable: true,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_PRODUCTS), productPayload);

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_PRODUCTS, id);

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

  const updateDoc = async (payload: IUpdateProduct): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_PRODUCTS, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          price: payload.price,
          categoryId: payload.categoryId,
          description: payload.description,
          note: payload.note,
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

  return { error, documents, createDoc, deleteDoc, updateDoc };
};

export default useProduct;
