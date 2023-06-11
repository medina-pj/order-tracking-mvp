/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 9:55:37 pm
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
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { TableSchema } from '../types/schema';
import constants from '../utils/constants';

export interface ISaveTable {
  name: string;
}

export interface IUpdateTable extends ISaveTable {
  id: string;
}

export interface ITable extends ISaveTable, IUpdateTable {
  createdAt: string;
  updatedAt: string;
}

const useTable = () => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<ITable[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_TABLES);
    let qry = query(ref, where('isArchived', '==', false));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async (snapshot) => {
      let results: ITable[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          name: doc.data().name,
          createdAt: moment(doc.data()?.createdAt).format(
            'MMM DD, YYYY hh:mma'
          ),
          updatedAt: moment(doc.data()?.updatedAt).format(
            'MMM DD, YYYY hh:mma'
          ),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, []);

  const createDoc = async (payload: ISaveTable): Promise<void> => {
    try {
      setError(null);

      const tablePayload: TableSchema = {
        name: payload.name,
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_TABLES), tablePayload);

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_TABLES, id);

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

  const updateDoc = async (payload: IUpdateTable): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_TABLES, payload.id);

      await setDoc(
        docRef,
        {
          name: payload.name,
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

export default useTable;
