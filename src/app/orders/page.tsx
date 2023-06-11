'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 12:51:16 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useProduct from '@/hooks/products';
import useOrder, { ICreateOrder } from '@/hooks/orders';
import useTable from '@/hooks/tables';

export default function Home() {
  const { error, createOrder } = useOrder();
  const { documents: products } = useProduct();
  const { documents: tables } = useTable();

  const [type, setType] = useState('');
  const [onlineOrderPlatform, setOnlineOrderPlatform] = useState('');
  const [notes, setNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderPaid, setOrderPaid] = useState(false);
  const [product, setProduct] = useState('');
  const [productCode, setProductCode] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [table, setTable] = useState('');

  const [items, setItems] = useState<any[]>([]);

  const saveOrder = async () => {
    if (!items.length || !type) {
      alert('Order Type & Items is required.');
      return;
    }

    const payload = {
      type,
      orderPaid,
      notes,
      customerNotes,
      discount,
      items,
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
    setProduct('');
    setProductCode('');
    setPrice(0);
    setQuantity(1);
    setItems([]);
  };

  const addCartItem = () => {
    if (!product || !price || !quantity) {
      alert('Product, Price & Quantity is required.');
      return;
    }

    const productDetails = products.find((doc: any) => doc.id === product);

    if (!productDetails) {
      alert('Invalid selected product.');
      return;
    }

    const item = {
      productId: productDetails.id,
      productCode: productDetails.productCode,
      productName: productDetails.name,
      price,
      quantity,
    };

    setItems((prevState) => [...prevState, item]);
  };

  const removeCartItem = (index: number) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div>
      <select value={table} onChange={(e) => setTable(e.target.value)}>
        <option value={''}>Select Table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.name}
          </option>
        ))}
      </select>
      <br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value={''}>Select Type</option>
        <option value={'dine_in'}>Dine-In</option>
        <option value={'take_out'}>Take-Out</option>
        <option value={'ordered_online'}>Ordered Online</option>
      </select>
      <br />

      {type === 'ordered_online' && (
        <>
          <input
            placeholder='Online Platform'
            value={onlineOrderPlatform}
            onChange={(e) => setOnlineOrderPlatform(e.target.value)}
          />
          <br />
        </>
      )}

      <input
        placeholder='Note'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br />

      <input
        placeholder={`Customer's Note`}
        value={customerNotes}
        onChange={(e) => setCustomerNotes(e.target.value)}
      />
      <br />

      <input
        type='number'
        placeholder='Discount'
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />
      <br />

      <input
        type='checkbox'
        placeholder='Order Paid'
        checked={orderPaid}
        onChange={(e) => setOrderPaid(e.target.checked)}
      />
      <br />

      <br />
      <select
        value={product}
        onChange={(e) => {
          if (e.target.value) {
            const productDetails = products.find(
              (product: any) => product.id === e.target.value
            );

            setPrice(productDetails?.price || 0);
            setProductCode(productDetails?.productCode || 'Invalid');
            setProduct(e.target.value);

            return;
          }

          setPrice(0);
          setProduct(e.target.value);
        }}
      >
        <option value={''}>Select Product</option>
        {products.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br />

      <input placeholder='Product Code' value={productCode} readOnly />
      <br />

      <input
        type='number'
        placeholder='Price'
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <br />

      <input
        type='number'
        placeholder='Quantity'
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <br />
      <button onClick={addCartItem}>Add Item</button>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Items</th>
            <th>Price</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((doc: any, i: number) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{doc.productName}</td>
              <td>{doc.price}</td>
              <td>{doc.quantity}</td>
              <td>
                <button onClick={() => removeCartItem(i)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={saveOrder}>Save Order</button>
    </div>
  );
}
