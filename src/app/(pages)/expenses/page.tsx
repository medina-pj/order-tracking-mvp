'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 17th 2023, 9:55:15 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import { Container, Grid, Typography } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useCategory from '@/hooks/categories';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses from '@/hooks/expenses';

export default function RecordExpenses() {
  const { createDoc } = useExpenses();
  const { documents: storeDocs } = useStore();
  const { documents: categoryDocs } = useCategory();

  const [store, setStore] = useState('default');
  const [category, setCategory] = useState('default');
  const [otherCategory, setOtherCategory] = useState('');
  const [particulars, setParticulars] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [status, setStatus] = useState<ExpenseStatusEnum>(ExpenseStatusEnum.SETTLED);
  const [paymentDue, setPaymentDue] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState('');

  const onRecordExpenses = async () => {
    try {
      console.log('saving...');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <DropdownField
            label='Store'
            value={store}
            onChange={(e: any) => setStore(e.target.value)}
            options={storeDocs
              .map((store: any) => ({
                value: store.id,
                label: store.name,
              }))
              .concat({
                value: 'default',
                label: 'Select Store',
              })}
          />
        </Grid>

        <Grid item xs={12}>
          <DropdownField
            label='Category'
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
            options={categoryDocs
              .map((category: any) => ({
                value: category.id,
                label: category.name,
              }))
              .concat({
                value: 'default',
                label: 'Select Category',
              })
              .concat({
                value: 'others',
                label: 'Others',
              })}
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
