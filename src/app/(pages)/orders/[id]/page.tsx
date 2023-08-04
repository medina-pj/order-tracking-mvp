/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 16th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 5th 2023, 2:49:15 am
 * ---------------------------------------------
 */

'use client';

import { CSSProperties, useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import numeral from 'numeral';
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
  Button,
  ButtonGroup,
  Checkbox,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';
import DropdownField from '@/components/Dropdown';

import useStoreTable from '@/hooks/storeTable';
import useProduct, { IProduct } from '@/hooks/products';
import useOrder, { IUpdateOrder } from '@/hooks/orders';
import OrderService from '@/services/orders';
import {
  OrderPaymentMethodEnum,
  OrderPaymentStatusEnum,
  OrderTypeEnum,
  TCartAddOns,
  TCartItems,
} from '@/types/schema/order';
import _ from 'lodash';
import StoreService from '@/services/stores';
import { CartItemCard, MenuCard } from '../components';

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
  },
};

export default function Order() {
  const { id } = useParams();
  const router = useRouter();

  const { documents: products } = useProduct();
  const { documents: tables } = useStoreTable();
  const { updateOrder } = useOrder();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [store, setStore] = useState('');
  const [table, setTable] = useState('');
  const [type, setType] = useState<OrderTypeEnum>(OrderTypeEnum.DINE_IN);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPaid, setOrderPaid] = useState(false);
  const [cartEntries, setCartEntries] = useState<TCartItems[]>([]);
  const [cartItems, setCartItems] = useState<TCartItems[]>([]);

  useEffect(() => {
    try {
      (async function () {
        if (id) {
          const orderDetails = await OrderService.fetchOrder(id);
          const storeDetails = await StoreService.fetchStore(orderDetails.storeId);

          setStoreName(storeDetails.name);
          setStore(orderDetails.storeId);
          setTable(orderDetails.tableId);
          setType(orderDetails.type);
          setNotes(orderDetails.notes);
          setPaymentMethod(orderDetails?.payment?.modeOfPayment || '');
          setOrderPaid(orderDetails?.payment?.status === 'paid' ? true : false);
          setCartItems(orderDetails.cartItems);
        }
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const onUpdateOrder = async () => {
    try {
      if (!store || !table || !type || !cartItems.length) {
        alert('Input required fields.');
        return;
      }

      if (!window.confirm('Sure na?')) {
        return;
      }

      setIsLoading(true);
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

      const payload: IUpdateOrder = {
        id,
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
      };

      await updateOrder(payload);
      setIsLoading(false);
      alert('Order successfully updated.');
      router.back();
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message);
    }
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
      <Box>
        <InputField label='Store' value={storeName} disabled />
      </Box>

      <DropdownField
        label='Table'
        value={table}
        onChange={(e: any) => setTable(e.target.value)}
        options={tables
          .filter((d: any) => d.store.id === store)
          .map(table => ({ value: table.id, label: table.name }))}
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

      <div>
        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMore />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography style={{ ...globalStyles.typography, fontSize: '18px' }}>Menu</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Grid container spacing={2}>
              {filteredProducs.map((d: IProduct, index: number) => (
                <Grid item key={index} xs={6}>
                  <MenuCard key={index} product={d} cartItems={cartEntries} setCartItems={setCartEntries} />
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
            expandIcon={<ExpandMore />}
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Typography sx={{ ...globalStyles.typography, marginBottom: '1.5rem', fontSize: '18px' }}>
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
                </Box>

                <Box display='flex' alignItems='center' justifyContent='flex-start'>
                  <Typography
                    sx={{
                      ...globalStyles.typography,
                      fontSize: 18,
                      marginBottom: '1rem',
                      marginTop: '1rem',
                    }}
                    color='text.secondary'>
                    Total: P{numeral(total).format('0,0.00')}
                  </Typography>
                </Box>

                <ButtonField loading={isLoading} label='Update' onClick={onUpdateOrder} />
              </>
            ) : (
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography
                  sx={{ ...globalStyles.typography, fontSize: 18, marginBottom: '1.5rem' }}
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
