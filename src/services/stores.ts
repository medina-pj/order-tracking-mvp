/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: February 5th 2024, 8:41:06 pm
 * ---------------------------------------------
 */
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { StoreSchema } from '@/types/schema/store';

const StoreService = {
  fetchStores: async (ids: string[]): Promise<StoreSchema[]> => {
    try {
      let result: StoreSchema[] = [];

      if (!ids.length) return result;

      const ref = collection(db, constants.DB_STORE);
      const qry = query(ref, where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        result.push({
          id: doc.id,
          name: doc.data()?.name,
          location: doc.data()?.location,
          contactNumber: doc.data()?.contactNumber,
          staff: doc.data()?.staff,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },

  fetchStore: async (id: string): Promise<StoreSchema> => {
    try {
      const ref = collection(db, constants.DB_STORE);
      const qry = query(ref, where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          name: doc.data()?.name,
          location: doc.data()?.location,
          contactNumber: doc.data()?.contactNumber,
          staff: doc.data()?.staff,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('Store not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default StoreService;
