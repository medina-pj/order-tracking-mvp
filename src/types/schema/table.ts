/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 11:17:46 am
 * ---------------------------------------------
 */

export type TableSchema = {
  id?: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
};
