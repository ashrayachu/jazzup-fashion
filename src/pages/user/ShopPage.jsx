import { useParams } from 'react-router-dom';
import ShopSection from '../../components/userComponents/shop/ShopSection';

const ShopPage = () => {
    const { id } = useParams();

    return (
        <div>
           <ShopSection />
        </div>
    );
};

export default ShopPage;
