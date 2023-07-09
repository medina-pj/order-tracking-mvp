/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:38:37 am
 * ---------------------------------------------
 */

export type CategorySchema = {
  id?: string;
  name: string;
  description: string;
  sequence: number;
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean; //default is false
};

export type ProductSchema = {
  id?: string;
  productCode: string;
  categoryId: string;
  storeId: string;
  productAbbrev: string;
  name: string;
  price: number;
  isAvailable: boolean; //default is true
  isAddOns: boolean; //default is false
  description: string;
  note: string;
  subMenu: string[]; //array of productCode
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean; //default is false
};

export type TAddOnProduct = {
  productId: string;
  price: number; //override the price of product
};

export type GroupedProductSchema = {
  id?: string;
  groupedProductCode: string;
  name: string;
  sequence: number;
  description: string;
  products: TAddOnProduct[];
  createdAt: number;
  updatedAt: number;
  isArchived: boolean; //default is false
};
