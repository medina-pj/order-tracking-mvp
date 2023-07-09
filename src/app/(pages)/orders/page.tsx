'use client';

/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday July 9th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 9th 2023, 11:14:51 pm
 * ---------------------------------------------
 */

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

interface ProductDetailsProps {
  product: any;
  item?: any;
  style?: any;
  cartItems?: any;
  setCartItems?: any;
}

const ProductDetails = ({ product, style, item, cartItems, setCartItems }: ProductDetailsProps) => {
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

  return (
    <div style={style}>
      <Typography sx={{ fontSize: 12 }} color='text.secondary'>
        {product?.productAbbrev}
      </Typography>
      <Typography sx={{ fontSize: 16 }}>{product?.name}</Typography>
      <Typography sx={{ fontSize: 14 }} component='div' gutterBottom>
        P{numeral(product?.price).format('P0,0.00')}
      </Typography>

      <ButtonGroup size='small'>
        <Button onClick={onAddQuantity}>+</Button>
        {itemDetails?.quantity && <Button>{itemDetails?.quantity || 0}</Button>}
        {itemDetails?.quantity && <Button onClick={onDeductQuantity}>-</Button>}
      </ButtonGroup>
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
    <Card style={{ marginBottom: '0.75rem' }} variant='outlined'>
      <CardContent>
        <ProductDetails
          product={product}
          item={itemExist}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
        {product?.subMenu.length > 0 && itemExist && (
          <div>
            <Typography sx={{ fontSize: 14, marginBottom: '1rem', marginTop: '1rem' }} color='text.secondary'>
              Add-Ons:
            </Typography>
            {product?.subMenu.map((sm: ISubMenu, index: number) => {
              return (
                <ProductDetails
                  key={index}
                  style={{ marginBottom: '0.5rem' }}
                  product={sm}
                  item={itemExist}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              );
            })}
          </div>
        )}

        <Typography sx={{ fontSize: 14, marginBottom: '1rem', marginTop: '1rem' }} color='text.secondary'>
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

  const [error, setError] = useState('');
  const [store, setStore] = useState('');
  const [table, setTable] = useState('');
  const [type, setType] = useState('dine_in');
  const [note, setNote] = useState('');
  const [cartEntries, setCartEntries] = useState<TCartItems[]>([]);
  const [cartItems, setCartItems] = useState<TCartItems[]>([]);

  const onAddToCart = () => {
    setCartItems((prev: any) => prev.concat(cartEntries));
    setCartEntries([]);
  };

  console.log({
    cartEntries,
    cartItems,
  });

  return (
    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
      <InputField label='Note' value={note} onChange={setNote} />
      <div>
        <Accordion style={{ border: 'none', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography>Menu</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {products
              .filter((d: IProduct) => !d.isAddOns)
              .map((d: IProduct, index: number) => (
                <MenuCard key={index} product={d} cartItems={cartEntries} setCartItems={setCartEntries} />
              ))}

            <ButtonField label='Add To Cart' onClick={onAddToCart} />
          </AccordionDetails>
        </Accordion>

        <Accordion style={{ border: 'none', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Typography>Cart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {cartItems.map((d: TCartItems, index: number) => (
              <MenuCard key={index} product={d.product} cartItems={cartItems} setCartItems={setCartItems} />
            ))}
          </AccordionDetails>
        </Accordion>
      </div>
    </Container>
  );
}
