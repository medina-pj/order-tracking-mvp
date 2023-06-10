/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 9:58:07 pm
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

export type OrderSchema = {
  id?: string;
  orderId: string;
  notes: string;
  customerNotes: string;
  items: OrderItemsSchema[];
  history: OrderHistorySchema[];
  type: 'dine_in' | 'take_out' | 'ordered_online';
  status: 'received' | 'declined' | 'processing' | 'served' | 'completed';
  orderPaid: boolean;
  discount?: number;
  data: {
    onlineOrderPlatform?: string;
  };
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
