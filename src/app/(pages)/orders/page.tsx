'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 8:33:14 pm
 * ---------------------------------------------
 */

import { CSSProperties, useEffect, useMemo, useState } from 'react';
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
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Checkbox from '@mui/material/Checkbox';
import InputField from '@/components/TextField';
import ButtonField from '@/components/Button';

import useStore from '@/hooks/store';
import useProduct, { IProduct } from '@/hooks/products';
import numeral from 'numeral';
import { ISubMenu } from '@/services/products';
import {
  OrderPaymentMethodEnum,
  OrderPaymentStatusEnum,
  OrderTypeEnum,
  TCartAddOns,
  TCartItems,
} from '@/types/schema/order';

import { Button, ButtonGroup } from '@mui/material';
import { produce } from 'immer';
import useStoreTable from '@/hooks/storeTable';
import DropdownField from '@/components/Dropdown';
import useOrder, { ICreateOrder } from '@/hooks/orders';
import useAuth from '@/hooks/auth';
import _ from 'lodash';

interface ProductDetailsProps {
  product: any;
  item?: any;
  style?: any;
  cartItems?: any;
  setCartItems?: any;
  withQnty?: boolean;
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
}

const globalStyles: { [key: string]: CSSProperties } = {
  typography: {
    fontFamily: 'inherit',
    fontSize: 14,
  },
};

const ProductDetails = ({
  product,
  style,
  item,
  cartItems,
  setCartItems,
  withQnty = true,
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

  if (product?.isAddOns) {
    itemDetails = item?.addOns.find((d: any) => d.productId === product?.productId);
  }

  const onAddQuantity = (event: any) => {
    event.stopPropagation();

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

  const onDeductQuantity = (event: any) => {
    event.stopPropagation();

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

const MenuCard = ({ product, cartItems, setCartItems }: MenuCardProps) => {
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

const CartItemCard = ({ itemNo, cartItemId, cartItems, setCartItems }: CartItemCardProps) => {
  let subTotal = 0;
  const [maximizeCard, setMaximizeCard] = useState(false);

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
          product={item?.product}
          item={item}
          cartItems={cartItems}
          setCartItems={setCartItems}
          withQnty={false}
        />

        {item?.product?.subMenu.length > 0 && item && maximizeCard && (
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
          SUB TOTAL: P{numeral(subTotal).format('P0,00.00')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function Order() {
  const { userInfo } = useAuth();
  const { documents: storeDocs } = useStore();
  const { documents: products } = useProduct();
  const { documents: tables } = useStoreTable();
  const { createOrder } = useOrder();

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [table, setTable] = useState('');
  const [type, setType] = useState<OrderTypeEnum>(OrderTypeEnum.DINE_IN);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPaid, setOrderPaid] = useState(false);
  const [cartEntries, setCartEntries] = useState<TCartItems[]>([]);
  const [cartItems, setCartItems] = useState<TCartItems[]>([]);
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (storeDocs && storeDocs.length) {
      const filteredStores = storeDocs
        .filter((store: any) => {
          if (userInfo && userInfo?.userType === 'admin') {
            return true;
          } else if (userInfo && userInfo.userType !== 'admin') {
            return store?.staff.includes(userInfo?.id);
          }

          return false;
        })
        .map((store: any) => ({
          value: store.id,
          label: store.name,
        }));

      setStoreOptions(filteredStores);

      if (filteredStores && filteredStores.length) {
        const store = filteredStores[0];

        if (store) {
          setStore(store.value);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDocs, userInfo]);

  const onAddToCart = () => {
    if (cartEntries.length) {
      cartEntries.forEach((cartItem: any) => {
        for (let index = 1; index <= cartItem.quantity; index++) {
          setCartItems((prev: any) =>
            prev.concat({
              ...cartItem,
              quantity: 1,
              id: uuidv4(), // Generate a new UUID for each item
            })
          );
        }
      });

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
        payment: {
          modeOfPayment: paymentMethod as OrderPaymentMethodEnum,
          status: (orderPaid ? OrderPaymentStatusEnum.PAID : '') as OrderPaymentStatusEnum,
        },
      };

      await createOrder(payload);

      setPaymentMethod('');
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

  const onChangeStore = (value: string) => {
    setTable('');
    setCartEntries([]);
    setCartItems([]);
    setStore(value);
  };

  const total = useMemo(() => {
    return cartItems.reduce((acc: any, curr: any) => {
      const qnty = curr.quantity;
      const price = curr.price;

      const addOnsTotal = curr.addOns.reduce((acc: number, curr: TCartAddOns) => {
        acc += curr.price * curr.quantity * qnty;
        return acc;
      }, 0);

      acc += Number(qnty) * Number(price) + Number(addOnsTotal);

      return acc;
    }, 0);
  }, [cartItems]);

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '5rem' }}>
      <DropdownField
        label='Store'
        value={store}
        onChange={(e: any) => onChangeStore(e.target.value)}
        options={storeOptions.map(store => ({ value: store.value, label: store.label }))}
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

      <DropdownField
        label='Table'
        value={table}
        onChange={(e: any) => setTable(e.target.value)}
        options={tables
          .filter((d: any) => d.store.id === store)
          .map(table => ({ value: table.id, label: table.name }))}
      />

      <div>
        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography style={{ ...globalStyles.typography, fontSize: 18, fontWeight: 600 }}>
              Menu
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Grid container spacing={2}>
              {_.orderBy(products, ['name'], ['asc'])
                .filter((d: IProduct) => d.store.id === store && !d.isAddOns)
                .map((d: IProduct, index: number) => (
                  <Grid item key={index} xs={6}>
                    <MenuCard product={d} cartItems={cartEntries} setCartItems={setCartEntries} />
                  </Grid>
                ))}

              <Grid item xs={12}>
                <ButtonField label='Add To Cart' onClick={onAddToCart} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion style={{ border: 'none', boxShadow: 'none' }} defaultExpanded={true}>
          <AccordionSummary
            style={{ padding: 0 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Typography
              sx={{ ...globalStyles.typography, marginBottom: '1.5rem', fontSize: 18, fontWeight: 600 }}>
              Cart
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            {cartItems.length ? (
              <>
                {cartItems.map((d: TCartItems, index: number) => (
                  <CartItemCard
                    key={index}
                    itemNo={index + 1}
                    cartItemId={d.id}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                ))}

                <Box>
                  <InputField label='Notes' value={notes} onChange={setNotes} />
                </Box>

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
                  <FormControlLabel
                    control={<Checkbox checked={orderPaid} onChange={() => setOrderPaid(prev => !prev)} />}
                    label='Paid Order'
                  />
                </Box>

                <Box display='flex' alignItems='center' justifyContent='flex-start'>
                  <Typography
                    sx={{
                      ...globalStyles.typography,
                      fontSize: 16,
                      marginBottom: '1rem',
                      marginTop: '1rem',
                    }}
                    color='text.secondary'>
                    TOTAL: P{numeral(total).format('0,0.00')}
                  </Typography>
                </Box>

                <ButtonField label='Create Order' onClick={onCreateOrder} />
              </>
            ) : (
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography
                  sx={{ ...globalStyles.typography, fontSize: 16, marginBottom: '1.5rem' }}
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
