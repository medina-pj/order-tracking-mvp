'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: October 15th 2023, 6:18:37 pm
 * ---------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import {
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses, { IExpenses } from '@/hooks/expenses';
import useAuth from '@/hooks/auth';
import numeral from 'numeral';
import { UserTypes } from '@/types/schema/user';
import { DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function RecordExpenses() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const { documents: expensesDocs, filterExpenses, deleteDoc } = useExpenses();
  const { documents: storeDocs } = useStore();

  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [status, setStatus] = useState<ExpenseStatusEnum | 'all'>('all');

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
          filterExpenses({
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

  const onFilterExpenses = async () => {
    await filterExpenses({ startDate, endDate, store, status: status === 'all' ? '' : status });
  };

  const totalCost = useMemo(() => {
    return expensesDocs.reduce((acc: number, curr: IExpenses) => acc + +curr.unitPrice * +curr.quantity, 0);
  }, [expensesDocs]);

  const onDelete = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) return;

      await deleteDoc(id);
    } catch (err: any) {}
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
          <InputField
            type='date'
            label='Start Date (from 7am today)'
            value={startDate}
            onChange={setStartDate}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            type='date'
            label='End Date (until 5am the next day)'
            value={endDate}
            onChange={setEndDate}
          />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Status'
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: ExpenseStatusEnum.SETTLED, label: 'Settled' },
              { value: ExpenseStatusEnum.UNSETTLED, label: 'Un-Settled' },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <ButtonField label='Filter Records' onClick={onFilterExpenses} />
        </Grid>

        <Grid item xs={12}>
          <Table
            style={{
              backgroundColor: '#ededed',
              borderRadius: 5,
              marginTop: '1.5rem',
              marginBottom: '2.5rem',
            }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }}>Particulars</TableCell>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }} align='right'>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontFamily: 'inherit' }} align='right'>
                  Cost
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesDocs.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell
                    component='th'
                    scope='row'
                    sx={{ fontFamily: 'inherit' }}
                    onClick={() => router.push('/expenses/' + d.id)}>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 14,
                      }}>
                      {d?.category?.name?.toUpperCase() || 'OTHERS (OLD)'}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 10,
                      }}>
                      {d?.particulars?.toUpperCase()}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 10,
                      }}>
                      {d?.description?.toUpperCase()}
                    </Typography>
                    <Typography
                      color={'text.secondary'}
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 14,
                      }}>
                      {`P${numeral(d.unitPrice).format('0,0.00')} / ${d.unit}`}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'inherit', fontSize: 14 }} align='right'>
                    {numeral(d.quantity).format('0,0')}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'inherit', fontSize: 14 }} align='right'>
                    P{numeral(+d.quantity * +d.unitPrice).format('0,0.00')}
                  </TableCell>
                  <TableCell align='center' style={{ padding: 0, width: '20px' }}>
                    <IconButton onClick={() => onDelete(d.id)}>
                      <DeleteForever style={{ color: '#ea6655' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 16 }}>
                  Total
                </TableCell>
                <TableCell align='right' sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 16 }}>
                  P{numeral(totalCost).format('0,0.00')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
}
