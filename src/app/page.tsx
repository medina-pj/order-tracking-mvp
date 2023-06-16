'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday June 10th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 16th 2023, 1:18:11 pm
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
import useOrder from '@/hooks/orders';
import OrderCard from '@/components/OrderCard';
import NavBar from '@/components/NavBar';

export default function Home() {
  const { error, documents } = useOrder();

  console.log({
    orders: documents,
  });

  return (
    <>
      <Container style={{ marginTop: '20px' }}>
        {documents.map((order: any, i: number) => (
          <OrderCard key={i} orderDetails={order} />
        ))}
      </Container>
    </>
  );
}
