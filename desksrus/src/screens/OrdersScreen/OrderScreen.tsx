import React, { SyntheticEvent, useState } from 'react'
import { Badge, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { SyntheticEventData } from 'react-dom/test-utils';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import OrderScreenItem from '../OrderScreenItem/OrderScreenItem';

interface Props {
  setAuth: (isAuthenticated: boolean) => void;
}

export type OrderType = {
  id: number;
  totalamount: number;
  date: string;
  status: string;
}

const token = localStorage.getItem('token');
const getOrders = async (): Promise<OrderType[]> => await (await fetch('http://localhost:8000/orders', {headers: { 'Content-Type': 'application/json', 'token': `${token}` }})).json();

const OrderScreen = ({isAdmin}: any) => {
  const [orderList, setOrderList] = useState<OrderType[]>([] as OrderType[]);
  const { data, isLoading, error } = useQuery<OrderType[]>('orders', getOrders);

  // data && setOrderList4

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '75vh' }}>
        <Spinner animation="border" />
      </div>
    )
  }
  if (error) return <div>Something went wrong...</div>

  const handleClick = (e: SyntheticEvent) => {
      e.preventDefault();
      
  }

  return (
    <ListGroup>
      <ListGroup.Item
        as="li"
        className="d-block justify-content-between align-items-start"
      >
        {data?.map(order => (
          <Card.Body className='d-block' key={order.id}>
            <div className='d-flex justify-content-between'>
              <Card.Title>${order.totalamount}</Card.Title>
              {order.status === 'Completed' ? <Badge bg="success">Success</Badge> : <Badge bg="warning">{order.status}</Badge>}
              <Button onClick={async (e: SyntheticEvent) => { 
                e.preventDefault(); 
                await fetch(`http://localhost:8000/admin/changeorder/${order.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    status: order.status
                  })})
                  window.location.reload();
                }}>Change</Button>
            </div>
            <Card.Subtitle className="mb-2 text-muted">${order.date}</Card.Subtitle>
            <div>
              <Card.Link href={`/orders/${order.id}/${order.date}`}>View More</Card.Link>
            </div>
          </Card.Body>
        ))}
      </ListGroup.Item>
    </ListGroup>
  )
}

export default OrderScreen;