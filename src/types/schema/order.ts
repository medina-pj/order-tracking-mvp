/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 8th 2023, 2:39:23 pm
 * ---------------------------------------------
 */

export enum OrderTypeEnum {
  DINE_IN = 'dine_in',
  TAKE_OUT = 'take_out',
}

export enum OrderStatusEnum {
  NEW = 'new',
  DECLINED = 'declined',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type CartAddOnsSchema = {
  productId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
  voided: boolean; // default false
};

export type CartItemsSchema = {
  productId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
  notes: number;
  addOns: CartAddOnsSchema[];
  voided: boolean; // default false
};

export type OrderHistorySchema = {
  action: string;
  actor: string;
  timestamp: number;
};

export type DiscountSchema = {
  type: string;
  amount: number;
};

export type OrderSchema = {
  id?: string;
  orderId: string;
  storeId: string;
  tableId: string;
  notes: string;
  customerNotes: string;
  type: OrderTypeEnum;
  status: OrderStatusEnum;
  items: CartItemsSchema[];
  history: OrderHistorySchema[];
  discount: DiscountSchema[];
  data: {
    orderedOnline?: boolean;
    onlineOrderPlatform?: string;
  };
  orderPaid: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};
