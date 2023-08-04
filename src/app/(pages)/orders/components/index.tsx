'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 5th 2023, 2:48:18 am
 * ---------------------------------------------
 */

import { CSSProperties, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import numeral from 'numeral';
import { ISubMenu } from '@/services/products';
import { TCartAddOns, TCartItems } from '@/types/schema/order';

import { Button, ButtonGroup } from '@mui/material';
import { produce } from 'immer';
import _ from 'lodash';
import { IProduct } from '@/hooks/products';

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
    fontSize: 14,
  },
};

interface ProductDetailsProps {
  product: any;
  item?: any;
  style?: any;
  cartItems?: any;
  setCartItems?: any;
  withQnty?: boolean;
  isProductSubMenu?: boolean;
}

interface MenuCardProps {
  product: IProduct;
  cartItems: TCartItems[];
  setCartItems: any;
}

interface CartItemCardProps {
  itemNo: number;
  cartItemId: string;
  cartItems: TCartItems[];
  setCartItems: any;
  products: IProduct[];
}

export const ProductDetails = ({
  product,
  style,
  item,
  cartItems,
  setCartItems,
  withQnty = true,
  isProductSubMenu = false,
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
      fontSize: '1.75rem',
    },
  };

  let itemDetails = item;

  if (isProductSubMenu) {
    itemDetails = item?.addOns.find((d: any) => d.productId === product?.productId);
  }

  const onAddQuantity = (event: any) => {
    event.stopPropagation();

    // Add item to cart
    if (!item && !isProductSubMenu) {
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
    if (item && !isProductSubMenu) {
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
    if (item && isProductSubMenu) {
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

  const onDeductQuantity = (event: any) => {
    event.stopPropagation();

    // Decrement of item in cart
    if (item && !isProductSubMenu) {
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
    if (item && isProductSubMenu) {
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

  return (
    <div style={style}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={{ ...globalStyles.typography }} color='text.secondary' gutterBottom>
            {product?.productAbbrev.toUpperCase()}
          </Typography>
          <Typography sx={{ ...globalStyles.typography }}>{product?.name.toUpperCase()}</Typography>
          <Typography sx={{ ...globalStyles.typography }} color='text.secondary' component='div'>
            P{numeral(product?.price).format('P0,0.00')}
          </Typography>
        </Grid>

        {withQnty && (
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
        )}
      </Grid>
    </div>
  );
};

export const MenuCard = ({ product, cartItems, setCartItems }: MenuCardProps) => {
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
    <Card style={{ marginBottom: '1rem', backgroundColor: '#ededed', border: 'none' }} variant='outlined'>
      <CardContent>
        <ProductDetails
          product={product}
          item={itemExist}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />

        <Typography
          sx={{ ...globalStyles.typography, fontSize: 14, marginTop: '0.5rem' }}
          color='text.secondary'>
          SUB TOTAL: P{numeral(subTotal).format('P0,00.00')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const CartItemCard = ({
  itemNo,
  cartItemId,
  cartItems,
  setCartItems,
  products,
}: CartItemCardProps) => {
  const [maximizeCard, setMaximizeCard] = useState(false);

  const item = useMemo(() => cartItems.find((d: any) => d.id === cartItemId), [cartItemId, cartItems]);

  const productInfo = useMemo(
    () => products?.find((d: any) => d.id === item?.productId),
    [item?.productId, products]
  );

  const subTotal = useMemo(() => {
    if (item) {
      const qnty = item.quantity;
      const price = item.price;

      const addOnsTotal = item.addOns.reduce((acc: number, curr: TCartAddOns) => {
        acc += curr.price * curr.quantity * qnty;
        return acc;
      }, 0);

      return Number(qnty) * Number(price) + Number(addOnsTotal);
    }

    return 0;
  }, [item]);

  const onRemoveOrder = (event: any) => {
    event.stopPropagation();

    if (!window.confirm('Are you sure you want to remove this item?')) {
      return;
    }

    setCartItems(
      produce(cartItems, (draftState: any) => {
        const index = draftState.findIndex((obj: any) => obj.id === cartItemId);
        if (index !== -1) {
          draftState.splice(index, 1);
        }
      })
    );
  };

  if (!productInfo)
    return (
      <Box flexGrow={1} display='flex' justifyContent='flex-start' alignItems='flex-start'>
        <Typography
          sx={{
            ...globalStyles.typography,
            fontSize: 16,
            fontWeight: 600,
          }}>
          Item #{itemNo}
        </Typography>
      </Box>
    );

  return (
    <Card style={{ marginBottom: '1rem', backgroundColor: '#ededed', border: 'none' }} variant='outlined'>
      <CardContent onClick={() => setMaximizeCard((prev: any) => !prev)}>
        <Box display='flex' style={{ marginBottom: '0.75rem' }}>
          <Box flexGrow={1} display='flex' justifyContent='flex-start' alignItems='flex-start'>
            <Typography
              sx={{
                ...globalStyles.typography,
                fontSize: 16,
                fontWeight: 600,
              }}>
              Item #{itemNo}
            </Typography>
          </Box>

          <Box flexGrow={1} display='flex' justifyContent='flex-end'>
            <Box display='flex' alignItems='flex-start' justifyContent='flex-end'>
              <DeleteForeverOutlinedIcon
                onClick={onRemoveOrder}
                style={{
                  outline: 'none',
                  color: '#EF6262',
                  borderColor: '#EF6262',
                  textTransform: 'none',
                  fontSize: '1.75rem',
                }}
              />
            </Box>
          </Box>
        </Box>

        <ProductDetails
          product={productInfo}
          item={item}
          cartItems={cartItems}
          setCartItems={setCartItems}
          withQnty={false}
        />

        {productInfo?.subMenu.length > 0 && item && maximizeCard && (
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
            {productInfo?.subMenu.map((sm: ISubMenu, index: number) => {
              return (
                <ProductDetails
                  key={index}
                  style={{ marginBottom: '1rem' }}
                  product={sm}
                  item={item}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  isProductSubMenu={true}
                />
              );
            })}
          </div>
        )}

        <Typography
          sx={{ ...globalStyles.typography, fontSize: 14, marginTop: '0.5rem' }}
          color='text.secondary'>
          SUB TOTAL: P{numeral(subTotal).format('P0,00.00')}
        </Typography>
      </CardContent>
    </Card>
  );
};
