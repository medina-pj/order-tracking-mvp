/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 16th 2023, 2:41:37 pm
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
  price: number;
  categoryId: string;
  description?: string;
  note?: string;
  isAvailable?: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

export type OrderItemsSchema = {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  createdAt?: number;
  updatedAt?: number;
};

export type OrderHistorySchema = {
  action: string;
  actor: string;
  timestamp: number;
};

export enum OrderStatus {
  RECEIVED = 'received',
  DECLINED = 'declined',
  PROCESSING = 'processing',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCEL = 'cancelled',
}

export type OrderSchema = {
  id?: string;
  orderId: string;
  notes: string;
  customerNotes: string;
  items: OrderItemsSchema[];
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

export type TableSchema = {
  id?: string;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
