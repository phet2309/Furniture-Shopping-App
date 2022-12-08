import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { CartItemType } from '../../screens/StoreScreen/StoreScreen';
import './Item.css';

type Props = {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
}

const Item = ({item, handleAddToCart} : Props) => {
  console.log(item);
  return ( 
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={item.image} />
      <Card.Body className='card-body'>
        <Card.Title>{item.title}</Card.Title>
        <Card.Link href={`/product/${item.id}`}>View Details</Card.Link>
        <Card.Text>${item.price}</Card.Text>
        <Button variant="primary" onClick={() => handleAddToCart(item)}>Add to cart</Button>
      </Card.Body>
    </Card>
  )
}

export default Item;