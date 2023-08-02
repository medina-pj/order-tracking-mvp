/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday August 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: August 2nd 2023, 3:44:45 pm
 * ---------------------------------------------
 */

'use client';

import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Manila');
import { Container, Grid, Typography } from '@mui/material';

import DropdownField from '@/components/Dropdown';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useCategory from '@/hooks/categories';
import { ExpenseStatusEnum } from '@/types/schema/expenses';
import useExpenses, { IUpdateExpenses } from '@/hooks/expenses';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';
import { useParams, useRouter } from 'next/navigation';
import ExpenseService from '@/services/expenses';

export default function Expenses() {
  const { id } = useParams();
  const router = useRouter();

  const { userInfo } = useAuth();
  const { updateDoc } = useExpenses();
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
  const [status, setStatus] = useState<ExpenseStatusEnum>(ExpenseStatusEnum.SETTLED);
  const [paymentDue, setPaymentDue] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState('');
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    try {
      (async function () {
        const currentExpense = await ExpenseService.fetchExpense(id);
        console.log(currentExpense);
        setStore(currentExpense?.storeId);
        setCategory(currentExpense?.categoryId || '');
        setOtherCategory(currentExpense?.otherCategory || '');
        setParticulars(currentExpense?.particulars);
        setDescription(currentExpense?.description || '');
        setUnit(currentExpense?.unit);
        setQuantity(currentExpense?.quantity);
        setUnitPrice(currentExpense?.unitPrice);
        setStatus(currentExpense?.status);
        setPaymentDue(moment(currentExpense?.paymentDue).format('YYYY-MM-DD'));
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }
  }, [id]);

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

  const updateExpense = async () => {
    try {
      if (!store || !particulars || !quantity || !unitPrice || !unit) {
        alert('Fillup required fields (store, quantity, unitPrice, unit).');
        return;
      }

      const payload: IUpdateExpenses = {
        id,
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

      await updateDoc(payload);

      setParticulars('');
      setDescription('');
      setUnit('');
      setQuantity(0);
      setUnitPrice(0);
      setStatus(ExpenseStatusEnum.SETTLED);
      setPaymentDue(moment().format('YYYY-MM-DD'));

      alert('Expense record successfully updated.');
      router.back();
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
            options={storeOptions}
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
          <ButtonField label='Update' onClick={updateExpense} />
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
