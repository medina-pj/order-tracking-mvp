'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: June 29th 2023, 6:46:39 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useCategory from '@/hooks/categories';
import useProduct from '@/hooks/products';
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

export default function Product() {
  const { documents: categories } = useCategory();
  const { error, documents, createDoc, deleteDoc } = useProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');

  const createProduct = async () => {
    if (!name || !category || !price) {
      alert('Name, Price & Category is required.');
      return;
    }

    await createDoc({ name, description, price, note, categoryId: category });

    if (error) {
      alert('Error occured.');
      return;
    }

    setName('');
    setPrice(0);
    setDescription('');
    setNote('');
    setCategory('');
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    await deleteDoc(id);

    if (error) {
      alert('Error occured.');
      return;
    }
  };

  console.log({
    products: documents,
    categories,
  });

  return (
    <Container style={{ marginTop: '2rem' }}>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Price' value={price} onChange={setPrice} type='number' />
      <InputField label='Description' value={description} onChange={setDescription} />
      <InputField label='Note' value={note} onChange={setNote} />
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id='category-select'>Category</InputLabel>
        <Select
          labelId='category-select'
          id='category-select-id'
          value={category}
          label='Select Category'
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button label='Save Product' onClick={createProduct} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{doc?.name}</TableCell>
                <TableCell>{doc?.description}</TableCell>
                <TableCell align='right'>
                  <IconButton>
                    <DeleteForeverIcon
                      style={{ color: '#ea6655' }}
                      onClick={() => deleteProduct(doc.id)}
                    />
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
