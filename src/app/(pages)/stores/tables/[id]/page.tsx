/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 9th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:16:21 pm
 * ---------------------------------------------
 */

'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Container, FormControlLabel, Checkbox } from '@mui/material';
import InputField from '@/components/TextField';
import Button from '@/components/Button';

import useStoreTable from '@/hooks/storeTable';
import useStore from '@/hooks/store';
import TableService from '@/services/table';
import DropdownField from '@/components/Dropdown';

export default function ViewTable() {
  const { id } = useParams();
  const router = useRouter();

  const { updateDoc } = useStoreTable();
  const { documents: stores } = useStore();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    try {
      (async function () {
        const currentTable = await TableService.fetchTable(id);
        setStore(currentTable.storeId);
        setName(currentTable.name);
        setIsAvailable(currentTable.isAvailable);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }
  }, [id]);

  const updateTable = async () => {
    try {
      if (!name) throw new Error('Store name is required.');

      setIsLoading(true);
      await updateDoc({ id, storeId: store, name, isAvailable });
      alert('Table successfully updated.');
      setIsLoading(false);
      router.back();
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Update Table</p>
      <InputField label='Name' value={name} onChange={setName} />
      <DropdownField
        label='Store'
        value={store}
        options={stores.map(store => ({ label: store.name, value: store.id }))}
        disabled={true}
      />
      <FormControlLabel
        control={<Checkbox checked={isAvailable} onChange={() => setIsAvailable(prev => !prev)} />}
        label='Available'
      />
      <Button loading={isLoading} label='Update' onClick={updateTable} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
