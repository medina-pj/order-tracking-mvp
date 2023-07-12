/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Thursday July 6th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:15:47 pm
 * ---------------------------------------------
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import InputField from '@/components/TextField';
import MultipleSelectChip from '@/components/MultipleSelect';
import Button from '@/components/Button';

import useAdminAccount from '@/hooks/adminAccount';
import useStore from '@/hooks/store';
import StoreService from '@/services/stores';

export default function ViewStore() {
  const { id } = useParams();
  const router = useRouter();

  const { documents: users } = useAdminAccount();
  const { updateDoc } = useStore();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [staff, setStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    try {
      (async function () {
        const currentStore = await StoreService.fetchStore(id);
        setName(currentStore.name);
        setLocation(currentStore.location);
        setContactNumber(currentStore.contactNumber);
        setStaff(currentStore.staff);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }
  }, [id]);

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
      if (!name) throw new Error('Store name is required.');

      setIsLoading(true);
      const payload = {
        id,
        name,
        location,
        contactNumber,
        staff,
      };

      await updateDoc(payload);
      alert('Store successfully updated.');
      setIsLoading(false);
      router.back();
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Update Store</p>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Location' value={location} onChange={setLocation} />
      <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />
      <MultipleSelectChip label='Staff' value={staff} onChange={handleStaffChange} options={staffOptions} />
      <Button loading={isLoading} label='Update' onClick={updateStore} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
