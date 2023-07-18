'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 1:18:40 pm
 * ---------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import { Container, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses, { IExpenses } from '@/hooks/expenses';
import useAuth from '@/hooks/auth';
import numeral from 'numeral';

export default function RecordExpenses() {
  const { userInfo } = useAuth();
  const { documents: expensesDocs, filterExpenses } = useExpenses();
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
                  <TableCell component='th' scope='row' sx={{ fontFamily: 'inherit' }}>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 14,
                      }}>
                      {d.particulars.toUpperCase()}
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
