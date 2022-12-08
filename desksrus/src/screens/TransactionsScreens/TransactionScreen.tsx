import React, { SyntheticEvent, useState } from 'react'
import { Badge, Button, Card, Form, ListGroup, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';


type TransactionType = {
  transactionid: number;
  tstatus: string;
  tdate: string;
  totalamount: number;
}

const getTransactions = async (): Promise<TransactionType[]> => {
  const token = localStorage.getItem('token');
  const header = { 'token': `${token}` };
  return await (await fetch('http://localhost:8000/transactions/all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'token': `${token}` },
    body: JSON.stringify({
      product: "",
      startDate: "",
      endDate: ""
    })
  })).json();
}


const TransactionScreen = () => {
  const [metric, setMetric] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [product, setProduct] = useState('');
  const [firstView, setFirstView] = useState(true);
  var { data, isLoading, error } = useQuery<TransactionType[]>('transactions', getTransactions);
  const [res, setRes] = useState(data);

  const submitHandler = async (e: SyntheticEvent) => {
    let criteria;
    e.preventDefault();
    if (metric === 'all') {
      criteria = 'all';
    } else if (metric === 'product') {
      criteria = 'product';
    } else {
      criteria = 'daterange';
    }

    const token = localStorage.getItem('token');
    const res1 = await fetch(`http://localhost:8000/transactions/${criteria}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': `${token}` },
      body: JSON.stringify({
        product,
        startDate,
        endDate
      })
    });

    if (res1.status === 200) {
      setRes(await res1.json());
    }
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
      <h2>Filters</h2>
      <Form onSubmit={submitHandler}>
        <div className="mb-3" >
          <Form.Check
            type='radio'
            id='1'
            label='All'
            onChange={(e) => setMetric('all')}
            checked={metric === 'all'}
          />

          <Form.Check
            type='radio'
            id='2'
            label='Transaction for specific products'
            onChange={(e) => setMetric('product')}
            checked={metric === 'product'}
          />

          <Form.Check
            type='radio'
            id='3'
            label='Transactions for date range'
            onChange={(e) => setMetric('daterange')}
            checked={metric === 'daterange'}
          />

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Product Name</Form.Label>
            <Form.Control type="text" placeholder="Enter product name" value={product}
              onChange={(e) => setProduct(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" placeholder="startDate" value={startDate}
              onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" placeholder="endDate" value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
      <ListGroup>
        <ListGroup.Item
          as="li"
        >
          {res?.map(transaction => (
            <Card.Body className='d-block' style={{ margin: '1rem' }}>
              <div className='d-flex justify-content-between'>
                <Card.Title>${transaction.totalamount}</Card.Title>
                {transaction.tstatus === 'Completed' ? <Badge bg="success">Success</Badge> : <Badge bg="warning">Pending</Badge>}
              </div>
              <Card.Subtitle className="mb-2 text-muted">${transaction.tdate}</Card.Subtitle>
              {/* <div>
              <Card.Link href={`/transaction/${transaction.transactionid}`}>View More</Card.Link>
            </div> */}
            </Card.Body>
          ))}
        </ListGroup.Item>
      </ListGroup>
    </>
  )
}

export default TransactionScreen;