'use client';

/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:14:44 pm
 * ---------------------------------------------
 */

import { useEffect, useState } from 'react';

import useAdminAccount from '@/hooks/adminAccount';
import useStore from '@/hooks/store';

import { Container } from '@mui/material';
import InputField from '@/components/TextField';
import Button from '@/components/Button';
import MultipleSelectChip from '@/components/MultipleSelect';
import { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/navigation';
import TableComponent from '@/components/Table';

export default function Stores() {
  const router = useRouter();
  const { documents: stores, createDoc, deleteDoc } = useStore();
  const { documents: users } = useAdminAccount();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [staff, setStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (users) {
      const userOptions = users.map(user => ({ label: user.name!, value: user.id! }));
      setStaffOptions(userOptions);
    }
  }, [users]);

  const createStore = async () => {
    try {
      if (!name) throw new Error('Store name is required.');

      setIsLoading(true);
      setError('');

      const payload = {
        name,
        location,
        contactNumber,
        staff,
      };
      await createDoc(payload);
      alert('Store successfully created.');
      setName('');
      setLocation('');
      setContactNumber('');
      setStaff([]);
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  const deleteStore = async (id: string) => {
    try {
      setError('');

      if (!confirm('Are you sure you want to delete this record?')) return;

      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const handleStaffChange = (event: SelectChangeEvent<typeof staff>) => {
    const {
      target: { value },
    } = event;

    setStaff(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <>
      <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '22px' }}>Create Store</p>
        <InputField label='Name' value={name} onChange={setName} />
        <InputField label='Location' value={location} onChange={setLocation} />
        <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />
        <MultipleSelectChip label='Staff' value={staff} onChange={handleStaffChange} options={staffOptions} />
        <Button loading={isLoading} label='Save' onClick={createStore} />
        <i style={{ color: 'red' }}>{error}</i>
      </Container>

      <TableComponent
        label='Store List'
        rows={stores.map(store => ({
          id: store.id,
          label: store.name,
          subLabel: `${store?.location} - ${store?.contactNumber}`,
        }))}
        onDelete={deleteStore}
        onSelect={(id: string) => router.push('/stores/' + id)}
      />
    </>
  );
}
