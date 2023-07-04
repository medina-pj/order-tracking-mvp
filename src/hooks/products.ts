/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 4th 2023, 10:15:28 pm
 * ---------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react';
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

export const useProduct = () => {
  const { documents: categories } = useCategory();

  const [documents, setDocuments] = useState<IProduct[]>([]);

  const fetchCategoryDetails = useCallback(
    (categoryId: string) => {
      const category: ICategory | undefined = categories.find((c: any) => c.id === categoryId);

      return {
        id: category?.id,
        name: category?.name,
        description: category?.description,
      };
    },
    [categories]
  );

  const getProductDetails = (id: string) => {
    const product: IProduct | undefined = documents.find((d: any) => d.id === id);

    return {
      id,
      productCode: product?.productCode,
      name: product?.name,
      description: product?.description,
      category: product?.category,
    };
  };

  useEffect(() => {
    (async function () {
      if (categories.length) {
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
              category: fetchCategoryDetails(doc.data().categoryId),
              description: doc.data().description,
              createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
              updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
            });
          }

          setDocuments(results);
        });

        return () => unsub();
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const createDoc = async (payload: ISaveProduct): Promise<void> => {
    try {
      const productPayload: ProductSchema = {
        productCode: generateNanoId(5),
        name: payload.name,
        categoryId: payload.categoryId,
        description: payload?.description || '',
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_PRODUCTS), productPayload);
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
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
    } catch (err: any) {
      throw err;
    }
  };

  const updateDoc = async (payload: IUpdateProduct): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_PRODUCTS, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          categoryId: payload.categoryId,
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

  return { documents, createDoc, deleteDoc, updateDoc, getProductDetails };
};

export default useProduct;
