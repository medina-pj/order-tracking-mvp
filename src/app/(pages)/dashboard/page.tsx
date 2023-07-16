'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 3:52:51 pm
 * ---------------------------------------------
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import { Container, Grid } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';
import OrderCard from '@/components/OrderCard';

import useOrder from '@/hooks/orders';
import { OrderStatusEnum } from '@/types/schema/order';
import useStore from '@/hooks/store';
import useAuth from '@/hooks/auth';

export default function Dashboard() {
  const router = useRouter();

  const { documents: orderDocs, searchOrder } = useOrder();
  const { documents: storeDocs } = useStore();
  const { userInfo } = useAuth();

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [status, setStatus] = useState<OrderStatusEnum | 'all'>('all');
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
    await searchOrder({ startDate, endDate, store, status: status === 'all' ? '' : status });
  };

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
          <InputField type='date' label='Start Date' value={startDate} onChange={setStartDate} />
        </Grid>

        <Grid item xs={12}>
          <InputField type='date' label='End Date' value={endDate} onChange={setEndDate} />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Order Status'
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: OrderStatusEnum.COMPLETED, label: 'Completed' },
              { value: OrderStatusEnum.NEW, label: 'New' },
              { value: OrderStatusEnum.CONFIRMED, label: 'Confirmed' },
              { value: OrderStatusEnum.PREPARING, label: 'Processing' },
              { value: OrderStatusEnum.SERVED, label: 'Served' },
              { value: OrderStatusEnum.DECLINED, label: 'Declined' },
              { value: OrderStatusEnum.CANCELLED, label: 'Cancelled' },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <ButtonField label='Search Orders' onClick={onSearchOrder} />
        </Grid>
      </Grid>

      {orderDocs.map((order, i) => (
        <div key={i}>
          <OrderCard
            orderId={order.id}
            table={order.table.name}
            type={order.type}
            products={order.cartItems}
            notes={order.notes}
            paymentStatus={order.payment?.status || ''}
            status={order.status}
            onEdit={() => router.push('/orders/' + order.id)}
          />
        </div>
      ))}
    </Container>
  );
}
