'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: October 15th 2023, 6:11:43 pm
 * ---------------------------------------------
 */
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');

import { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useCategory from '@/hooks/categories';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses, { ISaveExpenses } from '@/hooks/expenses';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';
import _ from 'lodash';

export default function Dashboard() {
  const { userInfo } = useAuth();
  const { createDoc } = useExpenses();
  const { documents: storeDocs } = useStore();
  const { documents: categoryDocs } = useCategory();

  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [particulars, setParticulars] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [recordDate, setRecordDate] = useState(moment(new Date()).format('YYYY-MM-DDTHH:mm').toString());
  const [status, setStatus] = useState<ExpenseStatusEnum>(ExpenseStatusEnum.SETTLED);
  const [paymentDue, setPaymentDue] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState('');
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
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDocs, userInfo]);

  const onRecordExpenses = async () => {
    try {
      if (!store || !particulars || !quantity || !unitPrice || !unit) {
        alert('Fillup required fields (store, quantity, unitPrice, unit).');
        return;
      }

      const payload: ISaveExpenses = {
        recordDate,
        storeId: store,
        categoryId: ['others', ''].includes(category) ? '' : category,
        otherCategory,
        particulars,
        description,
        unit,
        quantity,
        unitPrice,
        status,
        paymentDue: status === ExpenseStatusEnum.UNSETTLED ? paymentDue : '',
      };

      await createDoc(payload);

      setParticulars('');
      setDescription('');
      setUnit('');
      setQuantity(0);
      setUnitPrice(0);
      setStatus(ExpenseStatusEnum.SETTLED);
      setPaymentDue(moment().format('YYYY-MM-DD'));

      alert('Expense record successfully created.');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <InputField type='datetime-local' label='Date' value={recordDate} onChange={setRecordDate} />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Store'
            value={store}
            onChange={(e: any) => setStore(e.target.value)}
            options={storeOptions}
          />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Category'
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
            options={_.orderBy(categoryDocs, ['name'], ['asc']).map((category: any) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        </Grid>

        {category === 'others' && (
          <Grid item xs={12}>
            <InputField label='Other Category' value={otherCategory} onChange={setOtherCategory} />
          </Grid>
        )}

        <Grid item xs={12}>
          <InputField label='Particulars' value={particulars} onChange={setParticulars} />
        </Grid>

        <Grid item xs={12}>
          <InputField label='Description' value={description} onChange={setDescription} />
        </Grid>

        <Grid item xs={12}>
          <InputField label='Unit of Measurement' value={unit} onChange={setUnit} />
        </Grid>

        <Grid item xs={12}>
          <InputField label='Quantity' value={quantity} onChange={setQuantity} />
        </Grid>

        <Grid item xs={12}>
          <InputField label='Unit Price' value={unitPrice} onChange={setUnitPrice} />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Status'
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { value: ExpenseStatusEnum.SETTLED, label: 'Settled' },
              { value: ExpenseStatusEnum.UNSETTLED, label: 'Un-Settled' },
            ]}
          />
        </Grid>

        {status === ExpenseStatusEnum.UNSETTLED && (
          <Grid item xs={12}>
            <InputField type='date' label='Payment Due' value={paymentDue} onChange={setPaymentDue} />
          </Grid>
        )}

        <Grid item xs={12}>
          <ButtonField label='Record Expenses' onClick={onRecordExpenses} />
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ fontFamily: 'inherit', fontSize: 16, marginBottom: '1.5rem' }} color='error'>
            {error}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
