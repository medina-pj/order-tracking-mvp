/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 6th 2023, 10:51:10 pm
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
  isAddons: boolean; //default is false
  description: string;
  note: string;
  subMenu: string[]; //array of productCode
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean; //default is false
};

export type TAddOnProduct = {
  productCode: string;
  price: number; //override the price of product
};

export type GroupedProductSchema = {
  id?: string;
  name: string;
  sequence: number;
  products: TAddOnProduct[];
  createdAt: number;
  updatedAt: number;
  isArchived: boolean; //default is false
};
