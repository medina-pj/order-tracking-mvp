/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 2nd 2023, 12:56:10 pm
 * ---------------------------------------------
 */
import { CSSProperties } from 'react';
import numeral from 'numeral';
import useOrder, { IOrder } from '@/hooks/orders';

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
import { OrderStatus } from '@/types/schema/order';

const OrderCard = ({ orderDetails }: { orderDetails: IOrder }) => {
  const { updateOrderStatus, updateOrderPaymentStatus } = useOrder();

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

  const totalAmount = orderDetails.items.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0);

  console.log({ orderDetails });

  return (
    <Card sx={{ minWidth: 275 }} style={cardStyle}>
      <CardContent>
        <Typography style={{ fontSize: '14px', fontWeight: '600', color: '#FF8B13' }}>
          {orderDetails?.orderId}
        </Typography>

        <Typography style={{ fontSize: '12px', fontWeight: '500', marginBottom: '10px' }}>
          {orderDetails?.createdAt}
        </Typography>

        <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#4fc3f7' }}>
          {tables.find(table => table.id === orderDetails.table)?.name.toUpperCase()}
        </Typography>

        <Typography style={{ fontSize: '12px', fontWeight: '600', color: '#4fc3f7' }}>
          ORDER {orderDetails.status.toUpperCase()}
        </Typography>

        <Typography style={{ fontSize: '12px', fontWeight: '600', marginBottom: '15px', color: '#4fc3f7' }}>
          {orderDetails?.orderPaid && `ORDER PAID`}
        </Typography>

        <Typography style={{ fontSize: '14px', fontWeight: '600' }}>Notes:</Typography>
        <Typography style={{ fontSize: '10px', fontWeight: '500' }}>Note: {orderDetails?.notes}</Typography>
        <Typography style={{ fontSize: '10px', fontWeight: '500', marginBottom: '20px' }}>
          Customer: {orderDetails?.customerNotes}
        </Typography>

        <Typography style={{ fontSize: '14px', fontWeight: '600' }}>Orders:</Typography>

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
                <b>P {numeral(totalAmount - orderDetails?.discount).format('0,0.00')}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        {!orderDetails?.orderPaid && (
          <>
            <Button
              variant='contained'
              size='small'
              fullWidth
              onClick={() => updateOrderPaymentStatus(orderDetails.id, true)}>
              Order Paid
            </Button>
          </>
        )}
      </CardActions>
      <CardActions>
        {orderDetails?.status === OrderStatus.RECEIVED && (
          <>
            <Button
              variant='contained'
              size='small'
              fullWidth
              color='warning'
              onClick={() => updateOrderStatus(orderDetails.id, OrderStatus.DECLINED)}>
              Decline Order
            </Button>
            <Button
              variant='contained'
              size='small'
              fullWidth
              onClick={() => updateOrderStatus(orderDetails.id, OrderStatus.PROCESSING)}>
              Processing
            </Button>
          </>
        )}

        {orderDetails?.status === OrderStatus.PROCESSING && (
          <>
            <Button
              variant='contained'
              size='small'
              fullWidth
              onClick={() => updateOrderStatus(orderDetails.id, OrderStatus.SERVED)}>
              Order Served
            </Button>
          </>
        )}

        {orderDetails?.status === OrderStatus.SERVED && (
          <>
            <Button
              variant='contained'
              size='small'
              fullWidth
              onClick={() => updateOrderStatus(orderDetails.id, OrderStatus.COMPLETED)}>
              Order Completed
            </Button>
          </>
        )}

        {![OrderStatus.DECLINED, OrderStatus.CANCEL].includes(orderDetails.status as OrderStatus) && (
          <>
            <Button
              variant='contained'
              size='small'
              fullWidth
              color='error'
              onClick={() => updateOrderStatus(orderDetails.id, OrderStatus.CANCEL)}>
              Cancel Order
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default OrderCard;
