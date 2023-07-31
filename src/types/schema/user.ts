/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 31st 2023, 3:31:18 pm
 * ---------------------------------------------
 */

export enum UserTypes {
  ADMIN = 'admin',
  STORE_MANAGER = 'store_manager',
  STAFF = 'staff',
}

export const formatUserTypes = {
  [UserTypes.ADMIN]: 'Admin',
  [UserTypes.STORE_MANAGER]: 'Store Manager',
  [UserTypes.STAFF]: 'Staff',
};

export type UserSchema = {
  id?: string;
  authId?: string;
  username: string;
  name: string;
  contactNumber: string;
  userType: UserTypes;
  createdBy?: string;
  createdAt?: number | string;
  updatedAt?: number | string;
  isArchived?: boolean;
};
