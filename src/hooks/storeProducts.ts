/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 2nd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 4th 2023, 10:18:22 pm
 * ---------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  documentId,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import useProduct from './products';
import { StoreProductSchema } from '@/types/schema/store';
import useStore from './store';

export interface ISaveStoreProduct {
  storeId: string;
  productId: string;
  price: number;
  isAddOn: boolean;
  addOns?: string[];
  productAbbrev?: string;
  note?: string;
}

export interface IUpdateProduct extends ISaveStoreProduct {
  id: string;
  isAvailable: boolean;
}

export interface IStoreProduct {
  id: string;
  price: number;
  isAddOn?: boolean;
  isAvailable: boolean;
  productAbbrev?: string;
  note?: string;
  store: {
    id?: string;
    name?: string;
  };
  product: {
    id?: string;
    productCode?: string;
    name?: string;
    description?: string;
    category?: {
      id?: string;
      name?: string;
      description?: string;
    };
  };
  addOns?: Partial<IStoreProduct[]>;
  createdAt: string;
  updatedAt: string;
}

const useStoreProduct = () => {
  const { getProductDetails, documents: products } = useProduct();
  const { getStoreDetails, documents: stores } = useStore();

  const [documents, setDocuments] = useState<IStoreProduct[]>([]);

  const fetchAddOns = useCallback(
    async (storeProductIds: string[]): Promise<Partial<IStoreProduct[]>> => {
      if (!storeProductIds.length) return [];

      let results: any = [];

      const qry = query(
        collection(db, constants.DB_STORE_PRODUCT),
        where(documentId(), 'in', storeProductIds)
      );
      const querySnapshot = await getDocs(qry);

      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          product: getProductDetails(doc.data()?.productId),
          price: doc.data().price,
          isAvailable: doc.data()?.isAvailable,
        });
      });

      return results;
    },
    [getProductDetails]
  );

  useEffect(() => {
    (async function () {
      if (products.length && stores.length) {
        let ref = collection(db, constants.DB_STORE_PRODUCT);
        let qry = query(ref, where('isArchived', '==', false));

        //will invoke everytime database is updated in the cloud
        const unsub = onSnapshot(qry, async snapshot => {
          let results: IStoreProduct[] = [];

          for (const doc of snapshot.docs) {
            results.push({
              id: doc.id,
              store: getStoreDetails(doc.data()?.storeId),
              product: getProductDetails(doc.data()?.productId),
              price: doc.data()?.price,
              isAvailable: doc.data()?.isAvailable,
              isAddOn: doc.data()?.isAddOn,
              addOns: await fetchAddOns(doc.data()?.addOns),
              productAbbrev: doc.data()?.productAbbrev,
              note: doc.data()?.note,
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
  }, [products, stores]);

  const createDoc = async (payload: ISaveStoreProduct): Promise<void> => {
    try {
      const isAddOn = payload.isAddOn || false;
      const addOns = payload.addOns || [];

      const productPayload: StoreProductSchema = {
        storeId: payload.storeId,
        productId: payload.productId,
        price: payload.price,
        isAvailable: true,
        isAddOn: isAddOn,
        addOns: isAddOn ? [] : addOns,
        productAbbrev: payload.productAbbrev,
        note: payload.note || '',
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_STORE_PRODUCT), productPayload);

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_STORE_PRODUCT, id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );
    } catch (err: any) {
      throw err;
    }
  };

  return { createDoc, deleteDoc, documents };
};

export default useStoreProduct;
