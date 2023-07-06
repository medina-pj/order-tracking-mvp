/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 6th 2023, 11:07:22 pm
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
  isAvailble: boolean;
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
};
