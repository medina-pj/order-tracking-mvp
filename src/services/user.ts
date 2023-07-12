/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 9:07:48 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { db } from '@/config/firebase';
import constants from '@/utils/constants';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { UserSchema } from '@/types/schema/user';

const UserService = {
  fetchUser: async (id: string): Promise<UserSchema> => {
    try {
      const ref = collection(db, constants.DB_ADMINS);
      const qry = query(ref, where('isArchived', '==', false), where(documentId(), '==', id));

      const qrySnapshot = await getDocs(qry);

      for (const doc of qrySnapshot.docs) {
        return {
          id: doc.id,
          username: doc.data()?.username,
          name: doc.data()?.name,
          contactNumber: doc.data()?.contactNumber,
          userType: doc.data()?.userType,
          createdAt: doc.data()?.createdAt,
          updatedAt: doc.data()?.updatedAt,
        };
      }

      throw new Error('User not found.');
    } catch (err: any) {
      throw err;
    }
  },
};

export default UserService;
