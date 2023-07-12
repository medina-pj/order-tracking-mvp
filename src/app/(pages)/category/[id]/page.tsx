/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:22:16 pm
 * ---------------------------------------------
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import useCategory from '@/hooks/categories';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import CategoryService from '@/services/categories';

export default function Category() {
  const { id } = useParams();
  const router = useRouter();

  const { documents, updateDoc } = useCategory();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    try {
      (async function () {
        const currentCategory = await CategoryService.fetchCategory(id);
        setName(currentCategory?.name);
        setDescription(currentCategory?.description);
        setSequence(currentCategory?.sequence);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }
  }, [id]);

  const updateCategory = async () => {
    try {
      setError('');

      if (!name || !description) throw new Error('Store name is required.');

      setIsLoading(true);
      await updateDoc({ id, name, description, sequence });
      alert('Category successfully updated.');
      router.back();
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Update Category</p>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <Button loading={isLoading} label='Update' onClick={updateCategory} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
