/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:50:20 am
 * ---------------------------------------------
 */
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { StoreTableSchema } from '@/types/schema/store';

const TableService = {
  fetchTables: async (ids: string[]): Promise<StoreTableSchema[]> => {
    try {
      let result: StoreTableSchema[] = [];

      if (!ids.length) return result;

      const ref = collection(db, constants.DB_STORE_TABLE);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        result.push({
          id: doc.id,
          storeId: doc.data()?.storeId,
          name: doc.data()?.name,
          isAvailable: doc.data()?.isAvailable,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },

  fetchTable: async (id: string): Promise<StoreTableSchema> => {
    try {
      const ref = collection(db, constants.DB_STORE_TABLE);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          storeId: doc.data()?.storeId,
          name: doc.data()?.name,
          isAvailable: doc.data()?.isAvailable,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('Store table not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default TableService;
