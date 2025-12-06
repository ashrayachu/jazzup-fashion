import AddProducts from "../../../components/products/AddProducts";
import { useParams } from 'react-router-dom';

const EditProductPage = () => {
    const { id } = useParams();

    return (
        <div>
            <AddProducts mode="edit" productId={id} />
        </div>
    );
};

export default EditProductPage;
