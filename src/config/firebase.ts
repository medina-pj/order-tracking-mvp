/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Friday June 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 10:51:23 pm
 * ---------------------------------------------
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import constants from '../utils/constants';

const firebaseConfig = {
  apiKey: constants.FIREBASE_API_KEY,
  authDomain: constants.FIREBASE_AUTH_DOMAIN,
  projectId: constants.FIREBASE_PROJECT_ID,
  storageBucket: constants.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: constants.FIREBASE_MESSAGING_SENDER_ID,
  appId: constants.FIREBASE_APP_ID,
};

// init firebase
const app = initializeApp(firebaseConfig, 'Primary');

// init firebase auth
const auth = getAuth(app);

// init firestore
const db = getFirestore(app);

// init firestore storage
const storage = getStorage(app);

export { app, db, auth, storage, firebaseConfig, initializeApp };
