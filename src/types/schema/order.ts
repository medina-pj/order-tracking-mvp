/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 15th 2023, 10:11:37 pm
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

export enum OrderPaymentStatusEnum {
  PAID = 'paid',
}

export enum OrderPaymentMethodEnum {
  CASH = 'cash',
  GCASH = 'gcash',
  ONLINE_BANK = 'online_banking',
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
  product?: any; // don't save to db; this is used in adding/modifying cart items
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

export type TOrderPayment = {
  modeOfPayment?: string;
  status?: string;
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
  cartItems: TCartItems[];
  history: TOrderHistory[];
  discount: TDiscount[];
  payment?: TOrderPayment;
  data?: TOrderData;
  createdAt?: number;
  updatedAt?: number;
};
