'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 15th 2023, 1:04:22 pm
 * ---------------------------------------------
 */

import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
moment.tz.setDefault('Asia/Manila');

import { Container, Grid, MenuItem, Select, TextField, Button, FormControl } from '@mui/material';

import useOrder from '@/hooks/orders';
import { OrderStatusEnum } from '@/types/schema/order';
import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';
import useStore from '@/hooks/store';
import useAuth from '@/hooks/auth';

export default function Dashboard() {
  const { documents: orderDocs, searchOrder } = useOrder();
  const { documents: storeDocs } = useStore();
  const { userInfo } = useAuth();

  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [status, setStatus] = useState('default');
  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (storeDocs && storeDocs.length) {
      const filteredStores = storeDocs
        .filter((store: any) => {
          if (userInfo && userInfo?.userType === 'admin') {
            return true;
          } else if (userInfo && userInfo.userType !== 'admin') {
            return store?.staff.includes(userInfo?.id);
          }

          return false;
        })
        .map((store: any) => ({
          value: store.id,
          label: store.name,
        }));

      setStoreOptions(filteredStores);

      if (filteredStores && filteredStores.length) {
        const store = filteredStores[0];
        setStore(store.value);
      }
    }
  }, [storeDocs, userInfo]);

  const onSearchOrder = async () => {
    await searchOrder({ startDate, endDate, store, status: status === 'default' ? '' : status });
  };

  console.log({ orderDocs, storeDocs, userInfo });

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <DropdownField
            label='Store'
            value={store}
            onChange={(e: any) => setStore(e.target.value)}
            options={storeOptions}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            type='date'
            label='Start Date'
            value={startDate}
            onChange={(e: any) => setStartDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            type='date'
            label='End Date'
            value={endDate}
            onChange={(e: any) => setEndDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Order Status'
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { value: OrderStatusEnum.COMPLETED, label: 'Completed' },
              { value: OrderStatusEnum.NEW, label: 'New' },
              { value: OrderStatusEnum.CONFIRMED, label: 'Confirmed' },
              { value: OrderStatusEnum.PREPARING, label: 'Processing' },
              { value: OrderStatusEnum.SERVED, label: 'Served' },
              { value: OrderStatusEnum.DECLINED, label: 'Declined' },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <ButtonField label='Search Orders' onClick={onSearchOrder} />
        </Grid>

        {/* <Grid xs={12}>
          {documents.map((order: any, i: number) => (
            <OrderCard key={i} orderDetails={order} />
          ))}
        </Grid> */}
      </Grid>
    </Container>
  );
}
