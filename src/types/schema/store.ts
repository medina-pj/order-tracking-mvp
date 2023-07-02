/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 11:17:42 am
 * ---------------------------------------------
 */

export type StoreSchema = {
  id?: string;
  name: string;
  location?: string;
  contactNumber?: string;
  staff?: string[];
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};

export type StoreTableSchema = {
  id?: string;
  storeId: string;
  isAvailble: boolean;
  capacity: number;
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};

export type StoreProductSchema = {
  id?: string;
  storeId: string;
  productId: string;
  producAbbrev: string;
  price: number;
  note?: string;
  isAvailable: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};
