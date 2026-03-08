import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Input, Select, Button, Upload, InputNumber, ColorPicker,
    message, Spin, Image as AntImage, Card, Descriptions, Tag, Badge, Alert
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined, SaveOutlined
} from '@ant-design/icons';
import { categoryListApi, getSingleProductApi, updateProductApi } from '../../../api/admin/productApi';
import PageHeader from '../../common/headers/PageHeader';

const { TextArea } = Input;
const { Option } = Select;

const EditProducts = ({ mode = 'view', productId = null }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const finalProductId = productId || id;
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        categoryId: '',
        subCategory: '',
        price: '',
        description: '',
        sizeType: '',
        fabric: '',
        fitType: '',
        sleeveType: '',
        collections: [], // Collection tags
        variants: [
            {
                color: '',
                colorCode: '#000000',
                images: [],
                imageFiles: [],
                existingImages: [],
                sizes: [{ size: '', quantity: '' }]
            }
        ]
    });

    const sizeTypeOptions = {
        Perfume: 'Volume (ml)',
        Pant: 'Waist',
        Shirt: 'Chest',
        Shoes: 'Foot Size',
        default: 'Standard'
    };

    // Image compression function
    const compressImage = (file, maxWidth = 400) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                // Create a new file from the blob with .webp extension
                                const webpFilename = file.name.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
                                const compressedFile = new File([blob], webpFilename, {
                                    type: 'image/webp',
                                    lastModified: Date.now()
                                });
                                resolve(compressedFile);
                            } else {
                                reject(new Error('Canvas to Blob conversion failed'));
                            }
                        },
                        'image/webp',
                        0.8
                    );
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryListApi();
                setCategories(response.data.categories);
            } catch (err) {
                console.error("Error fetching categories:", err);
                message.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (!finalProductId) return;

            try {
                setLoading(true);
                const response = await getSingleProductApi(finalProductId);

                if (response?.data?.success) {
                    const productData = response.data.product;
                    setProduct(productData);

                    // Populate form data for edit mode
                    setFormData({
                        name: productData.name,
                        brand: productData.brand,
                        categoryId: productData.category?._id || productData.category,
                        subCategory: productData.subCategory,
                        price: productData.price,
                        description: productData.description || '',
                        sizeType: productData.sizeType || '',
                        fabric: productData.fabric || '',
                        fitType: productData.fitType || '',
                        sleeveType: productData.sleeveType || '',
                        collections: productData.collections || [],
                        variants: productData.variants.map(variant => ({
                            color: variant.color,
                            colorCode: variant.colorCode,
                            images: variant.images || [],
                            imageFiles: [],
                            existingImages: variant.images || [],
                            sizes: variant.sizes || [{ size: '', quantity: '' }]
                        }))
                    });
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

        fetchProduct();
    }, [finalProductId]);

    // Calculate total stock
    const calculateTotalStock = (variants) => {
        if (!variants || !Array.isArray(variants)) return 0;
        return variants.reduce((total, variant) => {
            const variantStock = variant.sizes?.reduce((sum, size) => {
                return sum + (size.quantity || 0);
            }, 0) || 0;
            return total + variantStock;
        }, 0);
    };

    // Get stock status
    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'red' };
        if (stock <= 10) return { label: 'Low Stock', color: 'orange' };
        return { label: 'In Stock', color: 'green' };
    };

    const getSubCategories = (categoryId) => {
        if (!categories || !Array.isArray(categories)) return [];
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.subCategories : [];
    };

    const handleCategoryChange = (categoryId) => {
        if (!categories || !Array.isArray(categories)) return;
        const category = categories.find(cat => cat._id === categoryId);
        setFormData({
            ...formData,
            categoryId,
            subCategory: '',
            sizeType: sizeTypeOptions[category?.name] || sizeTypeOptions.default
        });
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].sizes[sizeIndex][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const handleImageUpload = async (info, variantIndex) => {
        const { fileList } = info;

        const compressedFileList = await Promise.all(
            fileList.map(async (file) => {
                if (file.originFileObj && !file.compressed) {
                    try {
                        const compressedFile = await compressImage(file.originFileObj);
                        return {
                            ...file,
                            originFileObj: compressedFile,
                            compressed: true
                        };
                    } catch (error) {
                        console.error('Error compressing image:', error);
                        message.error(`Failed to compress ${file.name}`);
                        return file;
                    }
                }
                return file;
            })
        );

        const newVariants = [...formData.variants];
        newVariants[variantIndex].imageFiles = compressedFileList;

        const newImageUrls = compressedFileList
            .filter(file => file.originFileObj)
            .map(file => URL.createObjectURL(file.originFileObj));

        const existingImages = newVariants[variantIndex].existingImages || [];
        newVariants[variantIndex].images = [...existingImages, ...newImageUrls];

        setFormData({ ...formData, variants: newVariants });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { color: '', colorCode: '#000000', images: [], imageFiles: [], existingImages: [], sizes: [{ size: '', quantity: '' }] }
            ]
        });
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    const addSize = (variantIndex) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].sizes.push({ size: '', quantity: '' });
        setFormData({ ...formData, variants: newVariants });
    };

    const removeSize = (variantIndex, sizeIndex) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleDeleteExistingImage = (variantIndex, imageIndex) => {
        const variant = formData.variants[variantIndex];
        const totalImages = (variant.existingImages?.length || 0) + (variant.imageFiles?.length || 0);

        // Prevent deletion if only one image exists
        if (totalImages <= 1) {
            message.warning('Each variant must have at least one image');
            return;
        }

        const newVariants = [...formData.variants];
        newVariants[variantIndex].existingImages = newVariants[variantIndex].existingImages.filter(
            (_, idx) => idx !== imageIndex
        );
        setFormData({ ...formData, variants: newVariants });
        message.success('Image removed successfully');
    };

    const handleRemoveNewImage = (variantIndex, imageIndex) => {
        const variant = formData.variants[variantIndex];
        const totalImages = (variant.existingImages?.length || 0) + (variant.imageFiles?.length || 0);

        // Prevent deletion if only one image exists
        if (totalImages <= 1) {
            message.warning('Each variant must have at least one image');
            return;
        }

        const newVariants = [...formData.variants];
        newVariants[variantIndex].imageFiles = newVariants[variantIndex].imageFiles.filter(
            (_, idx) => idx !== imageIndex
        );
        setFormData({ ...formData, variants: newVariants });
        message.success('Image removed successfully');
    };


    const handleSubmit = async () => {
        try {
            if (!formData.name || !formData.brand || !formData.categoryId || !formData.subCategory || !formData.price) {
                message.error('Please fill in all required fields');
                return;
            }

            for (let i = 0; i < formData.variants.length; i++) {
                const variant = formData.variants[i];
                if (!variant.color) {
                    message.error(`Variant ${i + 1}: Please provide color name`);
                    return;
                }
                if (variant.sizes.some(s => !s.size || !s.quantity)) {
                    message.error(`Variant ${i + 1}: Please fill in all size and quantity fields`);
                    return;
                }

                // Validate each variant has at least one image
                const totalImages = (variant.existingImages?.length || 0) + (variant.imageFiles?.length || 0);
                if (totalImages === 0) {
                    message.error(`Variant ${i + 1}: Each variant must have at least one image`);
                    return;
                }
            }

            const form = new FormData();

            form.append("name", formData.name);
            form.append("brand", formData.brand);
            form.append("categoryId", formData.categoryId);
            form.append("subCategory", formData.subCategory);
            form.append("price", formData.price);
            form.append("description", formData.description);
            form.append("sizeType", formData.sizeType);
            form.append("fabric", formData.fabric || "");
            form.append("fitType", formData.fitType || "");
            form.append("sleeveType", formData.sleeveType || "");
            form.append("collections", JSON.stringify(formData.collections));

            const variantsData = formData.variants.map((variant) => ({
                color: variant.color,
                colorCode: variant.colorCode,
                imageCount: variant.imageFiles.length,
                existingImages: variant.existingImages,
                sizes: variant.sizes.map(s => ({
                    size: s.size,
                    quantity: s.quantity
                }))
            }));

            form.append('variants', JSON.stringify(variantsData));

            formData.variants.forEach((variant, variantIndex) => {
                variant.imageFiles.forEach((fileWrapper, imageIndex) => {
                    if (fileWrapper.originFileObj) {
                        form.append(`variant_${variantIndex}_image_${imageIndex}`, fileWrapper.originFileObj);
                    }
                });
            });

            message.loading({ content: 'Updating product...', key: 'updateProduct' });

            // Log FormData contents (FormData objects don't show values with console.log directly)
            console.log("=== FormData Contents ===");
            for (let pair of form.entries()) {
                console.log(pair[0], ':', pair[1]);
            }

            const response = await updateProductApi(finalProductId, form);

            message.success({
                content: 'Product updated successfully!',
                key: 'updateProduct'
            });

            // navigate('/admin/product-list');

        } catch (err) {
            console.error("Error updating product:", err);
            message.error({
                content: err.response?.data?.message || 'Failed to update product.',
                key: 'updateProduct'
            });
        }
    };

    const handleBackButton = () => {
        navigate('/admin/product-list');
    };

    const handleEditButton = () => {
        navigate(`/admin/product-edit/${finalProductId}`);
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

    // VIEW MODE - Display product details
    if (isViewMode) {
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
                                    {product.fitType}
                                </Descriptions.Item>
                            )}
                            {product.sleeveType && (
                                <Descriptions.Item label="Sleeve Type">
                                    {product.sleeveType}
                                </Descriptions.Item>
                            )}
                            {product.collections && product.collections.length > 0 && (
                                <Descriptions.Item label="Collections" span={2}>
                                    {product.collections.map((collection, idx) => (
                                        <Tag key={idx} color="blue" className="mb-1">
                                            {collection}
                                        </Tag>
                                    ))}
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
                                                    <AntImage.PreviewGroup>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {variant.images.map((image, imgIndex) => (
                                                                <AntImage
                                                                    key={imgIndex}
                                                                    src={image}
                                                                    alt={`${variant.color} - ${imgIndex + 1}`}
                                                                    width={120}
                                                                    height={120}
                                                                    className="object-cover rounded border"
                                                                />
                                                            ))}
                                                        </div>
                                                    </AntImage.PreviewGroup>
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
    }

    // EDIT MODE - Editable form
    return (
        <div>
            <PageHeader
                title="Edit Product"
                desc="Update product information"
                customActions={
                    <>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBackButton}
                            size="large"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSubmit}
                            size="large"
                        >
                            Save Changes
                        </Button>
                    </>
                }
            />

            <div className="px-6 pb-6">
                <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Product Name *</label>
                                <Input
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    size="large"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Brand *</label>
                                <Input
                                    placeholder="Enter brand name"
                                    value={formData.brand}
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                    size="large"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Category *</label>
                                <Select
                                    placeholder="Select category"
                                    value={formData.categoryId || undefined}
                                    onChange={handleCategoryChange}
                                    size="large"
                                    className="w-full"
                                >
                                    {categories?.map((cat) => (
                                        <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Sub Category *</label>
                                <Select
                                    placeholder="Select sub category"
                                    value={formData.subCategory || undefined}
                                    onChange={(value) => handleInputChange('subCategory', value)}
                                    size="large"
                                    className="w-full"
                                    disabled={!formData.categoryId}
                                >
                                    {formData.categoryId &&
                                        getSubCategories(formData.categoryId).map((sub) => (
                                            <Option key={sub} value={sub}>{sub}</Option>
                                        ))}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Price (₹) *</label>
                                <InputNumber
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={(value) => handleInputChange('price', value)}
                                    size="large"
                                    className="w-full"
                                    min={0}
                                    prefix="₹"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Size Type</label>
                                <Input
                                    placeholder="e.g., Volume (ml), Waist, Chest"
                                    value={formData.sizeType}
                                    onChange={(e) => handleInputChange('sizeType', e.target.value)}
                                    size="large"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {(formData.categoryId === 'Pant' || formData.categoryId === 'Shirt') && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Fabric</label>
                                    <Input
                                        placeholder="e.g., Cotton, Polyester"
                                        value={formData.fabric}
                                        onChange={(e) => handleInputChange('fabric', e.target.value)}
                                        size="large"
                                    />
                                </div>
                            )}
                            {formData.categoryId === 'Pant' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Fit Type</label>
                                    <Select
                                        placeholder="Select fit type"
                                        value={formData.fitType || undefined}
                                        onChange={(value) => handleInputChange('fitType', value)}
                                        size="large"
                                        className="w-full"
                                    >
                                        <Option value="Slim">Slim</Option>
                                        <Option value="Regular">Regular</Option>
                                        <Option value="Relaxed">Relaxed</Option>
                                        <Option value="Skinny">Skinny</Option>
                                    </Select>
                                </div>
                            )}
                            {formData.categoryId === 'Shirt' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Sleeve Type</label>
                                    <Select
                                        placeholder="Select sleeve type"
                                        value={formData.sleeveType || undefined}
                                        onChange={(value) => handleInputChange('sleeveType', value)}
                                        size="large"
                                        className="w-full"
                                    >
                                        <Option value="Full">Full</Option>
                                        <Option value="Half">Half</Option>
                                        <Option value="Sleeveless">Sleeveless</Option>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
                            <TextArea
                                placeholder="Enter product description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                size="large"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1 text-gray-600">
                                Collections (Tags)
                                <span className="text-xs text-gray-500 ml-2">(Select which collections this product belongs to)</span>
                            </label>
                            <Select
                                mode="tags"
                                placeholder="Select or create collections (e.g., New Arrivals, Best Sellers)"
                                value={formData.collections}
                                onChange={(value) => handleInputChange('collections', value)}
                                size="large"
                                className="w-full"
                                options={[
                                    { label: 'New Arrivals', value: 'New Arrivals' },
                                    { label: 'Best Sellers', value: 'Best Sellers' },
                                    { label: 'Featured', value: 'Featured' },
                                    { label: 'Sale', value: 'Sale' },
                                    { label: 'Summer Collection', value: 'Summer Collection' },
                                    { label: 'Winter Collection', value: 'Winter Collection' },
                                    { label: 'Trending', value: 'Trending' },
                                    { label: 'Premium', value: 'Premium' },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Product Variants</h2>
                            <Button type="dashed" onClick={addVariant} icon={<PlusOutlined />}>
                                Add Variant
                            </Button>
                        </div>

                        {formData.variants.map((variant, variantIndex) => (
                            <div key={variantIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-700">Variant {variantIndex + 1}</h3>
                                    {formData.variants.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeVariant(variantIndex)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-600">
                                        Upload Product Images
                                        <span className="text-xs text-gray-500 ml-2">(Images will be compressed to ~400px width)</span>
                                    </label>
                                    <Upload
                                        listType="picture-card"
                                        fileList={variant.imageFiles}
                                        onChange={(info) => handleImageUpload(info, variantIndex)}
                                        beforeUpload={beforeUpload}
                                        multiple
                                        accept="image/*"
                                        customRequest={({ onSuccess }) => {
                                            onSuccess("ok");
                                        }}
                                    >
                                        {variant.imageFiles.length >= 8 ? null : (
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>

                                    {(variant.existingImages.length > 0 || variant.imageFiles.length > 0) && (
                                        <div className="mt-4 mb-4">
                                            <label className="block text-sm font-medium mb-2 text-gray-600">
                                                Image Previews ({variant.existingImages.length + variant.imageFiles.length} total)
                                            </label>
                                            <AntImage.PreviewGroup>
                                                <div className="flex flex-wrap gap-2">
                                                    {variant.existingImages.map((imgUrl, idx) => {
                                                        const totalImages = (variant.existingImages?.length || 0) + (variant.imageFiles?.length || 0);
                                                        return (
                                                            <div key={`existing-${idx}`} className="relative group">
                                                                <AntImage
                                                                    src={imgUrl}
                                                                    alt={`Existing ${idx + 1}`}
                                                                    width={100}
                                                                    height={100}
                                                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                                />
                                                                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                                                    Existing
                                                                </span>
                                                                {totalImages > 1 && (
                                                                    <button
                                                                        onClick={() => handleDeleteExistingImage(variantIndex, idx)}
                                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                                        title="Delete image"
                                                                    >
                                                                        <DeleteOutlined className="text-xs" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {variant.imageFiles.map((file, idx) => {
                                                        if (file.originFileObj) {
                                                            const totalImages = (variant.existingImages?.length || 0) + (variant.imageFiles?.length || 0);
                                                            const previewUrl = URL.createObjectURL(file.originFileObj);
                                                            return (
                                                                <div key={`new-${idx}`} className="relative group">
                                                                    <AntImage
                                                                        src={previewUrl}
                                                                        alt={`New ${idx + 1}`}
                                                                        width={100}
                                                                        height={100}
                                                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                                    />
                                                                    <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                                                                        New
                                                                    </span>
                                                                    {totalImages > 1 && (
                                                                        <button
                                                                            onClick={() => handleRemoveNewImage(variantIndex, idx)}
                                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                                            title="Delete image"
                                                                        >
                                                                            <DeleteOutlined className="text-xs" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            </AntImage.PreviewGroup>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-600">Color Name *</label>
                                        <Input
                                            placeholder="e.g., Red, Navy Blue"
                                            value={variant.color}
                                            onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
                                            size="large"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-600">
                                            Color Code *
                                        </label>
                                        <div className="flex gap-2">
                                            <ColorPicker
                                                value={variant.colorCode}
                                                onChange={(color) => handleVariantChange(variantIndex, 'colorCode', color.toHexString())}
                                                showText
                                                size="large"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-600">Sizes & Quantity</label>
                                        <Button
                                            type="dashed"
                                            size="small"
                                            onClick={() => addSize(variantIndex)}
                                            icon={<PlusOutlined />}
                                        >
                                            Add Size
                                        </Button>
                                    </div>

                                    {variant.sizes.map((sizeItem, sizeIndex) => (
                                        <div key={sizeIndex} className="flex gap-2 mb-2">
                                            <Input
                                                placeholder="Size (e.g., M, 32, 100ml)"
                                                value={sizeItem.size}
                                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'size', e.target.value)}
                                                size="large"
                                                className="flex-1"
                                            />
                                            <InputNumber
                                                placeholder="Quantity"
                                                value={sizeItem.quantity}
                                                onChange={(value) => handleSizeChange(variantIndex, sizeIndex, 'quantity', value)}
                                                size="large"
                                                min={0}
                                                className="w-32"
                                            />
                                            {variant.sizes.length > 1 && (
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeSize(variantIndex, sizeIndex)}
                                                    size="large"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;