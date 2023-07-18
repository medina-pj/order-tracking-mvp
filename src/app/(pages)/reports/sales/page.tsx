'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 1:16:44 pm
 * ---------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useCategory from '@/hooks/categories';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses from '@/hooks/expenses';
import useAuth from '@/hooks/auth';
import numeral from 'numeral';
import useOrder, { IOrder } from '@/hooks/orders';
import { OrderStatusEnum, TCartAddOns, TCartItems } from '@/types/schema/order';
import { TAddOnProduct } from '@/types/schema/product';

const TableContent = ({ name, price, quantity, total }: any) => {
  return (
    <TableRow>
      <TableCell component='th' scope='row' sx={{ fontFamily: 'inherit' }}>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: 14,
          }}>
          {name}
        </Typography>
        <Typography
          color={'text.secondary'}
          sx={{
            fontFamily: 'inherit',
            fontSize: 14,
          }}>
          {price}
        </Typography>
      </TableCell>
      <TableCell sx={{ fontFamily: 'inherit', fontSize: 14 }} align='right'>
        {quantity}
      </TableCell>
      <TableCell sx={{ fontFamily: 'inherit', fontSize: 14 }} align='right'>
        {total}
      </TableCell>
    </TableRow>
  );
};

export default function RecordExpenses() {
  const { userInfo } = useAuth();
  const { documents: orderDocs, filterOrders } = useOrder();
  const { documents: expensesDocs, filterExpenses } = useExpenses();
  const { documents: storeDocs } = useStore();

  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

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
            status: '',
          });

          filterOrders({
            startDate,
            endDate,
            store: store.value,
            status: OrderStatusEnum.COMPLETED,
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDocs, userInfo]);

  const onFilterReport = async () => {
    await filterExpenses({ startDate, endDate, store, status: '' });
    await filterOrders({ startDate, endDate, store, status: OrderStatusEnum.COMPLETED });
  };

  const totalExpenses = useMemo(() => {
    return expensesDocs.reduce((acc, curr) => acc + +curr.unitPrice * +curr.quantity, 0);
  }, [expensesDocs]);

  const [totalSales, productTally] = useMemo(() => {
    let totalSales = 0;
    let productTally: { abbrev: string; name: string; quantity: number; price: number }[] = [];

    orderDocs.forEach((doc: IOrder) => {
      const gross = doc.cartItems.reduce((cartItemAcc: number, cartItem: TCartItems) => {
        const itemIndex = productTally.findIndex(
          (d: any) => d.abbrev === cartItem.productAbbrev && d.price === cartItem.price
        );

        if (itemIndex >= 0) {
          productTally[itemIndex]['quantity'] += cartItem.quantity;
        } else {
          productTally.push({
            abbrev: cartItem.productAbbrev,
            name: cartItem.productName,
            quantity: cartItem.quantity,
            price: cartItem.price,
          });
        }

        let totalAddOns = 0;
        if (cartItem?.addOns && cartItem?.addOns.length) {
          totalAddOns = cartItem.addOns.reduce((addOnAcc: number, addOn: TCartAddOns) => {
            const addOnIndex = productTally.findIndex(
              (d: any) => d.abbrev === addOn.productAbbrev && d.price === addOn.price
            );

            if (addOnIndex >= 0) {
              productTally[addOnIndex]['quantity'] += addOn.quantity;
            } else {
              productTally.push({
                abbrev: addOn.productAbbrev,
                name: addOn.productName,
                quantity: addOn.quantity,
                price: addOn.price,
              });
            }

            return addOnAcc + addOn.price * addOn.quantity * cartItem.quantity;
          }, 0);
        }

        return cartItemAcc + totalAddOns + cartItem.quantity * cartItem.price;
      }, 0);

      totalSales += gross;
    });

    return [totalSales, _.orderBy(productTally, ['quantity'], ['desc'])];
  }, [orderDocs]);

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
          <ButtonField label='Filter Records' onClick={onFilterReport} />
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: 'inherit',
              fontSize: 16,
              fontWeight: 600,
              marginTop: '1.5rem',
            }}>
            Sales
          </Typography>

          <Table
            style={{
              backgroundColor: '#ededed',
              borderRadius: 5,
              marginTop: '0.5rem',
              marginBottom: '1rem',
            }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }}>Product</TableCell>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }} align='right'>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }} align='right'>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productTally.map((d: any, i: number) => (
                <TableContent
                  key={i}
                  name={`${d.name.toUpperCase()} (${d.abbrev})`}
                  price={`P${numeral(d.price).format('0,0.00')}`}
                  quantity={numeral(d.quantity).format('0,0')}
                  total={`P${numeral(+d.quantity * +d.price).format('0,0.00')}`}
                />
              ))}
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  Total
                </TableCell>
                <TableCell align='right' sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  P{numeral(totalSales).format('0,0.00')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: 'inherit',
              fontSize: 16,
              fontWeight: 600,
              marginTop: '1.5rem',
            }}>
            Expenses
          </Typography>

          <Table
            style={{
              backgroundColor: '#ededed',
              borderRadius: 5,
              marginTop: '0.5rem',
              marginBottom: '2.5rem',
            }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }}>Particulars</TableCell>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }} align='right'>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontFamily: 'inherit', fontSize: 16 }} align='right'>
                  Cost
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesDocs.map((d: any, i: number) => (
                <TableContent
                  key={i}
                  name={d.particulars.toUpperCase()}
                  price={`P${numeral(d.unitPrice).format('0,0.00')} / ${d.unit}`}
                  quantity={numeral(d.quantity).format('0,0')}
                  total={`P${numeral(+d.quantity * +d.unitPrice).format('0,0.00')}`}
                />
              ))}
              <TableRow>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  Total
                </TableCell>
                <TableCell align='right' sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  P{numeral(totalExpenses).format('0,0.00')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  Gross
                </TableCell>
                <TableCell align='right' sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                  P{numeral(totalSales).format('0,0.00')}
                </TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 16 }}>
                  Net
                </TableCell>
                <TableCell align='right' sx={{ fontFamily: 'inherit', fontWeight: 600, fontSize: 16 }}>
                  P{numeral(totalSales - totalExpenses).format('0,0.00')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
}
