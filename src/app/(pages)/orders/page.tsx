'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 11th 2023, 10:37:00 pm
 * ---------------------------------------------
 */

import { CSSProperties, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct, { IProduct } from '@/hooks/products';
import numeral from 'numeral';
import { ISubMenu } from '@/services/products';
import { OrderTypeEnum, TCartAddOns, TCartItems } from '@/types/schema/order';

import { Button, ButtonGroup } from '@mui/material';
import { produce } from 'immer';
import useStoreTable from '@/hooks/storeTable';
import DropdownField from '@/components/Dropdown';
import useOrder, { ICreateOrder } from '@/hooks/orders';

interface ProductDetailsProps {
  product: any;
  item?: any;
  style?: any;
  cartItems?: any;
  setCartItems?: any;
  withDeleteBtn?: boolean;
}

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
  },
};

const ProductDetails = ({
  product,
  style,
  item,
  cartItems,
  setCartItems,
  withDeleteBtn,
}: ProductDetailsProps) => {
  const productDetailStyle: any = {
    qntyButton: {
      outline: 'none',
      color: 'grey',
      borderColor: 'grey',
      fontSize: '0.75rem',
    },
    removeButton: {
      outline: 'none',
      color: '#EF6262',
      borderColor: '#EF6262',
      textTransform: 'none',
      fontSize: '0.75rem',
    },
  };

  let itemDetails = item;

  if (product?.isAddOns) {
    itemDetails = item?.addOns.find((d: any) => d.productId === product?.productId);
  }

  const onAddQuantity = () => {
    // Add item to cart
    if (!item && !product?.isAddOns) {
      setCartItems((prev: any) =>
        prev.concat({
          product: product, // remove when creating order
          id: uuidv4(),
          productId: product.id,
          productCode: product.productCode,
          productName: product.name,
          productAbbrev: product.productAbbrev,
          price: product.price,
          quantity: 1,
          notes: '',
          addOns: [],
          voided: false,
        })
      );
    }

    // Increment quantity of item in cart
    if (item && !product?.isAddOns) {
      setCartItems(
        produce(cartItems, (draftState: any) => {
          const cartItem = draftState.find((obj: any) => obj.id === item.id);

          if (cartItem) {
            cartItem.quantity += 1;
          }
        })
      );
    }

    // Check if product is add-ons
    if (item && product?.isAddOns) {
      setCartItems(
        produce(cartItems, (draftState: any) => {
          const cartItem: TCartItems = draftState.find((obj: any) => obj.id === item.id);
          const addOnItemIndex = cartItem.addOns.findIndex((d: any) => d.productId === product.productId);

          // // Add the add-on to the selected item in cart
          if (addOnItemIndex === -1) {
            cartItem.addOns.push({
              id: uuidv4(),
              productId: product.productId,
              productCode: product.productCode,
              productName: product.name,
              productAbbrev: product.productAbbrev,
              price: product.price,
              quantity: 1,
              voided: false,
            });
          } else {
            cartItem.addOns[addOnItemIndex].quantity += 1;
          }
        })
      );
    }
  };

  const onDeductQuantity = () => {
    // Decrement of item in cart
    if (item && !product?.isAddOns) {
      setCartItems(
        produce(cartItems, (draftState: any) => {
          const cartItem = draftState.find((obj: any) => obj.id === item.id);
          const index = draftState.findIndex((obj: any) => obj.id === item.id);

          if (index !== -1) {
            const newQuantity = cartItem.quantity - 1;

            if (newQuantity === 0) {
              draftState.splice(index, 1);
            } else {
              cartItem.quantity = newQuantity;
            }
          }
        })
      );
    }

    // Decrement the quantity of add-on items in cart
    if (item && product?.isAddOns) {
      setCartItems(
        produce(cartItems, (draftState: any) => {
          const cartItem = draftState.find((obj: any) => obj.id === item.id);
          const addOnItemIndex = cartItem.addOns.findIndex((d: any) => d.productId === product.productId);

          if (addOnItemIndex !== -1) {
            const newQuantity = cartItem.addOns[addOnItemIndex].quantity - 1;

            if (newQuantity === 0) {
              cartItem.addOns.splice(addOnItemIndex, 1);
            } else {
              cartItem.addOns[addOnItemIndex].quantity = newQuantity;
            }
          }
        })
      );
    }
  };

  const onRemoveOrder = () => {
    if (!window.confirm('Are you sure you want to remove this item?')) {
      return;
    }

    setCartItems(
      produce(cartItems, (draftState: any) => {
        const index = draftState.findIndex((obj: any) => obj.id === item.id);

        if (index !== -1) {
          draftState.splice(index, 1);
        }
      })
    );
  };

  return (
    <div style={style}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ ...globalStyles.typography, fontSize: 12 }} color='text.secondary' gutterBottom>
            {product?.productAbbrev}
          </Typography>
          <Typography sx={{ ...globalStyles.typography, fontSize: 16 }}>{product?.name}</Typography>
          <Typography
            sx={{ ...globalStyles.typography, fontSize: 14 }}
            color='text.secondary'
            component='div'>
            P{numeral(product?.price).format('P0,0.00')}
          </Typography>
        </Grid>

        <Grid item xs={6} display='flex' alignItems='center' justifyContent='flex-start'>
          <Box>
            <ButtonGroup size='small'>
              <Button style={productDetailStyle.qntyButton} onClick={onAddQuantity}>
                +
              </Button>
              {itemDetails?.quantity && (
                <Button style={productDetailStyle.qntyButton}>{itemDetails?.quantity || 0}</Button>
              )}
              {itemDetails?.quantity && (
                <Button style={productDetailStyle.qntyButton} onClick={onDeductQuantity}>
                  -
                </Button>
              )}
            </ButtonGroup>
          </Box>
        </Grid>

        {withDeleteBtn && (
          <Grid item xs={6}>
            <Box display='flex' justifyContent='flex-end'>
              <Button
                style={{ ...globalStyles.typography, ...productDetailStyle.removeButton }}
                onClick={onRemoveOrder}
                variant='outlined'>
                Remove
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

const MenuCard = ({
  product,
  cartItems,
  setCartItems,
}: {
  product: IProduct;
  cartItems: TCartItems[];
  setCartItems: any;
}) => {
  let subTotal = 0;
  const itemExist = cartItems.find((d: any) => d.productId === product.id);

  if (itemExist) {
    const qnty = itemExist.quantity;
    const price = itemExist.price;

    const addOnsTotal = itemExist.addOns.reduce((acc: number, curr: TCartAddOns) => {
      acc += curr.price * curr.quantity * qnty;
      return acc;
    }, 0);

    subTotal = Number(qnty) * Number(price) + Number(addOnsTotal);
  }

  return (
    <Card style={{ marginBottom: '1rem' }} variant='outlined'>
      <CardContent>
        <ProductDetails
          product={product}
          item={itemExist}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
        {product?.subMenu.length > 0 && itemExist && (
          <div>
            <Typography
              sx={{
                ...globalStyles.typography,
                fontWeight: '600',
                fontSize: 14,
                marginBottom: '0.5rem',
                marginTop: '1.5rem',
              }}
              color='text.secondary'>
              Add-Ons:
            </Typography>
            {product?.subMenu.map((sm: ISubMenu, index: number) => {
              return (
                <ProductDetails
                  key={index}
                  style={{ marginBottom: '1rem' }}
                  product={sm}
                  item={itemExist}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              );
            })}
          </div>
        )}

        <Typography
          sx={{ ...globalStyles.typography, fontSize: 14, marginTop: '0.5rem' }}
          color='text.secondary'>
          Sub Total: P{numeral(subTotal).format('P0,00.00')}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CartItemCard = ({
  cartItemId,
  cartItems,
  setCartItems,
}: {
  cartItemId: string;
  cartItems: TCartItems[];
  setCartItems: any;
}) => {
  let subTotal = 0;

  const item = cartItems.find((d: any) => d.id === cartItemId);

  if (item) {
    const qnty = item.quantity;
    const price = item.price;

    const addOnsTotal = item.addOns.reduce((acc: number, curr: TCartAddOns) => {
      acc += curr.price * curr.quantity * qnty;
      return acc;
    }, 0);

    subTotal = Number(qnty) * Number(price) + Number(addOnsTotal);
  }

  return (
    <Card style={{ marginBottom: '1rem' }} variant='outlined'>
      <CardContent>
        <ProductDetails
          product={item?.product}
          item={item}
          cartItems={cartItems}
          setCartItems={setCartItems}
          withDeleteBtn
        />
        {item?.product?.subMenu.length > 0 && item && (
          <div>
            <Typography
              sx={{
                ...globalStyles.typography,
                fontWeight: '600',
                fontSize: 14,
                marginBottom: '0.5rem',
                marginTop: '1.5rem',
              }}
              color='text.secondary'>
              Add-Ons:
            </Typography>
            {item.product?.subMenu.map((sm: ISubMenu, index: number) => {
              return (
                <ProductDetails
                  key={index}
                  style={{ marginBottom: '1rem' }}
                  product={sm}
                  item={item}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              );
            })}
          </div>
        )}

        <Typography
          sx={{ ...globalStyles.typography, fontSize: 14, marginTop: '0.5rem' }}
          color='text.secondary'>
          Sub Total: P{numeral(subTotal).format('P0,00.00')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function Order() {
  const { documents: stores } = useStore();
  const { documents: products } = useProduct();
  const { documents: tables } = useStoreTable();
  const { createOrder } = useOrder();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [table, setTable] = useState('');
  const [type, setType] = useState<OrderTypeEnum>(OrderTypeEnum.DINE_IN);
  const [notes, setNotes] = useState('');
  const [orderPaid, setOrderPaid] = useState(false);
  const [cartEntries, setCartEntries] = useState<TCartItems[]>([]);
  const [cartItems, setCartItems] = useState<TCartItems[]>([]);

  const onAddToCart = () => {
    if (cartEntries.length) {
      setCartItems((prev: any) => prev.concat(cartEntries));
      setCartEntries([]);
    }
  };

  const onCreateOrder = async () => {
    try {
      if (!store || !table || !type || !cartItems.length) {
        alert('Input required fields.');
        return;
      }

      if (!window.confirm('Sure na?')) {
        return;
      }

      const cart = cartItems.map((d: TCartItems) => ({
        id: d.id,
        productId: d.productId,
        productCode: d.productCode,
        productName: d.productName,
        productAbbrev: d.productAbbrev,
        price: d.price,
        quantity: d.quantity,
        notes: d.notes,
        addOns: d.addOns,
        voided: d.voided,
      }));

      const payload: ICreateOrder = {
        storeId: store,
        tableId: table,
        notes,
        customerNotes: '',
        type,
        cartItems: cart,
        orderPaid,
      };

      await createOrder(payload);

      setTable('');
      setNotes('');
      setOrderPaid(false);
      setCartEntries([]);
      setCartItems([]);

      alert('Order created.');
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const total = cartItems.reduce((acc: any, curr: any) => {
    const qnty = curr.quantity;
    const price = curr.price;

    const addOnsTotal = curr.addOns.reduce((acc: number, curr: TCartAddOns) => {
      acc += curr.price * curr.quantity * qnty;
      return acc;
    }, 0);

    acc += Number(qnty) * Number(price) + Number(addOnsTotal);

    return acc;
  }, 0);

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '5rem' }}>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => setStore(e.target.value)}
        options={stores.map(store => ({ value: store.id, label: store.name }))}
      />
      <DropdownField
        label='Table'
        value={table}
        onChange={(e: any) => setTable(e.target.value)}
        options={tables
          .filter((d: any) => d.store.id === store)
          .map(table => ({ value: table.id, label: table.name }))}
      />
      <DropdownField
        label='Order Type'
        value={type}
        onChange={(e: any) => setType(e.target.value)}
        options={[
          { value: OrderTypeEnum.DINE_IN, label: 'Dine In' },
          { value: OrderTypeEnum.TAKE_OUT, label: 'Take Out' },
        ]}
      />
      <InputField label='Notes' value={notes} onChange={setNotes} />
      <div>
        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography style={{ ...globalStyles.typography, fontSize: '18px' }}>Menu</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            {products
              .filter((d: IProduct) => !d.isAddOns)
              .map((d: IProduct, index: number) => (
                <MenuCard key={index} product={d} cartItems={cartEntries} setCartItems={setCartEntries} />
              ))}

            <ButtonField label='Add To Cart' onClick={onAddToCart} />
          </AccordionDetails>
        </Accordion>

        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Typography sx={{ ...globalStyles.typography, marginBottom: '1.5rem', fontSize: '18px' }}>
              Cart
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            {cartItems.length ? (
              <>
                {cartItems.map((d: TCartItems, index: number) => (
                  <CartItemCard
                    key={index}
                    cartItemId={d.id}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                ))}

                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={orderPaid} onChange={() => setOrderPaid(prev => !prev)} />}
                    label='Paid Order'
                  />
                </Box>

                <Box display='flex' alignItems='center' justifyContent='flex-start'>
                  <Typography
                    sx={{
                      ...globalStyles.typography,
                      fontSize: 18,
                      marginBottom: '1rem',
                      marginTop: '1rem',
                    }}
                    color='text.secondary'>
                    Total: P{numeral(total).format('0,0.00')}
                  </Typography>
                </Box>

                <ButtonField label='Create Order' onClick={onCreateOrder} />
              </>
            ) : (
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography
                  sx={{ ...globalStyles.typography, fontSize: 18, marginBottom: '1.5rem' }}
                  color='text.secondary'>
                  {`Cart Is Empty :(`}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        <Box display='flex' alignItems='center' justifyContent='center'>
          <Typography
            sx={{ ...globalStyles.typography, fontSize: 12, marginBottom: '1.5rem' }}
            color='text.secondary'>
            {error}
          </Typography>
        </Box>
      </div>
    </Container>
  );
}
