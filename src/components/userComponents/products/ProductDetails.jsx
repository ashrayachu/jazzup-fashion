import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();

    return (
        <div className="bg-[#010001]/95">
            <h1>Product Detail - {id}</h1>
        </div>
    );
};

export default ProductDetails;
