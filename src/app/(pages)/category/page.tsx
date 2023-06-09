'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:19:15 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import useCategory from '@/hooks/categories';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import TableComponent from '@/components/Table';

export default function Category() {
  const router = useRouter();

  const { documents, createDoc, deleteDoc } = useCategory();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');

  const createCategory = async () => {
    try {
      setError('');

      if (!name || !description) throw new Error('Store name is required.');

      setIsLoading(true);

      await createDoc({ name, description, sequence });
      alert('Category successfully created.');
      setName('');
      setDescription('');
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
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
      <p style={{ fontSize: '22px' }}>Create Category</p>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <Button loading={isLoading} label='Save' onClick={createCategory} />
      <i style={{ color: 'red' }}>{error}</i>

      <TableComponent
        label='Category List'
        rows={documents.map(doc => ({
          id: doc?.id,
          label: doc?.name,
          subLabel: doc?.description,
        }))}
        onDelete={deleteCategory}
        onSelect={(id: string) => router.push('/category/' + id)}
      />
    </Container>
  );
}
