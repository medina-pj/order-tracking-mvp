/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 3rd 2023, 9:28:58 pm
 * ---------------------------------------------
 */

const constants = {
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  DB_CATEGORIES: 'categories',
  DB_PRODUCTS: 'products',
  DB_ORDERS: 'orders',
  DB_TABLES: 'tables',
  DB_ADMINS: 'admins',
  DB_STORE: 'stores',
  DB_STORE_PRODUCT: 'store_products',
  DB_STORE_TABLE: 'store_table',
};

export default constants;
