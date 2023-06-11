/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 1:59:04 pm
 * ---------------------------------------------
 */
import { CSSProperties } from 'react';
import numeral from 'numeral';
import { IOrder } from '@/hooks/orders';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useTable from '@/hooks/tables';

const OrderCard = ({ orderDetails }: { orderDetails: IOrder }) => {
  console.log({ orderDetails });

  const { documents: tables } = useTable();

  const cardStyle: CSSProperties = {
    backgroundColor: '#474E68',
    color: 'white',
    marginBottom: '20px',
  };

  const tableCellStyle: CSSProperties = {
    color: 'white',
    paddingLeft: 0,
    fontSize: '11px',
  };

  const totalAmount = orderDetails.items.reduce(
    (acc: any, curr: any) => acc + curr.price * curr.quantity,
    0
  );

  return (
    <Card sx={{ minWidth: 275 }} style={cardStyle}>
      <CardContent>
        <Typography
          style={{ fontSize: '14px', fontWeight: '600', color: '#FF8B13' }}
        >
          {orderDetails?.orderId}
        </Typography>

        <Typography
          style={{ fontSize: '12px', fontWeight: '600', color: '#FF8B13' }}
        >
          Table: {tables.find((table) => table.id === orderDetails.table)?.name}
        </Typography>
        <Typography
          style={{ fontSize: '12px', fontWeight: '500', marginBottom: '10px' }}
        >
          {orderDetails?.createdAt}
        </Typography>

        <Typography style={{ fontSize: '14px', fontWeight: '600' }}>
          Notes:
        </Typography>
        <Typography style={{ fontSize: '10px', fontWeight: '500' }}>
          Note: {orderDetails?.notes}
        </Typography>
        <Typography
          style={{ fontSize: '10px', fontWeight: '500', marginBottom: '20px' }}
        >
          Customer: {orderDetails?.customerNotes}
        </Typography>

        <Typography style={{ fontSize: '14px', fontWeight: '600' }}>
          Orders:
        </Typography>

        <Table>
          <TableBody>
            {orderDetails.items.map((doc: any, i: number) => (
              <TableRow key={i}>
                <TableCell align='left' style={tableCellStyle}>
                  {doc?.productName}
                </TableCell>
                <TableCell align='right' style={tableCellStyle}>
                  {doc?.quantity}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align='left' style={tableCellStyle}>
                Discount:
                <b>P {numeral(orderDetails?.discount).format('0,0.00')}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align='left' style={tableCellStyle}>
                Total Amount:
                <b>
                  P{' '}
                  {numeral(totalAmount - orderDetails?.discount).format(
                    '0,0.00'
                  )}
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
};

export default OrderCard;
