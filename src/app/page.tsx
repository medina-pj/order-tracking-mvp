'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { db } from '../config/firebase';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';

export default function Home() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const addCategories = async () => {
    if (!name || !description) return;

    const categoryPayload = {
      _id: uuid(),
      name,
      description,
      createdAt: Date.now(),
      isArchived: false,
    };

    const createCategory = await addDoc(collection(db, 'categories'), categoryPayload);

    setName('');
    setDescription('');
    console.log(createCategory);
  };

  const fetchCategories = async () => {
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
      <input placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
      <input
        placeholder='Description'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={fetchCategories}>Category Pages</button>
      <button onClick={addCategories}>Save Category</button>
    </div>
  );
}
