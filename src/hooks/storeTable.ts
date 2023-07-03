/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Monday July 3rd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 3rd 2023, 9:38:21 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, setDoc, doc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { StoreTableSchema } from '@/types/schema/store';
import useStore from './store';

export interface ISaveStoreTable {
  name: string;
  storeId: string;
  capacity?: number;
}

export interface IUpdateStoreTable extends ISaveStoreTable {
  id: string;
  isAvailable: boolean;
}

export interface IStoreTable {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
  store: {
    id?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const useStoreTable = () => {
  const { documents: stores, getStoreDetails } = useStore();
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<IStoreTable[]>([]);

  useEffect(() => {
    (async function () {
      if (stores.length) {
        let ref = collection(db, constants.DB_STORE_TABLE);
        let qry = query(ref, where('isArchived', '==', false));

        //FIXME: FETCH ONLY STORES TABLES

        //will invoke everytime database is updated in the cloud
        const unsub = onSnapshot(qry, async snapshot => {
          let results: IStoreTable[] = [];

          for (const doc of snapshot.docs) {
            results.push({
              id: doc.id,
              store: getStoreDetails(doc.data()?.storeId),
              name: doc.data()?.name,
              isAvailable: doc.data()?.isAvailable,
              capacity: doc.data()?.capacity,
              createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
              updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
            });
          }

          setDocuments(results);
        });

        return () => unsub();
      }
    })();
  }, [getStoreDetails, stores]);

  const createDoc = async (payload: ISaveStoreTable): Promise<void> => {
    try {
      setError(null);

      const tablePayload: StoreTableSchema = {
        storeId: payload.storeId,
        name: payload.name,
        capacity: payload.capacity || 0,
        isAvailble: true,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_STORE_TABLE), tablePayload);
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const updateDoc = async (payload: IUpdateStoreTable): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_STORE_TABLE, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          capacity: payload.capacity,
          isAvailble: payload.isAvailable,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_STORE_TABLE, id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );
    } catch (error: any) {
      setError(error?.message);
    }
  };

  return { error, documents, createDoc, updateDoc, deleteDoc };
};

export default useStoreTable;
