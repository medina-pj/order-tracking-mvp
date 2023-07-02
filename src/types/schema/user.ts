/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 11:34:14 am
 * ---------------------------------------------
 */

export type UserSchema = {
  id?: string;
  authId?: string;
  username: string;
  name: string;
  contactNumber: string;
  userType: 'admin' | 'staff';
  createdBy?: string;
  createdAt?: number | string;
  updatedAt?: number | string;
  isArchived?: boolean;
};
