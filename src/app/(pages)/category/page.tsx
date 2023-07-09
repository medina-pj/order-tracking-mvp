'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 9th 2023, 5:23:07 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useCategory from '@/hooks/categories';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import TableComponent from '@/components/Table';

export default function Category() {
  const { documents, createDoc, deleteDoc } = useCategory();
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');

  const createCategory = async () => {
    try {
      setError('');

      if (!name || !description) {
        alert('Name & Description is required.');
        return;
      }

      await createDoc({ name, description, sequence });

      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError('');

      if (!confirm('Are you sure you want to delete this record?')) return;

      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <Button label='Save Category' onClick={createCategory} />
      <p>{error}</p>
      <TableComponent
        label='Category List'
        rows={documents.map(doc => ({
          id: doc?.id,
          label: doc?.name,
          subLabel: doc?.description,
        }))}
        onDelete={deleteCategory}
      />
    </Container>
  );
}
