import React, { useEffect } from "react";
import { Table, Pagination } from "antd";
import { useNavigate } from 'react-router-dom';
import PageHeader from "../../common/headers/PageHeader";
import ProductNavigation from "./ProductNavigation";
import useAdminProductStore from '../../../store/useAdminProductStore';
import styles from '../../../styles/TableStyles.module.css';

function ProductList() {
  const navigate = useNavigate();

  // Get state and actions from Zustand store
  const {
    products,
    loading,
    pagination,
    filters,
    fetchProducts,
    setPage,
    setPageSize,
    setFilters,
    clearFilters
  } = useAdminProductStore();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddButton = () => {
    navigate('/admin/product-create');
  };

  const handlePageChange = (page, size) => {
    if (size !== pagination.limit) {
      setPageSize(size);
    } else {
      setPage(page);
    }
  };

  const handleTabChange = (tab) => {
    setFilters({ stockStatus: tab });
  };

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
        <span className={`font-semibold ${stock === 0 ? 'text-red-600' :
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
            onClick={() => navigate(`/admin/product/${record._id}`)}
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
          activeTab={filters.stockStatus}
          onChange={handleTabChange}
          onFilterChange={setFilters}
          onReset={clearFilters}
          currentFilters={filters}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={products}
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
            Showing {pagination.totalProducts > 0 ? ((pagination.currentPage - 1) * pagination.limit + 1) : 0}–
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of {pagination.totalProducts} products
          </span>
          <Pagination
            current={pagination.currentPage}
            pageSize={pagination.limit}
            total={pagination.totalProducts}
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