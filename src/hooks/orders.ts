/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 10:17:26 pm
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { collection, query, onSnapshot, where, addDoc, doc, setDoc } from 'firebase/firestore';

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
  onlineOrderPlatform: string;
}

const useOrder = () => {
  const [error, setError] = useState<any>(null);

  const createOrder = async (payload: ICreateOrder): Promise<void> => {
    try {
      setError(null);

      const formattedItems: OrderItemsSchema[] = payload.items.map((item: any) => ({
        ...item,
        id: uuid(),
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      }));

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

  return { error, createOrder };
};

export default useOrder;
