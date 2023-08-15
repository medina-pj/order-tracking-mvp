/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Monday July 17th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 15th 2023, 11:36:58 am
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
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { ExpenseStatusEnum, ExpensesSchema } from '@/types/schema/expenses';
import generateNanoId from '@/utils/generateNanoId';
import useAuth from './auth';
import UserService from '@/services/user';
import StoreService from '@/services/stores';
import CategoryService from '@/services/categories';
import _ from 'lodash';

export interface ISaveExpenses {
  recordDate: string;
  storeId: string;
  categoryId?: string;
  otherCategory?: string;
  particulars: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  status: ExpenseStatusEnum;
  paymentDue?: string;
}

export interface IUpdateExpenses extends ISaveExpenses {
  id: string;
}

export interface IExpenses {
  id: string;
  store: {
    id?: string;
    name?: string;
  };
  category?: {
    id?: string;
    name?: string;
  };
  otherCategory?: string;
  particulars: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  status: ExpenseStatusEnum;
  paymentDue?: string;
  createdBy: {
    id?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IFilterOptions {
  startDate: any;
  endDate: any;
  status: ExpenseStatusEnum | '';
  store: string;
}

interface InitialState {
  filters?: IFilterOptions;
}

const useExpenses = (args?: InitialState) => {
  const { userInfo } = useAuth();
  const [documents, setDocuments] = useState<IExpenses[]>([]);
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
        where('isArchived', '==', false),
      ];

      if (filters.status) {
        queries.push(where('status', '==', filters.status));
      }

      let ref = collection(db, constants.DB_EXPENSES);
      let qry = query(ref, ...queries);

      //will invoke everytime database is updated in the cloud
      const unsub = onSnapshot(qry, async snapshot => {
        const promises = snapshot.docs.map(async (doc: any) => {
          const data = doc.data();

          return {
            id: doc.id,
            store: await StoreService.fetchStore(data?.storeId),
            category: data?.categoryId ? await CategoryService.fetchCategory(data?.categoryId) : {},
            createdBy: await UserService.fetchUser(data?.createdBy),
            otherCategory: data?.otherCategory,
            particulars: data?.particulars,
            description: data?.description,
            quantity: data?.quantity,
            unit: data?.unit,
            unitPrice: data?.unitPrice,
            status: data?.status,
            paymentDue: data?.paymentDue ? moment(data?.paymentDue).format('MMM DD, YYYY') : '',
            createdAt: moment(data?.createdAt).format('MMM DD, YYYY hh:mma'),
            updatedAt: moment(data?.updatedAt).format('MMM DD, YYYY hh:mma'),
          };
        });

        const results: IExpenses[] = await Promise.all(promises);

        setDocuments(_.orderBy(results, ['createdAt'], ['desc']));
      });

      return () => unsub();
    }
  }, [filters.endDate, filters.startDate, filters.status, filters.store]);

  const filterExpenses = async (filters: IFilterOptions) => {
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

  const createDoc = async (payload: ISaveExpenses): Promise<void> => {
    try {
      if (!userInfo) {
        throw new Error('Unauthorized user cannot create expenses history.');
      }

      const expensesPayload: ExpensesSchema = {
        expensesCode: generateNanoId(),
        storeId: payload.storeId,
        categoryId: payload.categoryId,
        otherCategory: payload.otherCategory,
        particulars: payload.particulars,
        description: payload.description,
        unit: payload.unit,
        quantity: payload.quantity,
        unitPrice: payload.unitPrice,
        status: payload.status,
        createdBy: userInfo.id as string,
        paymentDue: moment(payload.paymentDue).toDate().getTime(),
        createdAt: moment(new Date(payload.recordDate)).toDate().getTime(),
        updatedAt: moment(new Date(payload.recordDate)).toDate().getTime(),
        isArchived: false,
      };

      await addDoc(collection(db, constants.DB_EXPENSES), expensesPayload);

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_EXPENSES, id);

      await setDoc(
        docRef,
        {
          isArchived: true,
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  const updateDoc = async (payload: IUpdateExpenses): Promise<void> => {
    try {
      const docRef = doc(db, constants.DB_EXPENSES, payload.id);
      await setDoc(
        docRef,
        {
          storeId: payload.storeId,
          categoryId: payload.categoryId,
          otherCategory: payload.otherCategory,
          particulars: payload.particulars,
          description: payload.description,
          unit: payload.unit,
          quantity: payload.quantity,
          unitPrice: payload.unitPrice,
          status: payload.status,
          paymentDue: moment(payload.paymentDue).toDate().getTime(),
          updatedAt: moment().toDate().getTime(),
        },
        { merge: true }
      );

      return;
    } catch (err: any) {
      throw err;
    }
  };

  return { documents, createDoc, deleteDoc, filterExpenses, updateDoc };
};

export default useExpenses;
