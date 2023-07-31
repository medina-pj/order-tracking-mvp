/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 31st 2023, 3:29:46 pm
 * ---------------------------------------------
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';

import useAdminAccount from '@/hooks/adminAccount';
import UserService from '@/services/user';
import { UserTypes } from '@/types/schema/user';

export default function ManageAccount() {
  const { id } = useParams();
  const router = useRouter();

  const { updateAccount } = useAdminAccount();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userType, setUserType] = useState('staff');

  useEffect(() => {
    try {
      (async function () {
        const currentUser = await UserService.fetchUser(id);
        setUsername(currentUser.username);
        setName(currentUser.name);
        setContactNumber(currentUser.contactNumber);
        setUserType(currentUser.userType);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onUpdateAccount = async () => {
    try {
      setError('');

      setIsLoading(true);
      const payload = {
        id,
        name,
        contactNumber,
        userType,
      };

      await updateAccount(payload);
      alert('Account successfully updated.');
      setIsLoading(false);
      router.back();
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Update Account</p>
      <InputField label='Username' disabled={true} value={username} />
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />
      <DropdownField
        label='User Type'
        value={userType}
        onChange={(e: any) => setUserType(e.target.value)}
        options={[
          { value: UserTypes.STAFF, label: 'Staff' },
          { value: UserTypes.STORE_MANAGER, label: 'Store Manager' },
          { value: UserTypes.ADMIN, label: 'Admin' },
        ]}
      />
      <Button loading={isLoading} label='Update' onClick={onUpdateAccount} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
