/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 8:14:20 am
 * ---------------------------------------------
 */

export enum OrderStatus {
  RECEIVED = 'received',
  DECLINED = 'declined',
  PROCESSING = 'processing',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCEL = 'cancelled',
}

export type UserSchema = {
  id?: string;
  authId?: string;
  username: string;
  name: string;
  contactNumber: string;
  userType: 'admin' | 'staff';
  createdBy?: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

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
};

export type StoreSchema = {
  id?: string;
  name: string;
  location: string;
  contactNumber: string;
  staff: string[];
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

export type CartAddOnsSchema = {
  storeProductId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
};

export type CartItemsSchema = {
  storeProductId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
  notes?: number;
  addOns?: CartAddOnsSchema[];
  createdAt?: number;
  updatedAt?: number;
};

export type OrderHistorySchema = {
  action: string;
  actor: string;
  timestamp: number;
};

export type OrderSchema = {
  id?: string;
  orderId: string;
  notes: string;
  customerNotes: string;
  items: CartItemsSchema[];
  history: OrderHistorySchema[];
  table: string;
  type: 'dine_in' | 'take_out' | 'ordered_online';
  status: 'received' | 'declined' | 'processing' | 'served' | 'completed' | 'cancel';
  orderPaid: boolean;
  discount?: number;
  data: {
    onlineOrderPlatform?: string;
  };
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
