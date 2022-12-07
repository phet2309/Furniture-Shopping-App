import React from 'react'
import { Badge, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';

interface Props {
  setAuth: (isAuthenticated: boolean) => void;
}

type TransactionType = {
  id: number;
  tstatus: string;
  tdate: string;
  totalamount: number;
}

const getTransactions = async (): Promise<TransactionType[]> => await (await fetch('http://localhost:8000/transactions')).json();


const TransactionScreen = ({ setAuth }: Props) => {
  const { data, isLoading, error } = useQuery<TransactionType[]>('transactions', getTransactions);

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '75vh' }}>
        <Spinner animation="border" />
      </div>
    )
  }
  if (error) return <div>Something went wrong...</div>


  return (
    <ListGroup>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        {data?.map(transaction => (
          <Card.Body className='d-block'>
            <div className='d-flex justify-content-between'>
              <Card.Title>${transaction.totalamount}</Card.Title>
              {transaction.tstatus === 'Completed' ? <Badge bg="success">Success</Badge> : <Badge bg="warning">Pending</Badge>}
            </div>
            <Card.Subtitle className="mb-2 text-muted">${transaction.tdate}</Card.Subtitle>
            <div>
              <Card.Link href={`/transaction/${transaction.id}`}>View More</Card.Link>
            </div>
          </Card.Body>
        ))}
      </ListGroup.Item>
    </ListGroup>
  )
}

export default TransactionScreen;