/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 15th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 16th 2023, 1:19:36 pm
 * ---------------------------------------------
 */
'use client';

import { Box, Container, Typography } from '@mui/material';
import numeral from 'numeral';
import { CSSProperties } from 'react';

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
    fontSize: 16,
  },
};

const OrderCard = ({
  table,
  type,
  products,
  notes,
}: {
  table: string;
  type: string;
  products: any;
  notes: string;
}) => {
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
      }}>
      <Typography
        sx={{
          ...globalStyles.typography,
          fontSize: 18,
          fontWeight: 600,
        }}>
        {table} ({type === 'dine_in' ? 'Dine-in' : 'Take-out'})
      </Typography>

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
          fontSize: 16,
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
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
export default OrderCard;
