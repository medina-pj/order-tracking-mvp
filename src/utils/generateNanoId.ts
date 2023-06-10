/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 5:38:40 pm
 * ---------------------------------------------
 */

import { customAlphabet } from 'nanoid';

const generateNanoId = (count = 8) => {
  const nanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', count);
  return nanoId();
};
export default generateNanoId;
