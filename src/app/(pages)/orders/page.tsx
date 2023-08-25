'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: August 13th 2023, 7:42:02 pm
 * ---------------------------------------------
 */

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct, { IProduct } from '@/hooks/products';
import numeral from 'numeral';
import {
  OrderPaymentMethodEnum,
  OrderPaymentStatusEnum,
  OrderTypeEnum,
  TCartAddOns,
  TCartItems,
} from '@/types/schema/order';

import useStoreTable from '@/hooks/storeTable';
import DropdownField from '@/components/Dropdown';
import useOrder, { ICreateOrder } from '@/hooks/orders';
import useAuth from '@/hooks/auth';
import _ from 'lodash';
import { UserTypes } from '@/types/schema/user';
import { CartItemCard, MenuCard } from './components';

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
    fontSize: 14,
  },
};

export default function Order() {
  const { userInfo } = useAuth();
  const { documents: storeDocs } = useStore();
  const { documents: products } = useProduct();
  const { documents: tables } = useStoreTable();
  const { createOrder } = useOrder();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [table, setTable] = useState('');
  const [type, setType] = useState<OrderTypeEnum>(OrderTypeEnum.DINE_IN);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPaid, setOrderPaid] = useState(false);
  const [cartEntries, setCartEntries] = useState<TCartItems[]>([]);
  const [cartItems, setCartItems] = useState<TCartItems[]>([]);
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);
  const [orderCompleted, setOrderCompleted] = useState(false);

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

  const onAddToCart = () => {
    if (cartEntries.length) {
      cartEntries.forEach((cartItem: any) => {
        for (let index = 1; index <= cartItem.quantity; index++) {
          setCartItems((prev: any) =>
            prev.concat({
              ...cartItem,
              quantity: 1,
              id: uuidv4(), // Generate a new UUID for each item
            })
          );
        }
      });

      setCartEntries([]);
    }
  };

  const onCreateOrder = async () => {
    try {
      if (!store || !table || !type || !cartItems.length) {
        alert('Input required fields.');
        return;
      }

      if (!window.confirm('Confirm order.')) {
        return;
      }

      const cart = cartItems.map((d: TCartItems) => ({
        id: d.id,
        productId: d.productId,
        productCode: d.productCode,
        productName: d.productName,
        productAbbrev: d.productAbbrev,
        price: d.price,
        quantity: d.quantity,
        notes: d.notes,
        addOns: d.addOns,
        voided: d.voided,
      }));

      const payload: ICreateOrder = {
        storeId: store,
        tableId: table,
        notes,
        customerNotes: '',
        type,
        cartItems: cart,
        payment: {
          modeOfPayment: paymentMethod as OrderPaymentMethodEnum,
          status: (orderPaid ? OrderPaymentStatusEnum.PAID : '') as OrderPaymentStatusEnum,
        },
        orderCompleted,
      };

      await createOrder(payload);

      setNotes('');
      setCartEntries([]);
      setCartItems([]);

      alert('Order created.');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const onChangeStore = (value: string) => {
    setTable('');
    setCartEntries([]);
    setCartItems([]);
    setStore(value);
  };

  const total = useMemo(() => {
    return cartItems.reduce((acc: any, curr: any) => {
      const qnty = curr.quantity;
      const price = curr.price;

      const addOnsTotal = curr.addOns.reduce((acc: number, curr: TCartAddOns) => {
        acc += curr.price * curr.quantity * qnty;
        return acc;
      }, 0);

      acc += Number(qnty) * Number(price) + Number(addOnsTotal);

      return acc;
    }, 0);
  }, [cartItems]);

  const filteredProducs = useMemo(() => {
    return _.orderBy(products, ['category.sequence', 'name'], ['asc', 'asc']).filter(
      (d: IProduct) => d.store.id === store
    );
  }, [products, store]);

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '5rem' }}>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => onChangeStore(e.target.value)}
        options={storeOptions.map(store => ({ value: store.value, label: store.label }))}
      />

      <DropdownField
        label='Order Type'
        value={type}
        onChange={(e: any) => setType(e.target.value)}
        options={[
          { value: OrderTypeEnum.DINE_IN, label: 'Dine In' },
          { value: OrderTypeEnum.TAKE_OUT, label: 'Take Out' },
        ]}
      />

      <DropdownField
        label='Table'
        value={table}
        onChange={(e: any) => setTable(e.target.value)}
        options={tables
          .filter((d: any) => d.store.id === store)
          .map(table => ({ value: table.id, label: table.name }))}
      />

      <div>
        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography style={{ ...globalStyles.typography, fontSize: 18, fontWeight: 600 }}>
              Menu
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Grid container spacing={2}>
              {filteredProducs.map((d: IProduct, index: number) => (
                <Grid item key={index} xs={6}>
                  <MenuCard product={d} cartItems={cartEntries} setCartItems={setCartEntries} />
                </Grid>
              ))}

              <Grid item xs={12}>
                <ButtonField label='Add To Cart' onClick={onAddToCart} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Typography
              sx={{ ...globalStyles.typography, marginBottom: '1.5rem', fontSize: 18, fontWeight: 600 }}>
              Cart
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            {cartItems.length ? (
              <>
                {cartItems.map((d: TCartItems, index: number) => (
                  <CartItemCard
                    key={index}
                    itemNo={index + 1}
                    cartItemId={d.id}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    products={products}
                  />
                ))}

                <Box>
                  <InputField label='Notes' value={notes} onChange={setNotes} />
                </Box>

                <Box>
                  <DropdownField
                    label='Mode Of Payment'
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    options={[
                      { value: OrderPaymentMethodEnum.CASH, label: 'Cash' },
                      { value: OrderPaymentMethodEnum.GCASH, label: 'G-Cash' },
                      { value: OrderPaymentMethodEnum.ONLINE_BANK, label: 'Online Bank' },
                    ]}
                  />
                </Box>

                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={orderPaid} onChange={() => setOrderPaid(prev => !prev)} />}
                    label='Paid Order'
                  />

                  <FormControlLabel
                    control={
                      <Checkbox checked={orderCompleted} onChange={() => setOrderCompleted(prev => !prev)} />
                    }
                    label='Completed Order'
                  />
                </Box>

                <Box display='flex' alignItems='center' justifyContent='flex-start'>
                  <Typography
                    sx={{
                      ...globalStyles.typography,
                      fontSize: 16,
                      marginBottom: '1rem',
                      marginTop: '1rem',
                    }}
                    color='text.secondary'>
                    TOTAL: P{numeral(total).format('0,0.00')}
                  </Typography>
                </Box>

                <ButtonField label='Create Order' onClick={onCreateOrder} />
              </>
            ) : (
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography
                  sx={{ ...globalStyles.typography, fontSize: 16, marginBottom: '1.5rem' }}
                  color='text.secondary'>
                  {`Cart Is Empty :(`}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        <Box display='flex' alignItems='center' justifyContent='center'>
          <Typography
            sx={{ ...globalStyles.typography, fontSize: 12, marginBottom: '1.5rem' }}
            color='text.secondary'>
            {error}
          </Typography>
        </Box>
      </div>
    </Container>
  );
}
