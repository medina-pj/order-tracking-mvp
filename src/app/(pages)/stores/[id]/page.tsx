/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Thursday July 6th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 7th 2023, 8:49:29 pm
 * ---------------------------------------------
 */

'use client';

import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import InputField from '@/components/TextField';

import MultipleSelectChip from '@/components/MultipleSelect';
import Button from '@/components/Button';
import useAdminAccount from '@/hooks/adminAccount';
import useStore from '@/hooks/store';

export default function ViewStore() {
  const { id: storeId } = useParams();
  const router = useRouter();

  const { documents: users } = useAdminAccount();
  const { documents: stores, updateDoc } = useStore();

  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [staff, setStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (stores.length) {
      const currentStore = stores.find(store => store.id === storeId);
      if (currentStore) {
        setName(currentStore?.name);
        setLocation(currentStore?.location || '');
        setContactNumber(currentStore?.contactNumber || '');
        setStaff(currentStore?.staff || []);
      }
    }
  }, [stores, storeId]);

  useEffect(() => {
    if (users) {
      const userOptions = users.map(user => ({ label: user.name!, value: user.id! }));
      setStaffOptions(userOptions);
    }
  }, [users]);

  const handleStaffChange = (event: SelectChangeEvent<typeof staff>) => {
    const {
      target: { value },
    } = event;

    setStaff(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const updateStore = async () => {
    try {
      if (!name) {
        alert('Store name is required.');
        return;
      }

      setError('');

      if (storeId) {
        const payload = {
          id: storeId,
          name,
          location,
          contactNumber,
          staff,
        };

        await updateDoc(payload);
        alert('Store successfully updated.');
        router.back();
      } else setError('Invalid store');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  // console.log('params:', params);
  return (
    <Container style={{ marginTop: '2rem' }}>
      <p style={{ fontSize: '28px' }}>Update Store</p>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Location' value={location} onChange={setLocation} />
      <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />
      <MultipleSelectChip
        label='Staff'
        value={staff}
        onChange={handleStaffChange}
        options={staffOptions}
      />
      <Button label='Update' onClick={updateStore} />
      <p>{error}</p>
    </Container>
  );
}
