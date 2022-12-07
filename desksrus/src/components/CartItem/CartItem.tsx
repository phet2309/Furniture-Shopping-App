// Types
import { Button } from 'react-bootstrap';
import { CartItemType } from '../../screens/StoreScreen/StoreScreen';
// Styles

type Props = {
    item: CartItemType;
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
};

const CartItem = ({ item, addToCart, removeFromCart }: Props) => (
    <div className='wrapper'>
        <div>
            <h3>{item.title}</h3>
            <div className='information'>
                <p>Price: ${item.price}</p>
                <p>Total: ${(item.amount * item.price).toFixed(2)}</p>
            </div>
            {/* <div> */}
                <Button
                    size='sm'
                    variant='contained'
                    onClick={() => removeFromCart(item.id)}
                >
                    -
                </Button>
                <p>{item.amount}</p>
                <Button
                    size='sm'
                    variant='contained'
                    onClick={() => addToCart(item)}
                >
                    +
                </Button>
            {/* </div> */}
        </div>
        <img src={item.image} alt={item.title} />
    </div>
);

export default CartItem;