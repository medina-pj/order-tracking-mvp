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
