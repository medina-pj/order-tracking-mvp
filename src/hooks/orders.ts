/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 16th 2023, 2:54:33 pm
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
  OrderPaymentMethodEnum,
} from '@/types/schema/order';
import constants from '@/utils/constants';
import generateNanoId from '@/utils/generateNanoId';
import useAuth from './auth';
import StoreService from '@/services/stores';
import TableService from '@/services/table';
import OrderService from '@/services/orders';
import _ from 'lodash';

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
  orderCompleted?: boolean;
}

export interface IUpdateOrder extends ICreateOrder {
  id: string;
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

interface IFilterOptions {
  startDate: any;
  endDate: any;
  status: OrderStatusEnum | '' | 'active';
  store: string;
}

interface InitialState {
  filters?: IFilterOptions;
}

export const OrderStatusPath: { [key in OrderStatusEnum]: OrderStatusEnum[] } = {
  [OrderStatusEnum.NEW]: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.DECLINED],
  [OrderStatusEnum.DECLINED]: [],
  [OrderStatusEnum.CONFIRMED]: [OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.PREPARING]: [OrderStatusEnum.SERVED, OrderStatusEnum.CANCELLED],
  [OrderStatusEnum.SERVED]: [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED],
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
        where('createdAt', '>=', filters.startDate || moment().startOf('day').valueOf()),
        where('createdAt', '<=', filters.endDate || moment().endOf('day').valueOf()),
        where('storeId', '==', filters.store),
      ];

      if (filters.status === 'active') {
        queries.push(
          where('status', 'in', [
            OrderStatusEnum.NEW,
            OrderStatusEnum.CONFIRMED,
            OrderStatusEnum.PREPARING,
            OrderStatusEnum.SERVED,
          ])
        );
      } else if (filters.status) {
        queries.push(where('status', '==', filters.status));
      }

      let ref = collection(db, constants.DB_ORDERS);
      let qry = query(ref, ...queries);

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        const promises = snapshot.docs.map(async (doc: any) => {
          const data = doc.data();

          const [store, table] = await Promise.all([
            await StoreService.fetchStore(data?.storeId),
            await TableService.fetchTable(data?.tableId),
          ]);

          return {
            id: doc.id,
            orderId: data?.orderId,
            store,
            table,
            notes: data?.notes,
            customerNotes: data?.customerNotes,
            type: data?.type,
            status: data?.status,
            cartItems: data?.cartItems,
            history: data?.history,
            payment: data?.payment,
            discount: data?.discount,
            data: data?.data,
            createdAt: data?.createdAt,
            updatedAt: data?.updatedAt,
          };
        });

        const results = await Promise.all(promises);

        setDocuments(_.orderBy(results, ['createdAt'], ['desc']));
      });

      return () => unsub();
    }
  }, [filters.endDate, filters.startDate, filters.status, filters.store]);

  const filterOrders = async (filters: IFilterOptions) => {
    try {
      if (!filters.store) {
        throw new Error('Store is required.');
      }

      const filterStartDate = filters.startDate
        ? moment(filters.startDate).startOf('day').add(7, 'hours').valueOf()
        : moment().startOf('day').add(7, 'hours').valueOf();

      const filterEndDate = filters.endDate
        ? moment(filters.endDate).endOf('day').add(5, 'hours').valueOf()
        : moment().endOf('day').add(5, 'hours').valueOf();

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
        throw new Error('Unauthorized user cannot create an order.');
      }

      const orderPayload: OrderSchema = {
        orderId: generateNanoId(),
        storeId: payload.storeId,
        tableId: payload.tableId,
        notes: payload?.notes || '',
        customerNotes: payload?.customerNotes || '',
        type: payload.type,
        cartItems: payload.cartItems,
        status: payload?.orderCompleted ? OrderStatusEnum.COMPLETED : OrderStatusEnum.CONFIRMED,
        payment:
          payload?.orderCompleted && (!payload?.payment?.modeOfPayment || !payload?.payment?.status)
            ? {
                modeOfPayment: OrderPaymentMethodEnum.CASH,
                status: OrderPaymentStatusEnum.PAID,
              }
            : payload?.payment,
        discount: payload?.discount || [],
        data: payload.data || {},
        history: [
          {
            action: payload?.orderCompleted ? 'order-received-and-completed' : 'order-received-and-confirmed',
            actor: userInfo?.name,
            actorId: userInfo?.id,
            timestamp: moment().toDate().getTime(),
          },
        ],
        createdAt: moment().toDate().getTime(),
        updatedAt: moment().toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_ORDERS), orderPayload);
    } catch (err: any) {
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatusEnum): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user cannot update order status.');
      }

      const currentOrder = await OrderService.fetchOrder(id);

      if (!currentOrder) throw new Error('Order not found.');

      if (!OrderStatusPath[currentOrder?.status].includes(status)) {
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
      throw err;
    }
  };

  const updateOrderPaymentStatus = async (
    id: string,
    method: OrderPaymentMethodEnum,
    status: OrderPaymentStatusEnum
  ): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user cannot update order payment status.');
      }

      const currentOrder = await OrderService.fetchOrder(id);
      if (!currentOrder) throw new Error('Order not found.');
      if (currentOrder?.payment?.status === OrderPaymentStatusEnum.PAID) {
        throw new Error(`Cannot update payment status. status is already ${currentOrder?.payment?.status}`);
      }

      const docRef = doc(db, constants.DB_ORDERS, id);

      const history = {
        action: `update-order-payment-status-to-${status}`,
        actor: userInfo.name,
        actorId: userInfo.id,
        timestamp: moment().toDate().getTime(),
      };

      await setDoc(
        docRef,
        {
          payment: {
            modeOfPayment: method,
            status,
          },
          history: arrayUnion(history),
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const updateOrder = async (payload: IUpdateOrder): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user cannot update an order details.');
      }

      const docRef = doc(db, constants.DB_ORDERS, payload.id);

      const history = {
        action: `update-order-details`,
        actor: userInfo.name,
        actorId: userInfo.id,
        timestamp: moment().toDate().getTime(),
      };

      await setDoc(
        docRef,
        {
          storeId: payload.storeId,
          tableId: payload.tableId,
          notes: payload?.notes || '',
          customerNotes: payload?.customerNotes || '',
          type: payload.type,
          cartItems: payload.cartItems,
          payment: payload.payment,
          discount: payload?.discount || [],
          data: payload.data || {},
          history: arrayUnion(history),
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    documents,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrder,
    filterOrders,
  };
};

export default useOrder;
