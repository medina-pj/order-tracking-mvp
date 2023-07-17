/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Monday July 17th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 17th 2023, 10:08:09 pm
 * ---------------------------------------------
 */

export enum ExpenseStatusEnum {
  SETTLED = 'settled',
  UNSETTLED = 'unsettled',
}

export type ExpensesSchema = {
  id?: string;
  expensesCode: string;
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
