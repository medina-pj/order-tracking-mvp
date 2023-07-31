/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 31st 2023, 8:44:01 pm
 * ---------------------------------------------
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@mui/material';

import InputField from '@/components/TextField';
import Button from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct from '@/hooks/products';

import { TAddOnProduct } from '@/types/schema/product';
import useGroupedProduct, { ISaveGroupedProduct, IUpdateGroupedProduct } from '@/hooks/groupedProducts';
import DropdownField from '@/components/Dropdown';
import TableComponent from '@/components/Table';
import GroupedProductService from '@/services/groupedProducts';
import StoreService from '@/services/stores';

export default function Products() {
  const { id } = useParams();
  const router = useRouter();

  const { documents: stores } = useStore();
  const { documents: productsDocs } = useProduct();
  const { updateDoc } = useGroupedProduct();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [store, setStore] = useState('');
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<TAddOnProduct[]>([]);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    try {
      (async function () {
        const currentProduct = await GroupedProductService.fetchGroupProduct(id);
        const store = await StoreService.fetchStore(currentProduct.storeId);

        setStoreName(store.name);
        setStore(currentProduct.storeId);
        setName(currentProduct.name);
        setSequence(currentProduct.sequence);
        setDescription(currentProduct.description);
        setProducts(currentProduct.products);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onUpdateGroupedProduct = async () => {
    try {
      if (!store || !name || !products.length) throw new Error('Store, name and products are required.');

      setIsLoading(true);
      const payload: IUpdateGroupedProduct = {
        id,
        storeId: store,
        name,
        sequence,
        description,
        products,
      };

      await updateDoc(payload);
      setIsLoading(false);
      alert('Product successfully updated.');
      router.back();
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  const onAddProduct = () => {
    if (!selectedProduct || !price) {
      setError('Product and price are required.');
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
      <InputField label='Store' value={storeName} disabled />
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

      <Button loading={isLoading} label='Update' onClick={onUpdateGroupedProduct} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
