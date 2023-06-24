'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 24th 2023, 11:04:47 pm
 * ---------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react';
import useProduct from '@/hooks/products';
import useOrder, { ICreateOrder } from '@/hooks/orders';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Container,
} from '@mui/material';
import useTable from '@/hooks/tables';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export default function Home() {
  const { error, createOrder } = useOrder();
  const { documents: products } = useProduct();
  const { documents: tables } = useTable();

  const [type, setType] = useState('dine_in');
  const [onlineOrderPlatform, setOnlineOrderPlatform] = useState('');
  const [notes, setNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderPaid, setOrderPaid] = useState(false);
  const [table, setTable] = useState('');

  const [items, setItems] = useState<any[]>([]);

  const dineType = [
    { name: 'Dine-In', id: 'dine-in' },
    { name: 'Take-Out', id: 'take_out' },
    { name: 'Ordered Online', id: 'ordered_online' },
  ];

  const setInitialItems = useCallback(() => {
    const initialItems = products.map(prod => ({
      productId: prod.id,
      productCode: prod.productCode,
      productName: prod.name,
      price: prod.price,
      quantity: 0,
    }));
    setItems(initialItems);
  }, [products]);

  useEffect(() => {
    setInitialItems();
  }, [products, setInitialItems]);

  const saveOrder = async () => {
    if (!items.length || !type) {
      alert('Order Type & Items is required.');
      return;
    }

    const filteredItem = items.filter(item => item.quantity > 0);
    const payload = {
      type,
      orderPaid,
      notes,
      customerNotes,
      discount: Number(discount),
      items: filteredItem,
      onlineOrderPlatform,
      table,
    };

    await createOrder(payload as ICreateOrder);

    if (error) {
      alert('Error occured.');
      return;
    }

    setType('');
    setOnlineOrderPlatform('');
    setNotes('');
    setCustomerNotes('');
    setDiscount(0);
    setOrderPaid(false);
    // setProduct('');
    // setProductCode('');
    // setPrice(0);
    // setQuantity(1);
    setInitialItems();
    setTable('');
  };

  // const addCartItem = () => {
  //   if (!product || !price || !quantity) {
  //     alert('Product, Price & Quantity is required.');
  //     return;
  //   }

  //   const productDetails = products.find((doc: any) => doc.id === product);

  //   if (!productDetails) {
  //     alert('Invalid selected product.');
  //     return;
  //   }

  //   const item = {
  //     productId: productDetails.id,
  //     productCode: productDetails.productCode,
  //     productName: productDetails.name,
  //     price,
  //     quantity,
  //   };

  //   setItems((prevState) => [...prevState, item]);
  // };

  // const removeCartItem = (index: number) => {
  //   if (!confirm('Are you sure you want to remove this item?')) return;
  //   setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  // };

  const onQuantityAdd = (index: number) => {
    const temp = [...items];
    temp[index].quantity = temp[index].quantity + 1;
    setItems(temp);
  };

  const onQuantityMinus = (index: number) => {
    const temp = [...items];
    if (temp[index].quantity > 0) temp[index].quantity = temp[index].quantity - 1;
    setItems(temp);
  };
  return (
    <Container style={{ marginTop: '2rem' }}>
      <FormControl fullWidth>
        <InputLabel id='table-select'>Table</InputLabel>
        <Select
          labelId='table-select'
          id='table-select-id'
          value={table}
          label='Select Table'
          onChange={e => setTable(e.target.value)}
        >
          {tables.map(table => (
            <MenuItem key={table.id} value={table.id}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
        <br />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id='type-select'>Dine Type</InputLabel>
        <Select
          labelId='type-select'
          id='type-select-id'
          value={type}
          label='Select Type'
          onChange={e => setType(e.target.value)}
        >
          {dineType.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type === 'ordered_online' && (
        <>
          <input
            placeholder='Online Platform'
            value={onlineOrderPlatform}
            onChange={e => setOnlineOrderPlatform(e.target.value)}
          />
          <br />
        </>
      )}

      <FormControl fullWidth>
        <br />
        <TextField
          id='note'
          label='Note'
          variant='standard'
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <br />
        <TextField
          id='customer_note'
          label={`Customer's Note`}
          variant='standard'
          value={customerNotes}
          onChange={e => setCustomerNotes(e.target.value)}
        />

        <br />
        <TextField
          id='discount'
          type='number'
          label='Discount'
          variant='standard'
          value={discount}
          onChange={e => setDiscount(Number(e.target.value))}
        />
      </FormControl>

      <br />

      <FormControlLabel
        control={<Checkbox checked={orderPaid} onChange={e => setOrderPaid(e.target.checked)} />}
        label='Order Paid'
      />

      <br />
      <Typography
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#FF8B13',
          textAlign: 'center',
        }}
      >
        ITEMS
      </Typography>
      {items.map((item, index) => (
        <div key={index}>
          <ProductCard
            productDetails={item}
            onAdd={() => onQuantityAdd(index)}
            onMinus={() => onQuantityMinus(index)}
          />
        </div>
      ))}
      <Typography
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#FF8B13',
          textAlign: 'center',
        }}
      >
        TOTAL: P
        {items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0) - Number(discount) || 0}
      </Typography>
      <br />
      <Button label='Create Order' onClick={saveOrder} />
    </Container>
  );
}
