import React from 'react'
import { Accordion, ListGroup, Spinner, Table } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { RouteComponentProps, useParams } from 'react-router-dom';

interface Props {
    setAuth: (isAuthenticated: boolean) => void;
}

type OrderItemType = {
    date: string;
    productDetails: ProductDetailType[];
    deliveryCardDetail: deliveryCardDetailType;
}

type ProductDetailType = {
    pname: string;
    quantity: number;
    pricesold: number;
    subtotal: number;
}

type deliveryCardDetailType = {
    shippingaddress: string,
    name: string,
    cardtype: string,
    billingaddress: string,
    totalamount: number
}


const OrderScreenItem = () => {
    const { id, date } = useParams<{ id?: string, date?: string }>();
    const getOrder = async (): Promise<OrderItemType> => await (await fetch(`http://localhost:8000/orders/${id}/${date}`)).json();

    const { data, isLoading, error } = useQuery<OrderItemType>('order', getOrder);

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
            <Accordion alwaysOpen defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Order Summary</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.productDetails.map(product => (
                                    <tr>
                                        <td>{product.pname}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.pricesold}</td>
                                        <td>{product.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <h2>Total : {data?.deliveryCardDetail.totalamount}</h2>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Card Details</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            <ListGroup.Item>Card Name : {data?.deliveryCardDetail.name}</ListGroup.Item>
                            <ListGroup.Item>Card Provider : {data?.deliveryCardDetail.cardtype}</ListGroup.Item>
                            <ListGroup.Item>Billing Address : {data?.deliveryCardDetail.billingaddress}</ListGroup.Item>
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Shipping Details</Accordion.Header>
                    <Accordion.Body>
                        Shipping Address : ${data?.deliveryCardDetail.shippingaddress}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export default OrderScreenItem;