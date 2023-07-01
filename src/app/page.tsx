'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 1st 2023, 5:27:08 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container, Grid, MenuItem, Select, TextField, FormControl } from '@mui/material';
import Button from '@/components/Button';

import useOrder from '@/hooks/orders';
import OrderCard from '@/components/OrderCard';

import { OrderStatus } from '@/types/schema';

import moment from 'moment-timezone';
import InputField from '@/components/TextField';
import useAuth, { IAdminSignUp } from '@/hooks/auth';
moment.tz.setDefault('Asia/Manila');

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const { signUp } = useAuth();

  const onSignUp = async () => {
    if (!password || password !== confirmPassword) {
      alert('Password is required / password did not match.');
      return;
    }

    const payload: IAdminSignUp = {
      username,
      password,
      name,
      contactNumber,
    };

    const res = await signUp(payload);

    console.log({
      payload,
      res,
    });
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
      <Button label='Create User' onClick={onSignUp} />
    </Container>
  );
}
