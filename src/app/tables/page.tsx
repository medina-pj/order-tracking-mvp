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
import useTable from '@/hooks/tables';
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
  const { error, documents, createDoc, deleteDoc } = useTable();

  const [name, setName] = useState('');

  const createTable = async () => {
    if (!name) {
      alert('Name & Description is required.');
      return;
    }

    await createDoc({ name });

    if (error) {
      alert('Error occured.');
      return;
    }

    setName('');
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
      <Button label='Save Table' onClick={createTable} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{doc?.name}</TableCell>
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
