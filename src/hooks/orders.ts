/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 8th 2023, 4:33:23 pm
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
  orderBy,
  arrayUnion,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import {
  TDiscount,
  OrderSchema,
  OrderStatusEnum,
  OrderTypeEnum,
  TCartItems,
  TOrderData,
  TOrderHistory,
} from '@/types/schema/order';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';
import useAuth from './auth';
import StoreService from '@/services/stores';
import TableService from '@/services/table';

export interface ICreateOrder {
  storeId: string;
  tableId: string;
  notes: string;
  customerNotes: string;
  type: OrderTypeEnum;
  discount: TDiscount[];
  items: TCartItems[];
  data: TOrderData;
  orderPaid: boolean;
}

export interface IOrder {
  id: string;
  orderId: string;
  store: {
    id?: string;
    name: string;
  };
  table: {
    id?: string;
    name: string;
  };
  notes: string;
  customerNotes: string;
  type: OrderTypeEnum;
  status: OrderStatusEnum;
  items: TCartItems[];
  history: TOrderHistory[];
  discount: TDiscount[];
  data: TOrderData;
  orderPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

// export interface IFilterParams {
//   startDate: any;
//   endDate: any;
//   status: string;
// }

const useOrder = () => {
  const { userInfo } = useAuth();
  const [documents, setDocuments] = useState<IOrder[]>([]);
  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [status, setStatus] = useState<any>('');

  useEffect(() => {
    const queries: QueryConstraint[] = [
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
          store: await StoreService.fetchStore(doc.data().storeId),
          table: await TableService.fetchTable(doc.data().tableId),
          notes: doc.data().notes,
          customerNotes: doc.data().customerNotes,
          type: doc.data().type,
          status: doc.data().status,
          items: doc.data().items,
          history: doc.data().history,
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

  // const searchOrder = async (filters: IFilterParams) => {
  //   if (filters.startDate && filters.endDate) {
  //     setStartDate(moment(filters.startDate).startOf('day').valueOf());
  //     setEndDate(moment(filters.endDate).endOf('day').valueOf());
  //   } else {
  //     setStartDate(moment().startOf('day').valueOf());
  //     setEndDate(moment().endOf('day').valueOf());
  //   }

  //   if (filters.status) {
  //     setStatus(filters.status);
  //   } else {
  //     setStatus('');
  //   }
  //   // const start: number = filters.sta
  //   //   ? moment(startDate).startOf('day').valueOf()
  //   //   : moment().startOf('day').valueOf();

  //   // const end: number = endDate
  //   //   ? moment(endDate).endOf('day').valueOf()
  //   //   : moment().endOf('day').valueOf();

  //   // const queries: QueryConstraint[] = [
  //   //   where('isArchived', '==', false),
  //   //   where('createdAt', '>=', start),
  //   //   where('createdAt', '<=', end),
  //   // ];

  //   // if (status) {
  //   //   queries.push(where('status', '==', status));
  //   // }

  //   // console.log({
  //   //   end,
  //   //   start,
  //   // });

  //   // let ref = collection(db, constants.DB_ORDERS);
  //   // let qry = query(ref, ...queries, orderBy('createdAt', 'desc'));

  //   // const querySnapshot = await getDocs(qry);

  //   // // Process the query results
  //   // querySnapshot.forEach(doc => {
  //   //   console.log('Document data:', doc.data());
  //   // });
  // };

  const createOrder = async (payload: ICreateOrder): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user can not create an order.');
      }

      const orderPayload: OrderSchema = {
        orderId: generateNanoId(),
        storeId: payload.storeId,
        tableId: payload.tableId,
        notes: payload?.notes || '',
        customerNotes: payload?.customerNotes || '',
        type: payload.type,
        items: payload.items,
        status: OrderStatusEnum.CONFIRMED,
        orderPaid: payload.orderPaid,
        discount: payload?.discount || [],
        data: payload.data,
        history: [
          {
            action: 'order_received_and_confirmed',
            actor: userInfo?.id as string,
            timestamp: moment().toDate().getTime(),
          },
        ],
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
      };

      await addDoc(collection(db, constants.DB_ORDERS), orderPayload);
    } catch (err: any) {
      throw err;
    }
  };

  // const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  //   try {
  //     setError(null);

  //     const docRef = doc(db, constants.DB_ORDERS, id);

  //     const history = {
  //       action: `order-${status}`,
  //       actor: `staff`,
  //       timestamp: moment().toDate().getTime(),
  //     };

  //     await setDoc(
  //       docRef,
  //       {
  //         status,
  //         history: arrayUnion(history),
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

  // const updateOrderPaymentStatus = async (id: string, status: boolean): Promise<void> => {
  //   try {
  //     setError(null);

  //     const docRef = doc(db, constants.DB_ORDERS, id);

  //     await setDoc(
  //       docRef,
  //       {
  //         orderPaid: status,
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

  return {
    documents,
    createOrder,
    // updateOrderStatus,
    // updateOrderPaymentStatus,
    // searchOrder,
  };
};

export default useOrder;
