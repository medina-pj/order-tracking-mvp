/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 1:39:34 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { ProductSchema } from '@/types/schema/product';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';
import useCategory, { ICategory } from './categories';

export interface ISaveProduct {
  name: string;
  categoryId: string;
  addOns?: string[];
  description?: string;
}

export interface IUpdateProduct extends ISaveProduct {
  id: string;
}

export interface IProduct {
  id: string;
  productCode: string;
  name: string;
  description?: string;
  category: {
    id?: string;
    name?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const useProduct = () => {
  const { documents: categories } = useCategory();
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<IProduct[]>([]);

  useEffect(() => {
    if (categories.length) {
      let ref = collection(db, constants.DB_PRODUCTS);
      let qry = query(ref, where('isArchived', '==', false));

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        let results: IProduct[] = [];

        for (const doc of snapshot.docs) {
          const category: ICategory | undefined = categories.find(
            (c: any) => c.id === doc.data().categoryId
          );

          results.push({
            id: doc.id,
            productCode: doc.data().productCode,
            name: doc.data().name,
            category: {
              id: category?.id,
              name: category?.name,
              description: category?.description,
            },
            description: doc.data().description,
            createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
            updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
          });
        }

        setDocuments(results);
      });

      return () => unsub();
    }
  }, [categories]);

  const createDoc = async (payload: ISaveProduct): Promise<void> => {
    try {
      setError(null);

      const productPayload: ProductSchema = {
        productCode: generateNanoId(5),
        name: payload.name,
        categoryId: payload.categoryId,
        addOns: payload?.addOns || [],
        description: payload?.description || '',
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
          categoryId: payload.categoryId,
          description: payload.description,
          addOns: payload.addOns,
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
