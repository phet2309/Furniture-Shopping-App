import React from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { CartItemType } from '../StoreScreen/StoreScreen';
import './ProductDetail.css';

interface Props {
    setAuth: (isAuthenticated: boolean) => void;
}

const token = localStorage.getItem('token');
console.log(token);
const getProduct = async (id: string): Promise<CartItemType> => await (await fetch(`http://localhost:8000/products/${id}`,{
    headers: {'token': `${token}`}
})).json();

const ProductDetailScreen = () => {
    const { id }: { id: string } = useParams();
    const { data, isLoading, error } = useQuery<CartItemType>(`queryKey${id}`, async () => await getProduct(id));

    if (isLoading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '75vh' }}>
                <Spinner animation="border" />
            </div>
        )
    }
    if (error) return <div>Something went wrong...</div>

    console.log(data);
    return (
        <div className='product'>
            <img src={data?.image} />
            <div className='details'>
                <h3>{data?.title}</h3>
                <p>{data?.description}</p>
                <h3>${data?.price}</h3>
                <Button variant="primary">Add to cart</Button>
            </div>
        </div>
    )
}

export default ProductDetailScreen;