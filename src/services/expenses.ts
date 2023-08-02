/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday August 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: August 2nd 2023, 3:28:50 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { ExpensesSchema } from '@/types/schema/expenses';

const ExpenseService = {
  fetchExpense: async (id: string): Promise<ExpensesSchema> => {
    try {
      const ref = collection(db, constants.DB_EXPENSES);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        const data = doc.data();
        return {
          id: doc.id,
          storeId: data?.storeId,
          categoryId: data?.categoryId,
          createdBy: data?.createdBy,
          otherCategory: data?.otherCategory,
          particulars: data?.particulars,
          description: data?.description,
          quantity: data?.quantity,
          unit: data?.unit,
          unitPrice: data?.unitPrice,
          status: data?.status,
          paymentDue: data?.paymentDue,
          createdAt: data?.createdAt,
          updatedAt: data?.updatedAt,
        };
      }

      throw new Error('Expense record not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default ExpenseService;
