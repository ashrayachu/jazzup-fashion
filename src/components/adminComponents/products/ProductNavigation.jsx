import React, { useState, useEffect } from "react";
import { Select, Input, Button } from "antd";
import { DownOutlined, SettingOutlined, FilterOutlined } from "@ant-design/icons";
import { categoryListApi } from '../../../api/admin/productApi';

const { Search } = Input;

// Product Navigation Component with Filters
const ProductNavigation = ({
    activeTab,
    onChange,
    onFilterChange,
    onReset,
    currentFilters
}) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(currentFilters.search || '');
    const searchTimeoutRef = React.useRef(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryListApi();
                console.log("Category API Response:", response);
                console.log("Categories data:", response?.data?.categories);
                if (response?.data?.success) {
                    setCategories(response.data.categories || []);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Stock status options
    const stockOptions = [
        { value: "all", label: "All Stock Levels" },
        { value: "inStock", label: "In Stock" },
        { value: "lowStock", label: "Low Stock" },
        { value: "outOfStock", label: "Out of Stock" }
    ];

    // Convert categories to options format
    const categoryOptions = [
        { value: null, label: "All Categories" },
        ...(categories || []).map(cat => ({
            value: cat._id || cat.id,
            label: cat.name || cat
        }))
    ];

    console.log("Categories state:", categories);
    console.log("Category options:", categoryOptions);

    // Convert brands to options format
    const brandOptions = [
        { value: null, label: "All Brands" },
        ...(brands || []).map(brand => ({
            value: brand,
            label: brand
        }))
    ];

    const handleStockChange = (value) => {
        onChange(value); // Call the onChange prop for stock status
    };

    const handleCategoryChange = (value) => {
        onFilterChange({ category: value });
    };

    const handleBrandChange = (value) => {
        onFilterChange({ brand: value });
    };

    const handleSearchChange = (value) => {
        // Update local state immediately for responsive UI
        setLocalSearch(value);

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced API call
        searchTimeoutRef.current = setTimeout(() => {
            onFilterChange({ search: value });
        }, 600); // 600ms delay
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleReset = () => {
        setLocalSearch(''); // Clear local search state
        onReset();
    };

    return (
        <div className="mb-6 pb-4 border-b border-gray-200">
            {/* Main row with filters */}
            <div className="flex items-center justify-between px-2 sm:px-0">
                {/* Desktop filters - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-3 flex-wrap">
                    {/* Stock Status Dropdown */}
                    <Select
                        placeholder="Stock Status"
                        value={activeTab}
                        onChange={handleStockChange}
                        options={stockOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-40"
                    />

                    {/* Category Dropdown */}
                    <Select
                        placeholder="Category"
                        value={currentFilters.category}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-40"
                        allowClear
                    />

                    {/* Brand Dropdown */}
                    <Select
                        placeholder="Brand"
                        value={currentFilters.brand}
                        onChange={handleBrandChange}
                        options={brandOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-40"
                        allowClear
                    />

                    {/* Search Bar */}
                    <Search
                        placeholder="Search by product name..."
                        value={localSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onSearch={handleSearchChange}
                        className="w-80"
                        allowClear
                        onClear={() => handleSearchChange('')}
                    />

                    {/* Reset Button */}
                    <Button
                        className="text-gray-600 border rounded-lg border-gray-200 outline-none"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                    {/* Settings Button */}
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => console.log("Settings clicked")}
                        className="text-gray-600"
                    />
                </div>

                {/* Filter toggle button - Mobile only */}
                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden text-gray-600"
                    type={showFilters ? "primary" : "default"}
                />
            </div>

            {/* Mobile filters dropdown */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:hidden px-2 pb-3 pt-2`}>
                <div className="flex flex-col gap-3">
                    {/* Stock Status Dropdown */}
                    <Select
                        placeholder="Stock Status"
                        value={activeTab}
                        onChange={handleStockChange}
                        options={stockOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                    />

                    {/* Category Dropdown */}
                    <Select
                        placeholder="Category"
                        value={currentFilters.category}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                        allowClear
                    />

                    {/* Brand Dropdown */}
                    <Select
                        placeholder="Brand"
                        value={currentFilters.brand}
                        onChange={handleBrandChange}
                        options={brandOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                        allowClear
                    />

                    {/* Search Bar */}
                    <Search
                        placeholder="Search by product name..."
                        value={localSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onSearch={handleSearchChange}
                        className="w-full"
                        allowClear
                        onClear={() => handleSearchChange('')}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleReset}
                            className="text-gray-600 flex-1"
                        >
                            Reset
                        </Button>

                        <Button
                            icon={<SettingOutlined />}
                            onClick={() => console.log("Settings clicked")}
                            className="text-gray-600 flex-1"
                        >
                            Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductNavigation;