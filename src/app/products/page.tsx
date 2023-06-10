'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 10th 2023, 9:57:46 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useCategory from '@/hooks/categories';
import useProduct from '@/hooks/products';

export default function Home() {
  const { documents: categories } = useCategory();
  const { error, documents, createDoc, deleteDoc } = useProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');

  const createProduct = async () => {
    if (!name || !category || !price) {
      alert('Name, Price & Category is required.');
      return;
    }

    await createDoc({ name, description, price, note, categoryId: category });

    if (error) {
      alert('Error occured.');
      return;
    }

    setName('');
    setPrice(0);
    setDescription('');
    setNote('');
    setCategory('');
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    await deleteDoc(id);

    if (error) {
      alert('Error occured.');
      return;
    }
  };

  console.log({
    products: documents,
    categories,
  });

  return (
    <div>
      <input placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
      <br />
      <input
        type='number'
        placeholder='Price'
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />
      <br />
      <input
        placeholder='Description'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <input placeholder='Note' value={note} onChange={e => setNote(e.target.value)} />

      <br />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value={''}>Select Category</option>
        {categories.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br />
      <button onClick={createProduct}>Save Product</button>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Note</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc: any, i: number) => (
            <tr key={doc.id}>
              <td>{i + 1}</td>
              <td>{doc.productCode}</td>
              <td>{doc.name}</td>
              <td>{doc.category}</td>
              <td>{doc.price}</td>
              <td>{doc.note}</td>
              <td>{doc.description}</td>
              <td>
                <button onClick={() => deleteProduct(doc.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
