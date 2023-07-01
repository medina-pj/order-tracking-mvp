'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 1st 2023, 4:23:53 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container, Grid, MenuItem, Select, TextField, Button, FormControl } from '@mui/material';

import useOrder from '@/hooks/orders';
import OrderCard from '@/components/OrderCard';

import { OrderStatus } from '@/types/schema';

import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

export default function Login() {
  const { error, documents, searchOrder } = useOrder();
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [status, setStatus] = useState('default');

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p>Hello World</p>
    </Container>
  );
}
