/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 9:49:23 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { GroupedProductSchema } from '@/types/schema/product';

const GroupedProductService = {
  fetchGroupProduct: async (id: string): Promise<GroupedProductSchema> => {
    try {
      const ref = collection(db, constants.DB_GROUPED_PRODUCT);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          storeId: doc.data()?.storeId,
          groupedProductCode: doc.data()?.groupedProductCode,
          name: doc.data()?.name,
          sequence: doc.data()?.sequence,
          description: doc.data()?.description,
          products: doc.data()?.products,
          isArchived: doc.data()?.isArchived,

          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('Grouped product not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default GroupedProductService;
