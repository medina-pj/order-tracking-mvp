/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday July 6th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 8:24:46 pm
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

export interface ISubMenu {
  productId: string;
  productCode: string;
  name: string;
  productAbbrev: string;
  price: number;
  isAvailable: boolean;
  isAddOns: boolean;
}

const ProductService = {
  fetchProducts: async (ids: string[], populateReferences = false): Promise<IProduct[]> => {
    try {
      let result: IProduct[] = [];

      if (!ids.length) return result;

      const ref = collection(db, constants.DB_PRODUCTS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', ids));

      const qrySnapshot = await getDocs(qry);

      const promises = qrySnapshot.docs.map(async (doc: any) => {
        let category = doc.data()?.categoryId;
        let store = doc.data()?.storeId;
        let subMenu = doc.data()?.subMenu;

        if (populateReferences) {
          category = await CategoryService.fetchCategory(category);
          store = await StoreService.fetchStore(store);
        }

        if (!doc.data()?.isAddOns && subMenu.length && populateReferences) {
          subMenu = await ProductService.fetchSubMenu(subMenu);
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
          isAddOns: doc.data()?.isAddOns,
          description: doc.data()?.description,
          note: doc.data()?.note,
          subMenu,
          createdAt: moment(doc.data()?.createdAt).format('MMM DD, YYYY hh:mma'),
          updatedAt: moment(doc.data()?.updatedAt).format('MMM DD, YYYY hh:mma'),
        });
      });

      await Promise.all(promises);

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
          isAddOns: doc.data()?.isAddOns,
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

  fetchSubMenu: async (groupProductIds: string[]): Promise<ISubMenu[]> => {
    try {
      let result: ISubMenu[] = [];
      const ref = collection(db, constants.DB_GROUPED_PRODUCT);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), 'in', groupProductIds));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        const productIds = doc.data()?.products.map((d: any) => d.productId);
        const products = await ProductService.fetchProducts(productIds);

        const productDetails = products.map((d: any) => ({
          productId: d.id,
          productCode: d.productCode,
          name: d.name,
          productAbbrev: d.productAbbrev,
          price: d.price,
          isAvailable: d.isAvailable,
          isAddOns: true,
        }));

        result.push(...productDetails);
      }

      return result;
    } catch (err: any) {
      throw err;
    }
  },
};

export default ProductService;
