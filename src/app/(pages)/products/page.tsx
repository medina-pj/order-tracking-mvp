'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Tuesday July 4th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 5th 2023, 2:36:55 am
 * ---------------------------------------------
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Container, FormControlLabel } from '@mui/material';
import InputField from '@/components/TextField';
import Button from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct, { ISaveProduct } from '@/hooks/products';
import useCategory from '@/hooks/categories';
import DropdownField from '@/components/Dropdown';
import useGroupedProduct from '@/hooks/groupedProducts';
import MultipleSelectChip from '@/components/MultipleSelect';
import { SelectChangeEvent } from '@mui/material/Select';
import TableComponent from '@/components/Table';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';
import _ from 'lodash';

export default function Products() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const { documents, createDoc, deleteDoc } = useProduct();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [productAbbrev, setProductAbbrev] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [isAddOns, setIsAddOns] = useState(false);
  const [subMenu, setSubMenu] = useState<string[]>([]);
  const [subMenuOptions, setSubMenuOptions] = useState<{ label: string; value: string }[]>([]);

  const { documents: storeDocs } = useStore();
  const { documents: categories } = useCategory();
  const { documents: subMenus } = useGroupedProduct();

  useEffect(() => {
    if (subMenus && store) {
      const subMenuOption = subMenus
        .filter((d: any) => d.store.id === store)
        .map(submenu => ({ label: submenu.name!, value: submenu.id! }));

      setSubMenuOptions(subMenuOption);
    }
  }, [subMenus, store]);

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

  const onCreateProduct = async () => {
    try {
      if (!store || !category || !name || !productAbbrev || !price)
        throw new Error('Store, category and product name, abbreviation and price are required.');

      setIsLoading(true);
      const payload: ISaveProduct = {
        categoryId: category,
        storeId: store,
        productAbbrev: productAbbrev,
        name,
        price,
        isAddOns,
        description,
        note,
        subMenu: isAddOns ? [] : subMenu,
      };

      await createDoc(payload);
      alert('Product successfully created.');
      setName('');
      setProductAbbrev('');
      setNote('');
      setDescription('');
      setPrice(0);
      setIsAddOns(false);
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) return;
      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const handleSubMenuChange = (event: SelectChangeEvent<typeof subMenu>) => {
    const {
      target: { value },
    } = event;

    setSubMenu(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <p style={{ fontSize: '22px' }}>Create Product</p>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => setStore(e.target.value)}
        options={storeOptions}
      />
      <DropdownField
        label='Category'
        value={category}
        onChange={(e: any) => setCategory(e.target.value)}
        options={categories.map(category => ({ value: category.id, label: category.name }))}
      />

      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Abbreviation' value={productAbbrev} onChange={setProductAbbrev} />
      <InputField label='Price' value={price} onChange={setPrice} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <InputField label='Note' value={note} onChange={setNote} />
      <FormControlLabel
        control={<Checkbox checked={isAddOns} onChange={() => setIsAddOns(prev => !prev)} />}
        label='Is Add-on'
      />

      {!isAddOns && (
        <MultipleSelectChip
          label='Sub-Menu'
          value={subMenu}
          onChange={handleSubMenuChange}
          options={subMenuOptions}
        />
      )}
      <Button loading={isLoading} label='Save' onClick={onCreateProduct} />
      <i style={{ color: 'red' }}>{error}</i>

      <TableComponent
        label='Product List'
        rows={_.orderBy(documents, ['name'], ['asc'])
          .filter((d: any) => {
            if (!store) return true;
            return d.store.id === store;
          })
          .map(doc => ({
            id: doc.id,
            label: `${doc?.name}(${doc?.productAbbrev}) - P${doc?.price}`,
            subLabel: doc?.store?.name,
            additionalData: doc?.category?.name,
          }))}
        onDelete={deleteProduct}
        onSelect={(id: string) => router.push('/products/' + id)}
      />
    </Container>
  );
}
