/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 1:36:36 pm
 * ---------------------------------------------
 */

export type CategorySchema = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

export type ProductSchema = {
  id?: string;
  productCode: string;
  name: string;
  description?: string;
  addOns: string[];
  categoryId: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
