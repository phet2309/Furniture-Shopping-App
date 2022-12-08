import React, { SyntheticEvent, useState } from 'react'
import { useQuery } from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import Item from '../../components/Item/Item';
import './StoreScreen.css';
import { Drawer } from 'react-bootstrap-drawer';
import { Button, Offcanvas } from 'react-bootstrap';
import CartItem from '../../components/CartItem/CartItem';
import CheckoutScreen from '../CheckoutScreen/CheckoutScreen';
import { Redirect } from 'react-router-dom';
import { json } from 'stream/consumers';


export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

interface Props {
  setAuth: (isAuthenticated: boolean) => void;
}

const getProducts = async (): Promise<CartItemType[]> => await (await fetch('http://localhost:8000/products')).json();

const StoreScreen = (props: any) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);

  // Get Total Items
  const getTotalItems = (items: CartItemType[]) => items.reduce((acc: number, item) => acc + item.amount*item.price, 0);

  // Handle adding to the cart
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    })
  };

  // Handle remove from the cart
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => {
      return prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1)
            return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [] as CartItemType[]);
    });
  };

  // Handling closing the cart
  const handleCloseCart = () => {
    setCartOpen(false);
  };

  function checkOutHandler(cartItems: CartItemType[]): void {
    localStorage.setItem('cart-data', JSON.stringify(cartItems));
    <Redirect
      to={{
        pathname: "/payment",
      }}
    />
  }

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '75vh' }}>
        <Spinner animation="border" />
      </div>
    )
  }
  if (error) return <div>Something went wrong...</div>


  return (
    <>
      <Button variant="primary" onClick={() => setCartOpen(true)}>
        Go to Cart
      </Button>
      <Offcanvas show={cartOpen} onHide={handleCloseCart}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length === 0 ? <p>No items in cart.</p> : null}
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              addToCart={handleAddToCart}
              removeFromCart={handleRemoveFromCart}
            />
          ))}
          <h2>Total: ${getTotalItems(cartItems).toFixed(2)}</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.title} ({item.amount}) - ${item.price * item.amount}
              </li>
            ))}
          </ul>
          <Button variant="dark" disabled={cartItems.length === 0} onClick={() => checkOutHandler(cartItems)} href='/payment'>Checkout</Button>
        </Offcanvas.Body>

      </Offcanvas>
      <div className='card-layout'>
        {data?.map(item => (
          <Item item={item} handleAddToCart={handleAddToCart} />
        ))}
      </div>
    </>
  )
}

export default StoreScreen;
