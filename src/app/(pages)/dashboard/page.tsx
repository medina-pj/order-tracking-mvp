'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 5th 2023, 1:09:08 am
 * ---------------------------------------------
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import { Box, Container, Grid, Typography } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';
import OrderCard from '@/components/OrderCard';

import useOrder from '@/hooks/orders';
import { OrderStatusEnum } from '@/types/schema/order';
import useStore from '@/hooks/store';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';

export default function Dashboard() {
  const router = useRouter();

  const { documents: orderDocs, filterOrders } = useOrder();
  const { documents: storeDocs } = useStore();
  const { userInfo } = useAuth();

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [status, setStatus] = useState<OrderStatusEnum | 'active' | 'all'>('active');
  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (storeDocs && storeDocs.length) {
      const filteredStores = storeDocs
        .filter((store: any) => {
          if (userInfo && userInfo?.userType === UserTypes.ADMIN) {
            return true;
          } else if (userInfo && userInfo.userType !== UserTypes.ADMIN) {
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

        if (store) {
          setStore(store.value);
          filterOrders({
            startDate,
            endDate,
            store: store.value,
            status: status === 'all' ? '' : status,
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDocs, userInfo]);

  const onfilterOrders = async () => {
    await filterOrders({ startDate, endDate, store, status: status === 'all' ? '' : status });
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
              { value: 'active', label: 'Active Orders' },
              { value: OrderStatusEnum.COMPLETED, label: 'Completed' },
              { value: OrderStatusEnum.NEW, label: 'New' },
              { value: OrderStatusEnum.CONFIRMED, label: 'Confirmed' },
              { value: OrderStatusEnum.PREPARING, label: 'Processing' },
              { value: OrderStatusEnum.SERVED, label: 'Served' },
              { value: OrderStatusEnum.DECLINED, label: 'Declined' },
              { value: OrderStatusEnum.CANCELLED, label: 'Cancelled' },
              { value: 'all', label: 'All Orders' },
            ]}
          />
        </Grid>

        <Grid item xs={12} style={{ marginTop: '1rem' }}>
          <ButtonField label='Search Orders' onClick={onfilterOrders} />
        </Grid>
      </Grid>

      {orderDocs.length > 0 ? (
        orderDocs.map((order, i) => (
          <div key={i}>
            <OrderCard
              orderCode={order.orderId}
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
        ))
      ) : (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>
          <Typography
            color={'text.secondary'}
            sx={{
              fontFamily: 'inherit',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: 24,
            }}>
            {`No Orders :(`}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
