import EditProducts from "../../../components/adminComponents/products/EditProducts";
import { useParams, useLocation } from 'react-router-dom';

const EditProductPage = () => {
    const { id } = useParams();
    const location = useLocation();

    // Determine mode based on route path
    const mode = location.pathname.includes('/product-edit/') ? 'edit' : 'view';

    return (
        <div>
            <EditProducts mode={mode} productId={id} />
        </div>
    );
};

export default EditProductPage;
