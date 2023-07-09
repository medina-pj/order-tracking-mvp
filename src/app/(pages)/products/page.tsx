'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Tuesday July 4th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 9th 2023, 2:42:00 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import {
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
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
import useProduct, { ISaveProduct } from '@/hooks/products';
import useCategory from '@/hooks/categories';
import DropdownField from '@/components/Dropdown';

export default function Products() {
  const { documents: stores } = useStore();
  const { documents: categories } = useCategory();
  const { documents, createDoc, deleteDoc } = useProduct();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [productAbbrev, setProductAbbrev] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [isAddOns, setIsAddOns] = useState(false);

  const onCreateProduct = async () => {
    try {
      if (!store || !category || !name || !productAbbrev || !price) {
        alert('Input all required fields.');
        return;
      }

      const payload: ISaveProduct = {
        categoryId: category,
        storeId: store,
        productAbbrev: productAbbrev,
        name,
        price,
        isAddOns,
        description,
        note,
        subMenu: [],
      };

      await createDoc(payload);

      setName('');
      setProductAbbrev('');
      setNote('');
      setDescription('');
      setPrice(0);
      setIsAddOns(false);
    } catch (err: any) {
      setError(err?.message);
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

  // console.log({ storeProducts });

  // const handleAddOnChange = (event: SelectChangeEvent<typeof addOns>) => {
  //   const {
  //     target: { value },
  //   } = event;

  //   setAddOns(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value
  //   );
  // };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => setStore(e.target.value)}
        options={stores.map(store => ({ value: store.id, label: store.name }))}
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

      {/* {isAddOn && (
        <FormControl style={{ marginBottom: '20px', minWidth: '100%' }}>
          <InputLabel id='add-ons-label'>Add-Ons</InputLabel>
          <Select
            labelId='add-ons-label'
            id='add-ons'
            multiple
            value={addOns}
            onChange={handleAddOnChange}
            input={<OutlinedInput label='Add-Ons' />}
            renderValue={selected => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {storeProducts.map(d => (
              <MenuItem key={d.id} value={d.productAbbrev}>
                <Checkbox checked={addOns.indexOf(d.productAbbrev as string) > -1} />
                <ListItemText primary={`${d?.product?.name} (${d?.productAbbrev})`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )} */}

      <Button label='Save Product' onClick={onCreateProduct} />
      <p>{error}</p>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Abbrev</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Store</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{doc?.name}</TableCell>
                <TableCell>{doc?.productAbbrev}</TableCell>
                <TableCell>{doc?.price}</TableCell>
                <TableCell>{doc?.category?.name}</TableCell>
                <TableCell>{doc?.store?.name}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => deleteProduct(doc.id)}>
                    <DeleteForeverIcon style={{ color: '#ea6655' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
