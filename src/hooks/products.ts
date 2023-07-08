/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 8th 2023, 4:10:11 pm
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
import ProductService, { ISubMenu } from '@/services/products';

export interface ISaveProduct {
  categoryId: string;
  storeId: string;
  productAbbrev: string;
  name: string;
  price: number;
  isAddons: boolean;
  description: string;
  note: string;
  subMenu: string[];
}

export interface IUpdateProduct extends ISaveProduct {
  id: string;
  isAvailable: boolean;
}

export interface IProduct {
  id: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  store: {
    id: string;
    name: string;
  };
  productCode: string;
  productAbbrev: string;
  name: string;
  price: number;
  isAddons: boolean;
  isAvailable: boolean;
  description: string;
  note: string;
  subMenu: ISubMenu[];
  createdAt: string;
  updatedAt: string;
}

export const useProduct = () => {
  const [documents, setDocuments] = useState<IProduct[]>([]);

  useEffect(() => {
    (async function () {
      let ref = collection(db, constants.DB_PRODUCTS);
      let qry = query(ref, where('isArchived', '==', false));

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        const productIds = snapshot.docs.map((d: any) => d.id);
        const products: IProduct[] = await ProductService.fetchProducts(productIds, true);

        setDocuments(products);
      });

      return () => unsub();
    })();
  }, []);

  const createDoc = async (payload: ISaveProduct): Promise<void> => {
    try {
      const productPayload: ProductSchema = {
        productCode: generateNanoId(),
        categoryId: payload.categoryId,
        storeId: payload.categoryId,
        productAbbrev: payload.productAbbrev,
        name: payload.name,
        price: payload.price,
        description: payload?.description || '',
        note: payload?.note || '',
        subMenu: payload?.subMenu || [],
        isAddons: payload.isAddons,
        isAvailable: true,
        isArchived: false,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
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
          categoryId: payload.categoryId,
          storeId: payload.categoryId,
          productAbbrev: payload.productAbbrev,
          name: payload.name,
          price: payload.price,
          description: payload.description,
          note: payload.note,
          subMenu: payload.subMenu,
          updatedAt: moment().toDate().getTime(),
          isAddons: payload.isAddons,
          isAvailable: payload.isAddons,
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

export default useProduct;
