/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Monday July 17th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: August 2nd 2023, 3:06:27 pm
 * ---------------------------------------------
 */

export enum ExpenseStatusEnum {
  SETTLED = 'settled',
  UNSETTLED = 'unsettled',
}

export type ExpensesSchema = {
  id?: string;
  expensesCode?: string;
  storeId: string;
  categoryId?: string;
  otherCategory?: string;
  particulars: string;
  description?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  status: ExpenseStatusEnum;
  createdBy: string;
  paymentDue?: number; //date string
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean; //default is false
};
