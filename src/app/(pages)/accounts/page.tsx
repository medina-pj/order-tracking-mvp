'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 9:17:44 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';
import useAdminAccount from '@/hooks/adminAccount';
import TableComponent from '@/components/Table';

export default function ManageAccount() {
  const router = useRouter();

  const { documents, createAccount } = useAdminAccount();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userType, setUserType] = useState('staff');

  const onCreateAccount = async () => {
    try {
      setError('');

      if (!password || !username) {
        throw new Error('username / password is required.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords did not match.');
      }
      setIsLoading(true);
      const payload = {
        username,
        password,
        name,
        contactNumber,
        userType,
      };

      await createAccount(payload);
      alert('Account successfully created.');
      setIsLoading(false);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setContactNumber('');
      setUserType('staff');
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Create Account</p>
      <InputField label='Username' value={username} onChange={setUsername} />
      <InputField label='Password' value={password} onChange={setPassword} type='password' />
      <InputField
        label='Confirm Password'
        value={confirmPassword}
        onChange={setConfirmPassword}
        type='password'
      />
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />

      <DropdownField
        label='User Type'
        value={userType}
        onChange={(e: any) => setUserType(e.target.value)}
        options={[
          { value: 'staff', label: 'Staff' },
          { value: 'admin', label: 'Admin' },
        ]}
      />
      <Button loading={isLoading} label='Save' onClick={onCreateAccount} />
      <i style={{ color: 'red' }}>{error}</i>

      <TableComponent
        label='User List'
        rows={documents.map(doc => ({
          label: doc.name,
          subLabel: doc.userType + ' - ' + doc.contactNumber,
          id: doc.id,
        }))}
        onSelect={(id: string) => router.push('/accounts/' + id)}
      />
    </Container>
  );
}
