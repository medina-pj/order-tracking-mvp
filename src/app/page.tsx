'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 8th 2023, 12:00:15 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container } from '@mui/material';
import Button from '@/components/Button';
import InputField from '@/components/TextField';
import Image from 'next/image';
import useAuth from '@/hooks/auth';

import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const onLogin = async () => {
    try {
      setError('');

      if (!username || !password) {
        setError('username and password is required.');

        return;
      }

      await login(username, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.log(err?.message);
      setError('invalid username/password.');
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <div>
        <Image
          src={'/popsilog.jpeg'}
          alt='popsi'
          width={200}
          height={200}
          style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
      </div>

      <InputField label='Username' value={username} onChange={setUsername} />
      <InputField label='Password' value={password} onChange={setPassword} type='password' />

      <div style={{ marginTop: '15px' }}>
        <Button label='Login' onClick={onLogin} />
        <p>{error}</p>
      </div>
    </Container>
  );
}
