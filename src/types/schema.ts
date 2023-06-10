/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 6:11:23 pm
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
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  note?: string;
  isAvailable?: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

export type OrderSchema = {
  id: string;
  productId: string;
  productName: string;
  productDesc: string;
  productNote: string;
  price: number;
  quantity: number;
  createdAt?: number;
  updatedAt?: number;
};

export type TransactionHistorySchema = {
  action: string;
  actor: string;
  timestamp: string;
};

export type TransactionSchema = {
  id?: string;
  orderId: string;
  note: string;
  customerNotes: string;
  orders: [OrderSchema];
  history: [TransactionHistorySchema];
  type: ['dine_in', 'take_out', 'ordered_online'];
  status: ['received', 'declined', 'processing', 'served', 'completed'];
  orderPaid: boolean;
  data: {
    onlineOrderPlatform?: string;
  };
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
