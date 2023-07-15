/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 15th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 15th 2023, 10:51:47 pm
 * ---------------------------------------------
 */
'use client';

import { Container } from '@mui/material';

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
      style={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#ededed', padding: '1rem' }}>
      <b>
        {table} ({type === 'dine_in' ? 'Dine-in' : 'Take-out'})
      </b>
      <hr />
      {products.map((prod: any, i: number) => (
        <div key={i} style={{ marginLeft: '5px' }}>
          {i + 1}. {prod?.productName} ({prod?.productAbbrev})
          <span style={{ display: 'block', float: 'right' }}>
            P{prod?.price} - {prod?.quantity}pcs
          </span>
          <br />
          {prod?.addOns?.length ? (
            <div style={{ marginLeft: '10px' }}>
              <i> Add Ons: </i>
              {prod?.addOns.map((addon: any, i: number) => (
                <div key={i} style={{ marginLeft: '10px' }}>
                  {i + 1}. {addon?.productName} ({addon?.productAbbrev})
                  <span style={{ display: 'block', float: 'right' }}>
                    P{prod?.price} - {prod?.quantity}pcs
                  </span>
                  <br />
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
      NOTES : {notes}
      <hr />
      <b>
        TOTAL : <span style={{ display: 'block', float: 'right' }}>P{total}</span>
      </b>
    </Container>
  );
};
export default OrderCard;
