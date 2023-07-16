/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 12:41:24 pm
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
  TOrderPayment,
  OrderPaymentStatusEnum,
} from '@/types/schema/order';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';
import useAuth from './auth';
import StoreService from '@/services/stores';
import TableService from '@/services/table';
import OrderService from '@/services/orders';

export interface ICreateOrder {
  storeId: string;
  tableId: string;
  notes: string;
  customerNotes?: string;
  type: OrderTypeEnum;
  discount?: TDiscount[];
  cartItems: TCartItems[];
  data?: TOrderData;
  payment?: TOrderPayment;
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
  cartItems: TCartItems[];
  history: TOrderHistory[];
  discount: TDiscount[];
  data: TOrderData;
  payment?: TOrderPayment;
  createdAt: string;
  updatedAt: string;
}

export interface IFilterParams {
  startDate: any;
  endDate: any;
  status: OrderStatusEnum | '';
  store: string;
}

interface IFilterOptions {
  startDate: any;
  endDate: any;
  status: OrderStatusEnum | '';
  store: string;
}

interface InitialState {
  filters?: IFilterOptions;
}

const OrderStatusPath: { [key in OrderStatusEnum]: OrderStatusEnum[] } = {
  [OrderStatusEnum.NEW]: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.DECLINED],
  [OrderStatusEnum.DECLINED]: [],
  [OrderStatusEnum.CONFIRMED]: [OrderStatusEnum.CANCELLED, OrderStatusEnum.PREPARING],
  [OrderStatusEnum.PREPARING]: [OrderStatusEnum.CANCELLED, OrderStatusEnum.SERVED],
  [OrderStatusEnum.SERVED]: [OrderStatusEnum.CANCELLED, OrderStatusEnum.COMPLETED],
  [OrderStatusEnum.COMPLETED]: [],
  [OrderStatusEnum.CANCELLED]: [],
};

const useOrder = (args?: InitialState) => {
  const { userInfo } = useAuth();
  const [documents, setDocuments] = useState<IOrder[]>([]);

  const [filters, setFilters] = useState<IFilterOptions>({
    startDate: args?.filters?.startDate || '',
    endDate: args?.filters?.endDate || '',
    status: args?.filters?.status || '',
    store: args?.filters?.store || '',
  });

  useEffect(() => {
    if (filters.store) {
      const queries: QueryConstraint[] = [
        where('createdAt', '>=', filters.startDate || moment().subtract(3, 'days').startOf('day').valueOf()),
        where('createdAt', '<=', filters.endDate || moment().endOf('day').valueOf()),
        where('storeId', '==', filters.store),
      ];

      if (filters.status) {
        queries.push(where('status', '==', filters.status));
      }

      let ref = collection(db, constants.DB_ORDERS);
      let qry = query(ref, ...queries, orderBy('createdAt', 'desc'));

      console.log({
        queries,
      });

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
            cartItems: doc.data().cartItems,
            history: doc.data().history,
            payment: doc.data().payment,
            discount: doc.data().discount,
            data: doc.data().data,
            createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
            updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
          });
        }

        setDocuments(results);
      });

      return () => unsub();
    }
  }, [filters.endDate, filters.startDate, filters.status, filters.store]);

  const searchOrder = async (filters: IFilterParams) => {
    try {
      if (!filters.store) {
        throw new Error('Store is required.');
      }

      const filterStartDate = filters.startDate
        ? moment(filters.startDate).startOf('day').valueOf()
        : moment().startOf('day').valueOf();

      const filterEndDate = filters.endDate
        ? moment(filters.endDate).endOf('day').valueOf()
        : moment().startOf('day').valueOf();

      setFilters({
        startDate: filterStartDate,
        endDate: filterEndDate,
        status: filters?.status,
        store: filters?.store,
      });
    } catch (err: any) {
      throw err;
    }
  };

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
        cartItems: payload.cartItems,
        status: OrderStatusEnum.CONFIRMED,
        payment: payload.payment,
        discount: payload?.discount || [],
        data: payload.data || {},
        history: [
          {
            action: 'order_received_and_confirmed',
            actor: userInfo?.name,
            actorId: userInfo?.id,
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

  const updateOrderStatus = async (id: string, status: OrderStatusEnum): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user can not create an order.');
      }

      const currentOrder = await OrderService.fetchOrder(id);

      if (!currentOrder) throw new Error('Order not found.');

      if (OrderStatusPath[currentOrder?.status].includes(status)) {
        throw new Error(`Cannot update order to ${status}. Order status is already ${currentOrder.status}`);
      }

      if (
        status === OrderStatusEnum.COMPLETED &&
        currentOrder?.payment?.status !== OrderPaymentStatusEnum.PAID
      ) {
        throw new Error(`Cannot complete order. Order still unpaid.`);
      }

      const docRef = doc(db, constants.DB_ORDERS, id);

      const history = {
        action: `order-${status}`,
        actor: userInfo.name,
        actorId: userInfo.id,
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
    } catch (err: any) {
      return err;
    }
  };

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
    updateOrderStatus,
    // updateOrderPaymentStatus,
    searchOrder,
  };
};

export default useOrder;
