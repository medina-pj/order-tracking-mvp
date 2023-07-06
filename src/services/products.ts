/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 6th 2023, 11:03:17 pm
 * ---------------------------------------------
 */
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { ProductSchema } from '@/types/schema/product';
import CategoryService from './categories';
import StoreService from './stores';
import { IProduct } from '@/hooks/products';

const ProductService = {
  fetchProducts: async (ids: string[], populateReferences = false): Promise<IProduct[]> => {
    try {
      let result: IProduct[] = [];
      const ref = collection(db, constants.DB_PRODUCTS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        let category = doc.data()?.categoryId;
        let store = doc.data()?.storeId;

        if (populateReferences) {
          category = await CategoryService.fetchCategory(category);
          store = await StoreService.fetchStore(store);
        }

        result.push({
          id: doc.id,
          productCode: doc.data()?.productCode,
          category,
          store,
          productAbbrev: doc.data()?.productAbbrev,
          name: doc.data()?.name,
          price: doc.data()?.price,
          isAvailable: doc.data()?.isAvailable,
          isAddons: doc.data()?.isAddons,
          description: doc.data()?.description,
          note: doc.data()?.note,
          subMenu: doc.data()?.subMenu,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },

  fetchProduct: async (id: string): Promise<ProductSchema> => {
    try {
      const ref = collection(db, constants.DB_PRODUCTS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          productCode: doc.data()?.productCode,
          categoryId: doc.data()?.categoryId,
          storeId: doc.data()?.storeId,
          productAbbrev: doc.data()?.productAbbrev,
          name: doc.data()?.name,
          price: doc.data()?.price,
          isAvailable: doc.data()?.isAvailable,
          isAddons: doc.data()?.isAddons,
          description: doc.data()?.description,
          note: doc.data()?.note,
          subMenu: doc.data()?.subMenu,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.createdAt,
        };
      }

      throw new Error('Store not found.');
    } catch (err: any) {
      throw err;
    }
  },

  fetchProductByProductCodes: async (productCodes: string[]): Promise<ProductSchema[]> => {
    try {
      let result: ProductSchema[] = [];
      const ref = collection(db, constants.DB_PRODUCTS);
      const qry = query(
        ref,
        where('isArchived', '==', false),
        where('productCode', 'in', productCodes)
      );

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        result.push({
          id: doc.id,
          productCode: doc.data()?.productCode,
          categoryId: doc.data()?.categoryId,
          storeId: doc.data()?.storeId,
          productAbbrev: doc.data()?.productAbbrev,
          name: doc.data()?.name,
          price: doc.data()?.price,
          isAvailable: doc.data()?.isAvailable,
          isAddons: doc.data()?.isAddons,
          description: doc.data()?.description,
          note: doc.data()?.note,
          subMenu: doc.data()?.subMenu,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.createdAt,
        });
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },
};

export default ProductService;
