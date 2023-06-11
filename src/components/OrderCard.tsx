/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 1:07:28 pm
 * ---------------------------------------------
 */

import { IOrder } from '@/hooks/orders';

import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { CSSProperties } from 'react';

const OrderCard = ({ orderDetails }: { orderDetails: IOrder }) => {
  console.log({ orderDetails });

  const cardStyle: CSSProperties = {
    backgroundColor: '#474E68',
    color: 'white',
    marginBottom: '20px',
  };

  return (
    <Card sx={{ minWidth: 275 }} style={cardStyle}>
      <CardContent>
        <Typography sx={{ fontSize: 12 }} gutterBottom>
          Order Id: <b>{orderDetails?.orderId}</b>
        </Typography>
        <Typography variant='h5' component='div'>
          benevolent
        </Typography>
        <Typography sx={{ mb: 1.5 }}>adjective</Typography>
        <Typography variant='body2'>
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
