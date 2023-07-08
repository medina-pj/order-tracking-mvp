/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 8th 2023, 4:17:45 pm
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

export type TCartAddOns = {
  id: string; //use uuid() in fe to generate an id
  productId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
  voided: boolean; // default false
};

export type TCartItems = {
  id: string; //use uuid() in fe to generate an id
  productId: string;
  productCode: string;
  productName: string;
  productAbbrev: string;
  price: number;
  quantity: number;
  notes: number;
  addOns: TCartAddOns[];
  voided: boolean; // default false
};

export type TOrderHistory = {
  action: string;
  actor: string;
  timestamp: number;
};

export type TDiscount = {
  type: string;
  amount: number;
};

export type TOrderData = {
  orderedOnline?: boolean;
  onlineOrderPlatform?: string;
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
  items: TCartItems[];
  history: TOrderHistory[];
  discount: TDiscount[];
  data: TOrderData;
  orderPaid: boolean;
  createdAt?: number;
  updatedAt?: number;
};
