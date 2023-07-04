/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 3rd 2023, 9:44:01 pm
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
  orderBy,
  arrayUnion,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { CartItemsSchema, OrderSchema, OrderStatus } from '@/types/schema/order';
import constants from '@/utils/constants';
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

export interface IFilterParams {
  startDate: any;
  endDate: any;
  status: string;
}

const useOrder = () => {
  const [error, setError] = useState<any>(null);
  const [documents, setDocuments] = useState<IOrder[]>([]);
  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [status, setStatus] = useState<any>('');

  useEffect(() => {
    const queries: QueryConstraint[] = [
      where('isArchived', '==', false),
      where('createdAt', '>=', startDate || moment().startOf('day').valueOf()),
      where('createdAt', '<=', endDate || moment().endOf('day').valueOf()),
    ];

    if (status) {
      queries.push(where('status', '==', status));
    }

    let ref = collection(db, constants.DB_ORDERS);
    let qry = query(ref, ...queries, orderBy('createdAt', 'desc'));

    //will invoke everytime database is updated in the cloud
    const unsub = onSnapshot(qry, async snapshot => {
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
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      setDocuments(results);
    });

    return () => unsub();
  }, [endDate, startDate, status]);

  const searchOrder = async (filters: IFilterParams) => {
    if (filters.startDate && filters.endDate) {
      setStartDate(moment(filters.startDate).startOf('day').valueOf());
      setEndDate(moment(filters.endDate).endOf('day').valueOf());
    } else {
      setStartDate(moment().startOf('day').valueOf());
      setEndDate(moment().endOf('day').valueOf());
    }

    if (filters.status) {
      setStatus(filters.status);
    } else {
      setStatus('');
    }
    // const start: number = filters.sta
    //   ? moment(startDate).startOf('day').valueOf()
    //   : moment().startOf('day').valueOf();

    // const end: number = endDate
    //   ? moment(endDate).endOf('day').valueOf()
    //   : moment().endOf('day').valueOf();

    // const queries: QueryConstraint[] = [
    //   where('isArchived', '==', false),
    //   where('createdAt', '>=', start),
    //   where('createdAt', '<=', end),
    // ];

    // if (status) {
    //   queries.push(where('status', '==', status));
    // }

    // console.log({
    //   end,
    //   start,
    // });

    // let ref = collection(db, constants.DB_ORDERS);
    // let qry = query(ref, ...queries, orderBy('createdAt', 'desc'));

    // const querySnapshot = await getDocs(qry);

    // // Process the query results
    // querySnapshot.forEach(doc => {
    //   console.log('Document data:', doc.data());
    // });
  };

  const createOrder = async (payload: ICreateOrder): Promise<void> => {
    try {
      setError(null);

      const formattedItems: CartItemsSchema[] = payload.items.map((item: any) => ({
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
        table: payload.table,
      };

      await addDoc(collection(db, constants.DB_ORDERS), orderPayload);

      return;
    } catch (error: any) {
      setError(error?.message);

      return;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_ORDERS, id);

      const history = {
        action: `order-${status}`,
        actor: `staff`,
        timestamp: moment().toDate().getTime(),
      };

      await setDoc(
        docRef,
        {
          status,
          history: arrayUnion(history),
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

  const updateOrderPaymentStatus = async (id: string, status: boolean): Promise<void> => {
    try {
      setError(null);

      const docRef = doc(db, constants.DB_ORDERS, id);

      await setDoc(
        docRef,
        {
          orderPaid: status,
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

  return {
    error,
    documents,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    searchOrder,
  };
};

export default useOrder;
