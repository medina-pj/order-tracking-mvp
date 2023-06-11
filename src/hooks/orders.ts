/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 12:49:55 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

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
import { OrderItemsSchema, OrderSchema, ProductSchema } from '../types/schema';
import constants from '../utils/constants';
import generateNanoId from '@/utils/generateNanoId';

export interface ICreateOrder {
  type: 'dine_in' | 'take_out' | 'ordered_online';
  orderPaid: boolean;
  notes: string;
  customerNotes: string;
  discount: number;
  items: [
    {
      productId: string;
      productCode: string;
      productName: string;
      price: number;
      quantity: number;
    }
  ];
  onlineOrderPlatform?: string;
  table: string;
}

export interface IOrder extends ICreateOrder {
  id: string;
  orderId: string;
  history: any[];
  data: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const useOrder = () => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<IOrder[]>([]);

  useEffect(() => {
    let ref = collection(db, constants.DB_ORDERS);
    let qry = query(ref, where('isArchived', '==', false));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async (snapshot) => {
      let results: IOrder[] = [];

      for (const doc of snapshot.docs) {
        results.push({
          id: doc.id,
          orderId: doc.data().orderId,
          notes: doc.data().notes,
          customerNotes: doc.data().customerNotes,
          items: doc.data().items,
          table: doc.data().table,
          history: doc.data().history,
          type: doc.data().type,
          status: doc.data().status,
          orderPaid: doc.data().orderPaid,
          discount: doc.data().discount,
          data: doc.data().data,
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

  const createOrder = async (payload: ICreateOrder): Promise<void> => {
    try {
      setError(null);

      const formattedItems: OrderItemsSchema[] = payload.items.map(
        (item: any) => ({
          ...item,
          id: uuid(),
          createdAt: moment().toDate().getTime(),
          updatedAt: moment().toDate().getTime(),
        })
      );

      const orderPayload: OrderSchema = {
        orderId: generateNanoId(),
        notes: payload?.notes || '',
        customerNotes: payload?.customerNotes || '',
        items: formattedItems,
        history: [
          {
            action: 'order_received',
            actor: 'staff',
            timestamp: moment().toDate().getTime(),
          },
        ],
        type: payload.type,
        status: 'received',
        orderPaid: payload.orderPaid,
        discount: payload?.discount || 0,
        data: {
          onlineOrderPlatform:
            payload.type === 'ordered_online' && payload?.onlineOrderPlatform
              ? payload?.onlineOrderPlatform
              : '',
        },
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
        table: payload.table,
      };

      await addDoc(collection(db, constants.DB_ORDERS), orderPayload);

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  // const deleteDoc = async (id: string): Promise<void> => {
  //   try {
  //     setError(null);

  //     const docRef = doc(db, constants.DB_PRODUCTS, id);

  //     await setDoc(
  //       docRef,
  //       {
  //         isArchived: true,
  //         updatedAt: moment().toDate().getTime(),
  //       },
  //       { merge: true }
  //     );

  //     return;
  //   } catch (error: any) {
  //     setError(error?.message);

  //     return;
  //   }
  // };

  // const updateDoc = async (payload: IUpdateProduct): Promise<void> => {
  //   try {
  //     setError(null);

  //     const docRef = doc(db, constants.DB_PRODUCTS, payload.id);

  //     await setDoc(
  //       docRef,
  //       {
  //         name: payload.name,
  //         price: payload.price,
  //         categoryId: payload.categoryId,
  //         description: payload.description,
  //         note: payload.note,
  //         updatedAt: moment().toDate().getTime(),
  //       },
  //       { merge: true }
  //     );

  //     return;
  //   } catch (error: any) {
  //     setError(error?.message);

  //     return;
  //   }
  // };

  return { error, documents, createOrder };
};

export default useOrder;
