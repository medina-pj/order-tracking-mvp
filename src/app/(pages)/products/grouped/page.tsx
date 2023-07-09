'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Tuesday July 4th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 1:24:09 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import {
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InputField from '@/components/TextField';
import Button from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct from '@/hooks/products';

import { TAddOnProduct } from '@/types/schema/product';
import useGroupedProduct, { ISaveGroupedProduct } from '@/hooks/groupedProducts';

export default function Products() {
  const { documents: stores } = useStore();
  const { documents: productsDocs } = useProduct();
  const { createDoc } = useGroupedProduct();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<TAddOnProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState(0);

  const onCreateGroupedProduct = async () => {
    try {
      if (!store || !name || !products.length) {
        alert('Input all required fields.');
        return;
      }

      const payload: ISaveGroupedProduct = {
        storeId: store,
        name,
        sequence,
        description,
        products,
      };

      await createDoc(payload);

      setName('');
      setSequence(0);
      setDescription('');
      setProducts([]);
      setSelectedProduct('');
      setPrice(0);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const onAddProduct = () => {
    if (!selectedProduct || !price) {
      alert('Product and price is required.');
      return;
    }

    setProducts((prevDocs: any) =>
      prevDocs.concat({
        productId: selectedProduct,
        price: price,
      })
    );
    setSelectedProduct('');
    setPrice(0);
  };

  const onRemoveProduct = (index: number) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return;
    }

    setProducts((prevDocs: any) => prevDocs.splice(index, 1));
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <FormControl fullWidth style={{ marginBottom: '10px' }}>
        <InputLabel id='store-select'>Store</InputLabel>
        <Select
          labelId='store-select'
          id='store-select-id'
          value={store}
          label='Select Store'
          onChange={e => {
            setProducts([]);
            setSelectedProduct('');
            setPrice(0);
            setStore(e.target.value);
          }}
        >
          {stores.map(store => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <FormControl fullWidth style={{ marginBottom: '10px' }}>
        <InputLabel id='products-select'>Store Products</InputLabel>
        <Select
          labelId='products-select'
          id='products-select-id'
          value={selectedProduct}
          label='Select Store Product'
          onChange={e => {
            const productDetails = productsDocs.find((d: any) => d.id === e.target.value);
            setPrice(productDetails?.price as number);
            setSelectedProduct(productDetails?.id as string);
          }}
        >
          {productsDocs
            // filter store add-ons products
            .filter((d: any) => d.store.id === store && d.isAddOns)
            // filter out selected add-ons products
            .filter((d: any) => !products.find((p: any) => d.id === p.productId))
            .map(product => (
              <MenuItem key={product.id} value={product.id}>
                {product.productAbbrev} - {product.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <InputField label='Price' value={price} onChange={setPrice} />
      <Button label='Add Product' onClick={onAddProduct} />

      <Button label='Save Product' onClick={onCreateGroupedProduct} />
      <p>{error}</p>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Abbrev</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((doc: any, i: number) => {
              const productDetails = productsDocs.find((d: any) => d.id === doc.productId);

              return (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{productDetails?.productAbbrev}</TableCell>
                  <TableCell>{productDetails?.name}</TableCell>
                  <TableCell>{doc?.price}</TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={() => onRemoveProduct(i)}>
                      <DeleteForeverIcon style={{ color: '#ea6655' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
