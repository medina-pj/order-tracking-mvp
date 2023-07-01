'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 1st 2023, 4:38:05 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { Container, Grid, MenuItem, Select, TextField, Button, FormControl } from '@mui/material';

import useOrder from '@/hooks/orders';
import OrderCard from '@/components/OrderCard';

import { OrderStatus } from '@/types/schema';

import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
moment.tz.setDefault('Asia/Manila');

export default function Dashboard() {
  const { error, documents, searchOrder } = useOrder();
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [status, setStatus] = useState('default');

  console.log({
    orders: documents,
  });

  const onSearchOrder = async () => {
    await searchOrder({ startDate, endDate, status: status === 'default' ? '' : status });
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Grid container direction='column'>
        <Grid xs={12}>
          <TextField
            label='Filter Start Date'
            size='small'
            type='date'
            fullWidth
            value={startDate}
            onChange={(e: any) => setStartDate(e.target.value)}
            InputProps={{
              style: {
                marginBottom: '20px',
                backgroundColor: '#eeeeee',
              },
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            label='Filter End Date'
            size='small'
            type='date'
            fullWidth
            value={endDate}
            onChange={(e: any) => setEndDate(e.target.value)}
            InputProps={{
              style: {
                marginBottom: '20px',
                backgroundColor: '#eeeeee',
              },
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid xs={12}>
          <FormControl fullWidth>
            <Select
              size='small'
              fullWidth
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              sx={{
                marginBottom: '20px',
                backgroundColor: '#eeeeee',
              }}
            >
              <MenuItem value='default'>Filter Status</MenuItem>
              <MenuItem value={OrderStatus.COMPLETED}>Completed</MenuItem>
              <MenuItem value={OrderStatus.RECEIVED}>Received</MenuItem>
              <MenuItem value={OrderStatus.PROCESSING}>Processing</MenuItem>
              <MenuItem value={OrderStatus.DECLINED}>Declined Orders</MenuItem>
              <MenuItem value={OrderStatus.SERVED}>Served Orders</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12}>
          <Button
            variant='contained'
            fullWidth
            onClick={onSearchOrder}
            style={{ marginBottom: '30px' }}
          >
            Search
          </Button>
        </Grid>

        <Grid xs={12}>
          {documents.map((order: any, i: number) => (
            <OrderCard key={i} orderDetails={order} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
