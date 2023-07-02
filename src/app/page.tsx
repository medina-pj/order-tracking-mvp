'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 2nd 2023, 8:43:01 am
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container } from '@mui/material';
import Button from '@/components/Button';
import InputField from '@/components/TextField';

import useAuth, { IAdminSignUp } from '@/hooks/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const { signup, login, logout } = useAuth();

  const onSignup = async () => {
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

    await signup(payload);
  };

  const onLogin = async () => {
    await login(username, password);
  };

  const onLogout = async () => {
    await logout();
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
      <Button label='Create User' onClick={onSignup} />
      <Button label='Login' onClick={onLogin} />
      <Button label='Logout' onClick={onLogout} />
    </Container>
  );
}
