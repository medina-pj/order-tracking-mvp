'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 10:58:01 am
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
  const { documents, createDoc, deleteDoc } = useCategory();
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [sequence, setSequence] = useState(0);
  const [description, setDescription] = useState('');

  const createCategory = async () => {
    try {
      setError('');

      if (!name || !description) {
        alert('Name & Description is required.');
        return;
      }

      await createDoc({ name, description, sequence });

      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const deleteCategory = async (id: string) => {
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
      <InputField label='Sequence' value={sequence} onChange={setSequence} />
      <Button label='Save Category' onClick={createCategory} />
      <p>{error}</p>
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
                <TableCell>{doc?.sequence}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => deleteCategory(doc.id)}>
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
