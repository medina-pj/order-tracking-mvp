/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:14:58 pm
 * ---------------------------------------------
 */

'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 4th 2023, 9:23:46 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import useStoreTable from '@/hooks/storeTable';
import useStore from '@/hooks/store';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';
import TableComponent from '@/components/Table';

export default function Tables() {
  const router = useRouter();

  const { documents: stores } = useStore();
  const { documents, createDoc, deleteDoc } = useStoreTable();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [store, setStore] = useState('');
  const [name, setName] = useState('');

  const createTable = async () => {
    try {
      if (!name) throw new Error('Store name is required.');

      setIsLoading(true);
      await createDoc({ storeId: store, name });
      alert('Table successfully created.');
      setName('');
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) return;
      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Create Table</p>
      <InputField label='Name' value={name} onChange={setName} />
      <DropdownField
        label='Select Store'
        value={store}
        onChange={(e: any) => setStore(e.target.value)}
        options={stores.map(store => ({ label: store.name, value: store.id }))}
      />
      <Button loading={isLoading} label='Save' onClick={createTable} />
      <i style={{ color: 'red' }}>{error}</i>

      <TableComponent
        label='Table List'
        rows={documents.map(doc => ({
          id: doc.id,
          label: `${doc.name} (${doc?.isAvailable ? 'Available' : 'Not Available'})`,
          subLabel: doc.store.name || '',
        }))}
        onDelete={deleteTable}
        onSelect={(id: string) => router.push('/stores/tables/' + id)}
      />
    </Container>
  );
}
