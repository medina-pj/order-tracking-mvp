/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:14:44 am
 * ---------------------------------------------
 */

export type StoreSchema = {
  id?: string;
  name: string;
  location: string;
  contactNumber: string;
  staff: string[];
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

export type StoreTableSchema = {
  id?: string;
  storeId: string;
  name: string;
  isAvailable: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
