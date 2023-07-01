'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: June 29th 2023, 6:47:02 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import useCategory from '@/hooks/categories';
import {
  Container,
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

export default function Category() {
  const { error, documents, createDoc, deleteDoc } = useCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCategory = async () => {
    if (!name || !description) {
      alert('Name & Description is required.');
      return;
    }

    await createDoc({ name, description });

    if (error) {
      alert('Error occured.');
      return;
    }

    setName('');
    setDescription('');
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    await deleteDoc(id);

    if (error) {
      alert('Error occured.');
      return;
    }
  };

  console.log({
    categories: documents,
  });

  return (
    <Container style={{ marginTop: '2rem' }}>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Description' value={description} onChange={setDescription} />
      <Button label='Save Category' onClick={createCategory} />
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
                      onClick={() => deleteCategory(doc.id)}
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
