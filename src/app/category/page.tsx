'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 1:12:27 pm
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

export default function Home() {
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
    <Container>
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
