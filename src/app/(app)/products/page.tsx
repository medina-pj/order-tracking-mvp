'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 4th 2023, 7:55:32 pm
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
  const { documents, createDoc, deleteDoc } = useProduct();

  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const createProduct = async () => {
    try {
      setError('');

      if (!name || !category) {
        alert('Name & Category is required.');
        return;
      }

      await createDoc({ name, description, categoryId: category });

      setName('');
      setDescription('');
      setCategory('');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError('');

      if (!confirm('Are you sure you want to delete this record?')) return;

      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Description' value={description} onChange={setDescription} />
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
      <p>{error}</p>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{doc?.name}</TableCell>
                <TableCell>{doc?.description}</TableCell>
                <TableCell>{doc?.category?.name}</TableCell>
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
