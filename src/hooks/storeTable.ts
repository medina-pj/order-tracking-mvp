/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Monday July 3rd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:14:53 am
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, setDoc, doc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { StoreTableSchema } from '@/types/schema/store';
import StoreService from '@/services/stores';

export interface ISaveStoreTable {
  name: string;
  storeId: string;
}

export interface IUpdateStoreTable extends ISaveStoreTable {
  id: string;
  isAvailable: boolean;
}

export interface IStoreTable {
  id: string;
  name: string;
  isAvailable: boolean;
  store: {
    id?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const useStoreTable = () => {
  const [documents, setDocuments] = useState<IStoreTable[]>([]);

  useEffect(() => {
    (async function () {
      let ref = collection(db, constants.DB_STORE_TABLE);
      let qry = query(ref, where('isArchived', '==', false));

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        let results: IStoreTable[] = [];

        for (const doc of snapshot.docs) {
          const storeDetails = await StoreService.fetchStore(doc.data()?.storeId);

          results.push({
            id: doc.id,
            store: storeDetails,
            name: doc.data()?.name,
            isAvailable: doc.data()?.isAvailable,
            createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
            updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
          });
        }

        setDocuments(results);
      });

      return () => unsub();
    })();
  }, []);

  const createDoc = async (payload: ISaveStoreTable): Promise<void> => {
    try {
      const tablePayload: StoreTableSchema = {
        storeId: payload.storeId,
        name: payload.name,
        isAvailable: true,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_STORE_TABLE), tablePayload);
    } catch (err: any) {
      throw err;
    }
  };

  const updateDoc = async (payload: IUpdateStoreTable): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_STORE_TABLE, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
          isAvailable: payload.isAvailable,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_STORE_TABLE, id);

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

  return { documents, createDoc, updateDoc, deleteDoc };
};

export default useStoreTable;
