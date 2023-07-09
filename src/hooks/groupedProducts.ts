/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 12:09:05 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { GroupedProductSchema } from '@/types/schema/product';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';
import ProductService, { ISubMenu } from '@/services/products';
import StoreService from '@/services/stores';

export interface ISaveGroupedProduct {
  name: string;
  storeId: string;
  sequence: number;
  description: string;
  products: {
    productId: string;
    price: number;
  }[];
}

export interface IUpdateGroupedProduct extends ISaveGroupedProduct {
  id: string;
}

export interface IGroupedProduct {
  id: string;
  store: {
    id?: string;
    name?: string;
  };
  groupedProductCode: string;
  name: string;
  sequence: number;
  description: string;
  products: ISubMenu[];
  createdAt: string;
  updatedAt: string;
}

export const useGroupedProduct = () => {
  const [documents, setDocuments] = useState<IGroupedProduct[]>([]);

  useEffect(() => {
    (async function () {
      let ref = collection(db, constants.DB_GROUPED_PRODUCT);
      let qry = query(ref, where('isArchived', '==', false));

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        let results: IGroupedProduct[] = [];

        for (const doc of snapshot.docs) {
          results.push({
            id: doc.id,
            store: await StoreService.fetchStore(doc.data()?.storeId),
            groupedProductCode: doc.data()?.groupedProductCode,
            name: doc.data()?.name,
            sequence: doc.data()?.sequence,
            description: doc.data()?.description,
            products: await ProductService.fetchSubMenu([doc.id]),
            createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
            updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
          });
        }

        setDocuments(results);
      });

      return () => unsub();
    })();
  }, []);

  const createDoc = async (payload: ISaveGroupedProduct): Promise<void> => {
    try {
      const productPayload: GroupedProductSchema = {
        groupedProductCode: generateNanoId(),
        storeId: payload.storeId,
        name: payload.name,
        description: payload.description,
        sequence: payload.sequence,
        products: payload.products,
        isArchived: false,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      };

      await addDoc(collection(db, constants.DB_GROUPED_PRODUCT), productPayload);
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_GROUPED_PRODUCT, id);

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

  const updateDoc = async (payload: IUpdateGroupedProduct): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_GROUPED_PRODUCT, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          description: payload.description,
          sequence: payload.sequence,
          products: payload.products,
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

export default useGroupedProduct;
