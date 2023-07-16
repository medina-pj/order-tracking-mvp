'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Tuesday July 4th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 11:20:39 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct from '@/hooks/products';

import { TAddOnProduct } from '@/types/schema/product';
import useGroupedProduct, { ISaveGroupedProduct } from '@/hooks/groupedProducts';
import DropdownField from '@/components/Dropdown';
import TableComponent from '@/components/Table';

export default function Products() {
  const router = useRouter();

  const { documents: stores } = useStore();
  const { documents: productsDocs } = useProduct();
  const { documents, createDoc, deleteDoc } = useGroupedProduct();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [store, setStore] = useState('');
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<TAddOnProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState(0);

  const onCreateGroupedProduct = async () => {
    try {
      if (!store || !name || !products.length) throw new Error('Store, name and products are required.');
      setIsLoading(true);
      const payload: ISaveGroupedProduct = {
        storeId: store,
        name,
        sequence,
        description,
        products,
      };

      await createDoc(payload);
      setIsLoading(false);
      alert('Product successfully created.');
      setName('');
      setSequence(0);
      setDescription('');
      setProducts([]);
      setSelectedProduct('');
      setPrice(0);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message);
    }
  };

  const deleteGroupProduct = async (id: string) => {
    try {
      setError('');

      if (!confirm('Are you sure you want to delete this record?')) return;

      await deleteDoc(id);
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

    const updatedItems = [...products];
    updatedItems.splice(index, 1);
    setProducts(updatedItems);
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Create Group Product</p>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => {
          setProducts([]);
          setSelectedProduct('');
          setPrice(0);
          setStore(e.target.value);
        }}
        options={stores.map(store => ({ label: store.name, value: store.id }))}
      />
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <DropdownField
        label='Store Products'
        value={selectedProduct}
        onChange={(e: any) => {
          const productDetails = productsDocs.find((d: any) => d.id === e.target.value);
          setPrice(productDetails?.price as number);
          setSelectedProduct(productDetails?.id as string);
        }}
        options={productsDocs
          // filter store add-ons products
          .filter((d: any) => d.store.id === store && d.isAddOns)
          // filter out selected add-ons products
          .filter((d: any) => !products.find((p: any) => d.id === p.productId))
          .map(product => ({ value: product.id, label: product.productAbbrev + ' - ' + product.name }))}
      />

      <InputField label='Price' value={price} onChange={setPrice} />
      <Button disabled={price && selectedProduct ? false : true} label='Add Product' onClick={onAddProduct} />

      <TableComponent
        rows={products.map((product, index) => {
          const productDetails = productsDocs.find((d: any) => d.id === product.productId);

          return {
            id: index,
            label: `${productDetails?.name} (${productDetails?.productAbbrev})`,
            subLabel: `P${product?.price}`,
          };
        })}
        onDelete={onRemoveProduct}
      />

      <Button loading={isLoading} label='Save' onClick={onCreateGroupedProduct} />
      <i style={{ color: 'red' }}>{error}</i>
      <TableComponent
        label='Group Product List'
        rows={documents
          .filter((d: any) => {
            if (!store) return true;
            return d.store.id === store;
          })
          .map(doc => {
            const totalCost = doc?.products.reduce((cur, acc) => cur + Number(acc.price), 0);
            return {
              id: doc?.id,
              label: `${doc?.name} - P${totalCost}`,
              subLabel: doc?.description,
              labelList: 'Products',
              list: doc.products.map(prod => `${prod.name}(${prod.productAbbrev}) - P${prod.price}`),
            };
          })}
        onDelete={deleteGroupProduct}
        onSelect={(id: string) => router.push('/products/groups/' + id)}
      />
    </Container>
  );
}
