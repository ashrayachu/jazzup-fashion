import { useParams } from 'react-router-dom';
import ViewCart from '../../components/userComponents/cart/ViewCart';

const CartPage = () => {
    const { id } = useParams();

    return (
        <div>
           <ViewCart />
        </div>
    );
};

export default CartPage;
