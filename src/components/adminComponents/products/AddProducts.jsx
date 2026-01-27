import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Upload, InputNumber, ColorPicker, message, Image as AntImage } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { productCreateApi, categoryListApi } from '../../../api/admin/productApi';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

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
    variants: [
      {
        color: '',
        colorCode: '#000000',
        images: [],
        imageFiles: [],
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

          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new file from the blob
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/webp',
            0.8 // Quality: 0.8 = 80%
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Fetch categories on mount
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

  const handleColorsExtracted = (colors, variantIndex) => {
    if (colors && colors.length > 0) {
      const dominantColor = colors[0];
      const newVariants = [...formData.variants];
      newVariants[variantIndex].colorCode = dominantColor;
      setFormData({ ...formData, variants: newVariants });
    }
    // Clear extraction flag
    setExtractingColors({ ...extractingColors, [variantIndex]: false });
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

    return false; // Prevent auto upload
  };

  const handleImageUpload = async (info, variantIndex) => {
    const { fileList } = info;

    // Compress images before adding to state
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

    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { color: '', colorCode: '#000000', images: [], imageFiles: [], sizes: [{ size: '', quantity: '' }] }
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

  const handleRemoveImage = (variantIndex, imageIndex) => {
    const variant = formData.variants[variantIndex];
    const totalImages = variant.imageFiles?.length || 0;

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
        if (!variant.color || variant.imageFiles.length === 0) {
          message.error(`Variant ${i + 1}: Please provide color name and at least one image`);
          return;
        }
        if (variant.sizes.some(s => !s.size || !s.quantity)) {
          message.error(`Variant ${i + 1}: Please fill in all size and quantity fields`);
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

      const variantsData = formData.variants.map((variant) => ({
        color: variant.color,
        colorCode: variant.colorCode,
        imageCount: variant.imageFiles.length,
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

      message.loading({ content: 'Creating product...', key: 'createProduct' });

      const response = await productCreateApi(form);

      message.success({
        content: response.data.message || 'Product created successfully!',
        key: 'createProduct'
      });

      console.log("Product created:", response.data.product);

      setFormData({
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
        variants: [
          {
            color: '',
            colorCode: '#000000',
            images: [],
            imageFiles: [],
            sizes: [{ size: '', quantity: '' }]
          }
        ]
      });

    } catch (err) {
      console.error("Error creating product:", err);
      message.error({
        content: err.response?.data?.message || 'Failed to create product.',
        key: 'createProduct'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>

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
                Upload Product Images *
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

              {variant.imageFiles?.length > 0 && (
                <div className="mt-4 mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Image Previews ({variant.imageFiles.length} total)
                  </label>
                  <AntImage.PreviewGroup>
                    <div className="flex flex-wrap gap-2">
                      {/* Display newly uploaded images */}
                      {variant.imageFiles.map((file, idx) => {
                        if (file.originFileObj) {
                          const totalImages = variant.imageFiles?.length || 0;
                          const previewUrl = URL.createObjectURL(file.originFileObj);
                          return (
                            <div key={`new-${idx}`} className="relative group">
                              <AntImage
                                src={previewUrl}
                                alt={`Image ${idx + 1}`}
                                width={100}
                                height={100}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                              />
                              {totalImages > 1 && (
                                <button
                                  onClick={() => handleRemoveImage(variantIndex, idx)}
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
                  <span className="text-xs text-gray-500 ml-2">(Auto-detected - you can edit)</span>
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

      <div className="flex justify-end gap-3">
        <Button size="large">Cancel</Button>
        <Button type="primary" size="large" onClick={handleSubmit}>
          Save Product
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;