'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Thursday June 8th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 9th 2023, 8:58:16 pm
 * ---------------------------------------------
 */

import { Button } from '@mui/material';
import { db } from '../config/firebase';
import { collection, getDocs, query, onSnapshot, doc } from 'firebase/firestore';

export default async function Home() {
  const callFirebase = async () => {
    console.log('calling firebase');

    const ref = collection(db, 'categories');
    const q = query(ref);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log('EMPTY');
    }

    const account = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log({ categories: account });
  };

  return (
    <div>
      <Button onClick={callFirebase}>Category Pages</Button>
    </div>
  );
}
