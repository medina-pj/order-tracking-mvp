/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:45:17 am
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
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

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
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

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
