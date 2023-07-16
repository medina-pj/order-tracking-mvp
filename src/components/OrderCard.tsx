/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 15th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 3:57:53 pm
 * ---------------------------------------------
 */
'use client';

import { Box, Button, ButtonGroup, Container, Typography } from '@mui/material';
import numeral from 'numeral';
import { CSSProperties, useState } from 'react';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { OrderPaymentMethodEnum, OrderPaymentStatusEnum, OrderStatusEnum } from '@/types/schema/order';
import useOrder, { OrderStatusPath } from '@/hooks/orders';
import DropdownField from './Dropdown';
import ButtonField from './Button';

const OrderStatusButtonLabel: any = {
  [OrderStatusEnum.NEW]: 'New',
  [OrderStatusEnum.DECLINED]: 'Decline',
  [OrderStatusEnum.CONFIRMED]: 'Confirm',
  [OrderStatusEnum.PREPARING]: 'Prepare',
  [OrderStatusEnum.SERVED]: 'Serve',
  [OrderStatusEnum.COMPLETED]: 'Complete',
  [OrderStatusEnum.CANCELLED]: 'Cancel',
};

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
    fontSize: 16,
  },
};

const OrderCard = ({
  orderId,
  table,
  type,
  status,
  products,
  notes,
  paymentStatus,
  onEdit,
}: {
  orderId: string;
  table: string;
  type: string;
  status: OrderStatusEnum;
  products: any;
  notes: string;
  paymentStatus: string;
  onEdit: () => void;
}) => {
  const { updateOrderStatus, updateOrderPaymentStatus } = useOrder();
  const [paymentField, setPaymentField] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(OrderPaymentMethodEnum.CASH);
  const [error, setError] = useState('');

  const onUpdatePayment = async () => {
    try {
      if (!window.confirm('Are you sure?')) return;
      setError('');

      await updateOrderPaymentStatus(orderId, paymentMethod, OrderPaymentStatusEnum.PAID);

      setPaymentField(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const onUpdateStatus = async (status: OrderStatusEnum) => {
    try {
      setError('');

      await updateOrderStatus(orderId, status);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const total = products.reduce(
    (acc: any, cur: any) =>
      acc +
      parseInt(cur?.price) * parseInt(cur?.quantity) +
      cur?.addOns?.reduce((acc1: any, cur1: any) => acc1 + parseInt(cur1?.price), 0) *
        parseInt(cur?.quantity),
    0
  );

  return (
    <Container
      style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        backgroundColor: '#ededed',
        padding: '1rem',
        borderRadius: 5,
        // boxShadow: '2px 2px 8px rgb(0 0 0 / 0.2)',
      }}>
      <Box display='flex' onClick={onEdit}>
        <Typography
          sx={{
            ...globalStyles.typography,
            fontSize: 18,
            fontWeight: 600,
          }}>
          {table} ({type === 'dine_in' ? 'Dine-in' : 'Take-out'})
        </Typography>

        <Box flexGrow={1} display={'flex'} justifyContent={'flex-end'}>
          <ModeEditIcon style={{ width: '20px' }} />
        </Box>
      </Box>
      <hr />

      <Box style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        {products.map((prod: any, i: number) => (
          <Box key={i}>
            <Box display='flex'>
              <Box flexGrow={1} display={'flex'} justifyContent={'flex-start'}>
                <Typography
                  sx={{
                    ...globalStyles.typography,
                  }}>
                  {i + 1}. {prod?.productName} ({prod?.productAbbrev})
                </Typography>
              </Box>

              <Box flexGrow={1} display={'flex'} justifyContent={'flex-end'}>
                <Typography
                  sx={{
                    ...globalStyles.typography,
                  }}>
                  P{numeral(prod?.price).format('0,0.00')} - x{prod?.quantity}
                </Typography>
              </Box>
            </Box>

            {prod?.addOns?.length > 0 && (
              <Box>
                <Typography
                  color='text.secondary'
                  sx={{
                    ...globalStyles.typography,
                    fontStyle: 'italic',
                    margin: '0.25rem 0 0.25rem 0.75rem',
                  }}>
                  Add Ons:
                </Typography>

                {prod?.addOns.map((addon: any, i: number) => (
                  <Box key={i} display='flex' style={{ marginLeft: '0.75rem' }}>
                    <Box flexGrow={1} display={'flex'} justifyContent={'flex-start'}>
                      <Typography
                        sx={{
                          ...globalStyles.typography,
                        }}>
                        {i + 1}. {addon?.productName} ({addon?.productAbbrev})
                      </Typography>
                    </Box>

                    <Box flexGrow={1} display={'flex'} justifyContent={'flex-end'}>
                      <Typography
                        sx={{
                          ...globalStyles.typography,
                        }}>
                        P{numeral(addon?.price).format('0,0.00')} - x{addon?.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <hr />

      <Typography
        color='text.secondary'
        sx={{
          ...globalStyles.typography,
        }}>
        Notes : {notes}
      </Typography>

      <hr />

      <Box display='flex'>
        <Box flexGrow={1} display={'flex'} justifyContent={'flex-start'}>
          <Typography
            sx={{
              ...globalStyles.typography,
              fontWeight: 600,
              fontSize: 18,
            }}>
            Total
          </Typography>
        </Box>

        <Box flexGrow={1} display={'flex'} justifyContent={'flex-end'}>
          <Typography
            sx={{
              ...globalStyles.typography,
              fontWeight: 600,
              fontSize: 18,
            }}>
            P{numeral(total).format('0,0.00')}
            {paymentStatus === OrderPaymentStatusEnum.PAID && <i style={{ color: '#539165' }}> (Paid)</i>}
          </Typography>
        </Box>
      </Box>

      <Box style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <ButtonGroup size='small' aria-label='small button group' fullWidth>
          {(paymentStatus !== OrderPaymentStatusEnum.PAID && status === OrderStatusEnum.CONFIRMED) ||
          status === OrderStatusEnum.PREPARING ||
          status === OrderStatusEnum.SERVED ? (
            <Button onClick={() => setPaymentField(prev => !prev)}>Pay Order</Button>
          ) : null}
          {OrderStatusPath[status].map((status: any, i: number) => (
            <Button key={i} onClick={() => onUpdateStatus(status)}>
              {OrderStatusButtonLabel[status]}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {paymentField && (
        <Box>
          <Box>
            <DropdownField
              label='Mode Of Payment'
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
              options={[
                { value: OrderPaymentMethodEnum.CASH, label: 'Cash' },
                { value: OrderPaymentMethodEnum.GCASH, label: 'G-Cash' },
                { value: OrderPaymentMethodEnum.ONLINE_BANK, label: 'Online Bank' },
              ]}
            />
          </Box>

          <Box>
            <ButtonField label={'Order Paid'} onClick={onUpdatePayment} />
          </Box>
        </Box>
      )}

      {error && (
        <Typography
          color='error'
          sx={{
            ...globalStyles.typography,
          }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};
export default OrderCard;
