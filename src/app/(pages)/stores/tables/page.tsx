/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 31st 2023, 4:55:21 pm
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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import useStoreTable, { IStoreTable } from '@/hooks/storeTable';
import useStore from '@/hooks/store';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';
import TableComponent from '@/components/Table';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';

export default function Tables() {
  const { userInfo } = useAuth();
  const router = useRouter();

  const { documents: storeDocs } = useStore();
  const { documents, createDoc, deleteDoc } = useStoreTable();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [store, setStore] = useState('');
  const [name, setName] = useState('');

  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (storeDocs && storeDocs.length) {
      const filteredStores = storeDocs
        .filter((store: any) => {
          if (userInfo && userInfo?.userType === UserTypes.ADMIN) {
            return true;
          } else if (userInfo && userInfo.userType !== UserTypes.ADMIN) {
            return store?.staff.includes(userInfo?.id);
          }

          return false;
        })
        .map((store: any) => ({
          value: store.id,
          label: store.name,
        }));

      setStoreOptions(filteredStores);

      if (filteredStores && filteredStores.length) {
        const store = filteredStores[0];

        if (store) {
          setStore(store.value);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDocs, userInfo]);

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
        options={storeOptions}
      />
      <Button loading={isLoading} label='Save' onClick={createTable} />
      <i style={{ color: 'red' }}>{error}</i>

      <TableComponent
        label='Table List'
        rows={documents
          .filter((doc: IStoreTable) => doc.store.id === store)
          .map((doc: IStoreTable) => ({
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
