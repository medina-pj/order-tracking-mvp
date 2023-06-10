'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 6:19:30 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useCategory from '@/hooks/categories';

export default function Home() {
  const { error, documents, createDoc, deleteDoc } = useCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCategory = async () => {
    if (!name || !description) {
      alert('Name & Description is required.');
      return;
    }

    await createDoc({ name, description });

    if (error) {
      alert('Error occured.');
      return;
    }

    setName('');
    setDescription('');
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    await deleteDoc(id);

    if (error) {
      alert('Error occured.');
      return;
    }
  };

  console.log({
    categories: documents,
  });

  return (
    <div>
      <input placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
      <br />
      <input
        placeholder='Description'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <button onClick={createCategory}>Save Category</button>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc: any, i: number) => (
            <tr key={doc.id}>
              <td>{i + 1}</td>
              <td>{doc.name}</td>
              <td>{doc?.description}</td>
              <td>
                <button onClick={() => deleteCategory(doc.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
