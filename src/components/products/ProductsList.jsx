import React, { useState, useEffect } from "react";
import { Table, Pagination } from "antd";
import { useNavigate } from 'react-router-dom';
import PageHeader from "../common/headers/PageHeader";
import ProductNavigation from "./ProductNavigation";
import { productListApi } from '../../api/admin/productApi';
import styles from '../../styles/TableStyles.module.css';

function ProductList() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{
    id:1234124124,
    name:"shirt"
  },{
    id:1234124122,
    name:"pants"
  }]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productListApi();
      console.log("Product List API Response:", response);
      
      if (response?.data?.success) {
        const productsData = response.data.data.products;
        console.log("Products:", productsData);
        
        // Add key for table and calculate total stock
        const processedProducts = productsData.map(product => ({
          ...product,
          key: product._id,
          totalStock: calculateTotalStock(product.variants)
        }));
        
        setProducts(processedProducts);
        
        // Extract unique categories and brands for filters

      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter data based on active tab
  const filteredData = products.filter((product) => {
    const stock = product.totalStock;
    
    switch (activeTab) {
      case "inStock":
        return stock > 10;
      case "lowStock":
        return stock > 0 && stock <= 10;
      case "outOfStock":
        return stock === 0;
      case "all":
      default:
        return true;
    }
  });

  const handleAddButton = () => {
    navigate('/admin/product-create');
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalItems = filteredData.length;

  // Define table columns
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img 
            src={record.variants?.[0]?.images?.[0] || '/placeholder-image.png'} 
            alt={text}
            className="w-12 h-12 object-cover rounded"
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category?.name || category || "N/A",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Total Stock",
      dataIndex: "totalStock",
      key: "totalStock",
      render: (stock) => (
        <span className={`font-semibold ${
          stock === 0 ? 'text-red-600' : 
          stock <= 10 ? 'text-orange-600' : 
          'text-green-600'
        }`}>
          {stock}
        </span>
      ),
    },
    {
      title: "Variants",
      key: "variants",
      render: (_, record) => (
        <span>{record.variants?.length || 0} colors</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/admin/product-edit/${record._id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button 
            onClick={() => console.log("View product:", record._id)}
            className="text-gray-600 hover:text-gray-800"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Products"
        desc="Manage and track all products in one place"
        addBtn="Add Product"
        handleAddButton={handleAddButton}
      />
      <div className="px-5">
        <ProductNavigation 
          activeTab={activeTab} 
          onChange={handleTabChange}
          categories={categories}
          brands={brands}
        />
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={paginatedData}
            loading={loading}
            pagination={false}
            className="bg-white rounded-lg"
            rowClassName={(record, index) =>
              index % 2 === 0 ? styles.tableRowLight : styles.tableRowDark
            }
          />
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between p-4 bg-white rounded-lg">
          <span className="text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} products
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductList;