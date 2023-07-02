'use client';

/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 2nd 2023, 5:12:56 pm
 * ---------------------------------------------
 */

import { useEffect, useState } from 'react';

import useAdminAccount from '@/hooks/adminAccount';
import useAuth from '@/hooks/auth';
import useStore, { IStore } from '@/hooks/store';

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
import MultipleSelectChip from '@/components/MultipleSelect';
import { SelectChangeEvent } from '@mui/material/Select';

export default function Stores() {
  const { userInfo } = useAuth();
  const { error: storeError, documents: stores, createDoc, deleteDoc } = useStore();
  const { error: userError, documents: users } = useAdminAccount(userInfo!);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [staff, setStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (users) {
      const userOptions = users.map(user => ({ label: user.name!, value: user.id! }));
      setStaffOptions(userOptions);
    }
  }, [users]);

  const createStore = async () => {
    if (!name) {
      alert('Store name is required.');
      return;
    }

    const payload = {
      name,
      location,
      contactNumber,
      staff,
    };
    await createDoc(payload);

    if (storeError) {
      alert('Error occured.');
      return;
    }

    setName('');
    setLocation('');
    setContactNumber('');
    setStaff([]);
  };

  const deleteStore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    await deleteDoc(id);

    if (storeError) {
      alert('Error occured.');
      return;
    }
  };

  const handleStaffChange = (event: SelectChangeEvent<typeof staff>) => {
    const {
      target: { value },
    } = event;
    setStaff(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const renderStoreCell = (store: IStore) => {
    let staffNames = 'None';
    if (store?.staff?.length) {
      const userStaff = users
        //filter current users that are staff of current store
        .filter(user => store.staff?.find(staff => staff === user.id))
        .map(user => user?.name);
      staffNames = userStaff.join(', ');
    }
    return (
      <>
        <p>
          <b>{store?.name}</b>
          <br />
          {store?.location} - {store?.contactNumber}
          <br />
          <a style={{ color: 'gray' }}>Staff: {staffNames}</a>
        </p>
      </>
    );
  };

  return (
    <>
      <Container style={{ marginTop: '2rem' }}>
        <InputField label='Name' value={name} onChange={setName} />
        <InputField label='Location' value={location} onChange={setLocation} />
        <InputField label='Contact Number' value={contactNumber} onChange={setContactNumber} />
        <MultipleSelectChip label='Staff' value={staff} onChange={handleStaffChange} options={staffOptions} />
        <Button label='Save Store' onClick={createStore} />
      </Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Stores</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{renderStoreCell(store)}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => deleteStore(store.id)}>
                    <DeleteForeverIcon style={{ color: '#ea6655' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
