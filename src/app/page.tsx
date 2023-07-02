'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 2nd 2023, 5:58:23 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container } from '@mui/material';
import Button from '@/components/Button';
import InputField from '@/components/TextField';

import useAuth from '@/hooks/auth';
import useAdminAccount from '@/hooks/adminAccount';

import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const { login, logout, user } = useAuth();
  const router = useRouter();

  // const onSignup = async () => {
  //   if (!password || password !== confirmPassword) {
  //     alert('Password is required / password did not match.');
  //     return;
  //   }

  //   const payload: IAdminSignUp = {
  //     username,
  //     password,
  //     name,
  //     contactNumber,
  //   };

  //   await signup(payload);
  // };

  const onLogin = async () => {
    await login(username, password);
    router.push('/dashboard');
  };

  const onLogout = async () => {
    await logout();
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <InputField label='Username' value={username} onChange={setUsername} />
      <InputField label='Password' value={password} onChange={setPassword} type='password' />
      {/* <InputField
        label='Confirm Password'
        value={confirmPassword}
        onChange={setConfirmPassword}
        type='password'
      /> */}
      {/* <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} /> */}
      {/* <Button label='Create User' onClick={onSignup} /> */}
      <Button label='Login' onClick={onLogin} />
      <Button label='Logout' onClick={onLogout} />
    </Container>
  );
}
