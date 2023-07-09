'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 9th 2023, 4:38:55 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { useState } from 'react';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';
import useAdminAccount from '@/hooks/adminAccount';
import TableComponent from '@/components/Table';

export default function ManageAccount() {
  const { documents, createAccount } = useAdminAccount();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userType, setUserType] = useState('staff');
  const [error, setError] = useState('');

  const onCreateAccount = async () => {
    try {
      setError('');

      if (!username) {
        throw new Error('username is required.');
      }

      if (!password || password !== confirmPassword) {
        throw new Error('password is required / did not match.');
      }

      const payload = {
        username,
        password,
        name,
        contactNumber,
        userType,
      };

      await createAccount(payload);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
      <Button label='Create Account' onClick={onCreateAccount} />
      <p>{error}</p>

      <TableComponent
        label='User List'
        rows={documents.map(doc => ({
          label: doc.name,
          subLabel: doc.userType + ' - ' + doc.contactNumber,
        }))}
      />
    </Container>
  );
}
