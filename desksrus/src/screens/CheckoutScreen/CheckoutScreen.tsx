import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/esm/Button';
import CartItem from '../../components/CartItem/CartItem';
import { CartItemType } from '../StoreScreen/StoreScreen';
// import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';





function CheckoutScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [secNumber, setSecNumber] = useState('');
  const [cardOwnerName, setCardOwnerName] = useState('');
  const [cardType, setCardType] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [expDate, setExpDate] = useState('');
  const [saName, setSaName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [street, setStreet] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay Now');

  const payNowHandler = async (e: SyntheticEvent, cartItems: CartItemType[]) => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:8000/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': `${token}` },
      body: JSON.stringify({
        cartItems,
        paymentMethod,
        cardNumber,
        saName        
      })
    });
    const res = await response.json();
    toast.success("Payment Successful");
  }

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8000/paymentdetail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': `${token}` },
      body: JSON.stringify({
        cardNumber,
        secNumber,
        cardOwnerName,
        cardType,
        billingAddress,
        expDate,
        saName,
        street,
        country,
        state,
        city,
        zip,
      })
    });
    if (res.status === 200) {
      toast.success("Payment Successful");
    }
  }



  const getTotalItems = (items: CartItemType[]) => items.reduce((acc: number, item) => acc + item.price*item.amount, 0);


  const localStorageObj = localStorage.getItem('cart-data') ? localStorage.getItem('cart-data') : "";
  const cartItems = JSON.parse(localStorageObj ? localStorageObj : "") as CartItemType[];

  if (cartItems.length) {
    return (
      <>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              <img src={item.image} style={{ width: '100px', height: '100px' }} />
              {item.title} ({item.amount}) = ${item.price * item.amount}
            </li>
          ))}
        </ul>
        <h2>Total: ${getTotalItems(cartItems).toFixed(2)}</h2>
        {/* <FormContainer> */}
        <Form className="my-3" onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="cardNumber">
            <Form.Label>Credit Card Number</Form.Label>
            <Form.Control type="cardNumber" placeholder="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="secNumber">
            <Form.Label>Security Number</Form.Label>
            <Form.Control type="secNumber" placeholder="secNumber"
              value={secNumber}
              onChange={(e) => setSecNumber(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="cardOwnerName">
            <Form.Label>Card Owner Name</Form.Label>
            <Form.Control type="cardOwnerName" placeholder="cardOwnerName"
              value={cardOwnerName}
              onChange={(e) => setCardOwnerName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="cardType">
            <Form.Label>Card Type</Form.Label>
            <Form.Control type="cardType" placeholder="cardType"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="billingAddress">
            <Form.Label>Billing Address</Form.Label>
            <Form.Control type="billingAddress" placeholder="billingAddress"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="expDate" placeholder="expDate"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)} />
          </Form.Group>

          <h3> Shipping Address</h3>
          <Form.Group className="mb-3" controlId="saName">
            <Form.Label>Address Type</Form.Label>
            <Form.Control type="saName" placeholder="saName"
              value={saName}
              onChange={(e) => setSaName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>City</Form.Label>
            <Form.Control type="city" placeholder="city"
              value={city}
              onChange={(e) => setCity(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>State</Form.Label>
            <Form.Control type="state" placeholder="state"
              value={state}
              onChange={(e) => setState(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>Country</Form.Label>
            <Form.Control type="country" placeholder="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>Street</Form.Label>
            <Form.Control type="street" placeholder="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="expDate">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="zip" placeholder="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)} />
          </Form.Group>

          <Form.Check
            inline
            label='Pay Now'
            name="group1"
            type='radio'
            id={`inline-radio-2`}
            onChange={(e) => setPaymentMethod('Pay Now') }
            checked={paymentMethod==='Pay Now'}
          />
          <Form.Check
            inline
            label="Cash On Delivery"
            name="group1"
            type='radio'
            id={`inline-radio-2`}
            onChange={(e) => setPaymentMethod('Cash On Delivery') }
            checked={paymentMethod==='Cash On Delivery'}
          />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* </FormContainer> */}
        <Button variant="dark" disabled={cartItems.length === 0} onClick={(e) => payNowHandler(e, cartItems)}>Pay</Button>
      </>
    )
  } else {
    return <h1>Empty Cart</h1>
  }

}

export default CheckoutScreen