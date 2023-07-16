/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 16th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 11:13:44 am
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { OrderSchema } from '@/types/schema/order';

const OrderService = {
  fetchOrders: async (ids: string[]): Promise<OrderSchema[]> => {
    try {
      let result: OrderSchema[] = [];

      if (!ids.length) return result;

      const ref = collection(db, constants.DB_ORDERS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        result.push({
          id: doc.id,
          orderId: doc.data()?.orderId,
          storeId: doc.data()?.storeId,
          tableId: doc.data()?.tableId,
          notes: doc.data()?.notes,
          customerNotes: doc.data()?.customerNotes,
          type: doc.data()?.type,
          status: doc.data()?.status,
          cartItems: doc.data()?.cartItems,
          history: doc.data()?.history,
          discount: doc.data()?.discount,
          payment: doc.data()?.payment,
          data: doc.data()?.data,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },

  fetchOrder: async (id: string): Promise<OrderSchema> => {
    try {
      const ref = collection(db, constants.DB_ORDERS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          orderId: doc.data()?.orderId,
          storeId: doc.data()?.storeId,
          tableId: doc.data()?.tableId,
          notes: doc.data()?.notes,
          customerNotes: doc.data()?.customerNotes,
          type: doc.data()?.type,
          status: doc.data()?.status,
          cartItems: doc.data()?.cartItems,
          history: doc.data()?.history,
          discount: doc.data()?.discount,
          payment: doc.data()?.payment,
          data: doc.data()?.data,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('Order not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default OrderService;
