'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 4th 2023, 9:23:46 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
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
import useStoreTable from '@/hooks/storeTable';
import useStore from '@/hooks/store';

export default function Tables() {
  const { documents: stores } = useStore();
  const { documents, createDoc, deleteDoc } = useStoreTable();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(0);

  const createTable = async () => {
    try {
      if (!name) {
        alert('Name is required.');
        return;
      }

      await createDoc({ storeId: store, name, capacity });
      setName('');
      setCapacity(0);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) return;
      await deleteDoc(id);
    } catch (err: any) {
      setError(err?.message);
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <InputField label='Name' value={name} onChange={setName} />
      <InputField label='Capacity' value={capacity} onChange={setCapacity} />
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id='store-select'>Store</InputLabel>
        <Select
          labelId='store-select'
          id='store-select-id'
          value={store}
          label='Select Store'
          onChange={e => setStore(e.target.value)}
        >
          {stores.map(store => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button label='Save Table' onClick={createTable} />
      <p>{error}</p>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Store</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{doc?.name}</TableCell>
                <TableCell>{doc?.capacity}</TableCell>
                <TableCell>{doc?.store?.name}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => deleteTable(doc.id)}>
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
