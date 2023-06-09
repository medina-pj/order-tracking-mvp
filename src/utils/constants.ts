/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 9th 2023, 8:53:12 pm
 * ---------------------------------------------
 */

const constants = {
  FIREBASE_API_KEY: <string>process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: <string>process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: <string>process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: <string>process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: <string>process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: <string>process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default constants;
