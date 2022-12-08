import React, { SyntheticEvent, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap';

type adminDisplayType = {
  field: string;
  total: number;
}

function StatisticsScreen() {
  const [metric, setMetric] = useState('highestSold');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [res, setRes] = useState([]);
  const [firstView, setFirstView] = useState(true);



  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    let endPoint;

    switch (metric) {
      default:
      case 'highestSold':
        endPoint = 'highestsold'
        break;
      case 'highestSoldCustom':
        endPoint = 'highestsoldcustom'
        break;
      case 'topTenCustom':
        endPoint = 'bestcustomers'
        break;
      case 'zip':
        endPoint = 'zip'
        break;
      case 'avgSell':
        endPoint = 'type'
        break;
    };

    console.log(endPoint);
    const res = await fetch('http://localhost:8000/admin/' + endPoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate
      })
    });

    const parseRes = await res.json();
    if(res.status===200) {
      setRes(parseRes);
      if(firstView) setFirstView(false);
    }
  } 

  return (
    <>
      <Form onSubmit={submitHandler}>
        <div className="mb-3" >
          <Form.Check
            type='radio'
            id='1'
            label='Highest Sold Products'
            onChange={(e) => setMetric('highestSold')}
            checked={metric === 'highestSold'}
          />

          <Form.Check
            type='radio'
            id='2'
            label='Highest Sold Products to Distinct Customers'
            onChange={(e) => setMetric('highestSoldCustom')}
            checked={metric === 'highestSoldCustom'}
          />

          <Form.Check
            type='radio'
            id='3'
            label='Top 10 customers'
            onChange={(e) => setMetric('topTenCustom')}
            checked={metric === 'topTenCustom'}
          />

          <Form.Check
            type='radio'
            id='4'
            label='Best Zip Codes'
            onChange={(e) => setMetric('zip')}
            checked={metric === 'zip'}
          />

          <Form.Check
            type='radio'
            id='5'
            label='Average Selling Products'
            onChange={(e) => setMetric('avgSell')}
            checked={metric === 'avgSell'}
          />

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" placeholder="Enter startDate" value={startDate}
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
      {!firstView && (<Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {res.map((ele: adminDisplayType) =>
            <tr>
              <td>{ele.field}</td>
              <td>{ele.total}</td>
            </tr>
          )}
        </tbody>
      </Table>)}
    </>
  )
}

export default StatisticsScreen;