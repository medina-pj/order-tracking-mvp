/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 6th 2023, 11:07:53 pm
 * ---------------------------------------------
 */
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { CategorySchema } from '@/types/schema/product';

const CategoryService = {
  fetchCategories: async (ids: string[]): Promise<CategorySchema[]> => {
    try {
      let result: CategorySchema[] = [];
      const ref = collection(db, constants.DB_CATEGORIES);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        result.push({
          id: doc.id,
          name: doc.data()?.name,
          sequence: doc.data()?.sequence,
          description: doc.data()?.description,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },

  fetchCategory: async (id: string): Promise<CategorySchema> => {
    try {
      const ref = collection(db, constants.DB_CATEGORIES);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          name: doc.data()?.name,
          sequence: doc.data()?.sequence,
          description: doc.data()?.description,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('Category not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default CategoryService;
