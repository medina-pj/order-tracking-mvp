/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Wednesday July 12th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 31st 2023, 5:06:09 pm
 * ---------------------------------------------
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox, Container, FormControlLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import InputField from '@/components/TextField';
import Button from '@/components/Button';
import DropdownField from '@/components/Dropdown';
import MultipleSelectChip from '@/components/MultipleSelect';

import useProduct, { IUpdateProduct } from '@/hooks/products';
import useCategory from '@/hooks/categories';
import useGroupedProduct from '@/hooks/groupedProducts';
import ProductService from '@/services/products';
import StoreService from '@/services/stores';

export default function ViewProduct() {
  const { id } = useParams();
  const router = useRouter();

  const { documents: categories } = useCategory();
  const { documents: sub_menu } = useGroupedProduct();

  const { updateDoc } = useProduct();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [storeName, setStoreName] = useState('');
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
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    try {
      (async function () {
        const currentProduct = await ProductService.fetchProduct(id);
        const store = await StoreService.fetchStore(currentProduct.storeId);

        setStoreName(store.name);
        setStore(currentProduct.storeId);
        setCategory(currentProduct.categoryId);
        setName(currentProduct.name);
        setProductAbbrev(currentProduct.productAbbrev);
        setPrice(currentProduct.price);
        setDescription(currentProduct.description);
        setNote(currentProduct.note);
        setSubMenu(currentProduct.subMenu);
        setIsAddOns(currentProduct.isAddOns);
        setIsAvailable(currentProduct.isAvailable);
      })();
    } catch (error) {
      alert('Error. Failed to load data.');
      router.back();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (sub_menu) {
      const subMenuOption = sub_menu
        .filter((d: any) => d.store.id === store)
        .map(submenu => ({ label: submenu.name!, value: submenu.id! }));

      setSubMenuOptions(subMenuOption);
    }
  }, [store, sub_menu]);

  const updateProduct = async () => {
    try {
      if (!store || !category || !name || !productAbbrev || !price)
        throw new Error('Store, category and product name, abbreviation and price are required.');

      setIsLoading(true);
      const payload: IUpdateProduct = {
        id,
        categoryId: category,
        storeId: store,
        productAbbrev: productAbbrev,
        name,
        price,
        isAddOns,
        description,
        note,
        subMenu: isAddOns ? [] : subMenu,
        isAvailable,
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
      <p style={{ fontSize: '22px' }}>Update Product</p>
      <InputField label='Name' value={storeName} disabled />

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
      <FormControlLabel
        control={<Checkbox checked={isAvailable} onChange={() => setIsAvailable(prev => !prev)} />}
        label='Is Available'
      />

      {!isAddOns && (
        <MultipleSelectChip
          label='Sub-Menu'
          value={subMenu}
          onChange={handleSubMenuChange}
          options={subMenuOptions}
        />
      )}

      <Button loading={isLoading} label='Update' onClick={updateProduct} />
      <i style={{ color: 'red' }}>{error}</i>
    </Container>
  );
}
