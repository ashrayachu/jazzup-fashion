import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Image, Tag, Button, Spin, Alert, Badge } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getSingleProductApi } from '../../api/admin/productApi';
import PageHeader from '../common/headers/PageHeader';

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getSingleProductApi(id);

                if (response?.data?.success) {
                    setProduct(response.data.product);
                } else {
                    setError('Failed to load product');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Calculate total stock from variants
    const calculateTotalStock = (variants) => {
        if (!variants || !Array.isArray(variants)) return 0;

        return variants.reduce((total, variant) => {
            const variantStock = variant.sizes?.reduce((sum, size) => {
                return sum + (size.quantity || 0);
            }, 0) || 0;
            return total + variantStock;
        }, 0);
    };

    // Get stock status with color
    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'red' };
        if (stock <= 10) return { label: 'Low Stock', color: 'orange' };
        return { label: 'In Stock', color: 'green' };
    };

    const handleEditButton = () => {
        navigate(`/admin/product-edit/${id}`);
    };

    const handleBackButton = () => {
        navigate('/admin/product-list');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading product..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={handleBackButton}>
                            Back to List
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">
                <Alert
                    message="Product Not Found"
                    description="The product you're looking for doesn't exist."
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" onClick={handleBackButton}>
                            Back to List
                        </Button>
                    }
                />
            </div>
        );
    }

    const totalStock = calculateTotalStock(product.variants);
    const stockStatus = getStockStatus(totalStock);

    return (
        <div>
            <PageHeader
                title="View Product"
                desc="View complete product details"
                customActions={
                    <>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBackButton}
                            size="large"
                        >
                            Back to List
                        </Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEditButton}
                            size="large"
                        >
                            Edit Product
                        </Button>
                    </>
                }
            />

            <div className="px-6 pb-6">
                {/* Basic Information Card */}
                <Card title="Product Information" className="mb-6">
                    <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                        <Descriptions.Item label="Product Name" span={2}>
                            <span className="font-semibold text-lg">{product.name}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Brand">
                            {product.brand}
                        </Descriptions.Item>
                        <Descriptions.Item label="Price">
                            <span className="text-lg font-semibold text-green-600">
                                ₹{product.price}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                            {product.category?.name || product.category || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sub Category">
                            {product.subCategory || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Stock">
                            <Tag color={stockStatus.color} className="text-sm font-semibold">
                                {totalStock} units - {stockStatus.label}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Size Type">
                            {product.sizeType || 'N/A'}
                        </Descriptions.Item>
                        {product.fabric && (
                            <Descriptions.Item label="Fabric">
                                {product.fabric || 'N/A'}
                            </Descriptions.Item>
                        )}
                        {product.fitType && (
                            <Descriptions.Item label="Fit Type">
                                {product.fitType }
                            </Descriptions.Item>
                        )}
                        {product.sleeveType && (
                            <Descriptions.Item label="Sleeve Type">
                                {product.sleeveType}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Description" span={2}>
                            {product.description || 'No description available'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Variants Section */}
                <Card title={`Product Variants (${product.variants?.length || 0})`}>
                    {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-6">
                            {product.variants.map((variant, index) => {
                                const variantStock = variant.sizes?.reduce((sum, size) =>
                                    sum + (size.quantity || 0), 0) || 0;
                                const variantStatus = getStockStatus(variantStock);

                                return (
                                    <Card
                                        key={index}
                                        type="inner"
                                        title={
                                            <div className="flex items-center gap-3">
                                                <span>Variant {index + 1}: {variant.color}</span>
                                                <Badge
                                                    color={variant.colorCode}
                                                    text={variant.colorCode}
                                                />
                                                <Tag color={variantStatus.color}>
                                                    Stock: {variantStock}
                                                </Tag>
                                            </div>
                                        }
                                        className="bg-gray-50"
                                    >
                                        {/* Variant Images */}
                                        {variant.images && variant.images.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium mb-2 text-gray-700">
                                                    Images ({variant.images.length})
                                                </h4>
                                                <Image.PreviewGroup>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {variant.images.map((image, imgIndex) => (
                                                            <Image
                                                                key={imgIndex}
                                                                src={image}
                                                                alt={`${variant.color} - ${imgIndex + 1}`}
                                                                width={120}
                                                                height={120}
                                                                className="object-cover rounded border"
                                                            />
                                                        ))}
                                                    </div>
                                                </Image.PreviewGroup>
                                            </div>
                                        )}

                                        {/* Sizes and Quantities */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-gray-700">
                                                Available Sizes
                                            </h4>
                                            <div className="flex gap-2 flex-wrap">
                                                {variant.sizes && variant.sizes.length > 0 ? (
                                                    variant.sizes.map((sizeItem, sizeIndex) => (
                                                        <Tag
                                                            key={sizeIndex}
                                                            color={sizeItem.quantity > 0 ? 'blue' : 'default'}
                                                            className="px-3 py-1"
                                                        >
                                                            {sizeItem.size}: {sizeItem.quantity} units
                                                        </Tag>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 italic">No sizes available</span>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No variants available for this product
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SingleProduct;
