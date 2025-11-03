import React, { useState } from "react";
import { Select, Input, Button } from "antd";
import { DownOutlined, SettingOutlined, FilterOutlined } from "@ant-design/icons";
const { Search } = Input;

// Product Tab Navigation Component with Filters
const ProductNavigation = ({ activeTab, onChange, categories, brands }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const tabs = [
        { key: "all", label: "All Products" },
        { key: "inStock", label: "In Stock" },
        { key: "lowStock", label: "Low Stock" },
        { key: "outOfStock", label: "Out of Stock" }
    ];

    // Convert categories to options format
    const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...(categories || []).map(cat => ({
            value: cat._id || cat,
            label: cat.name || cat
        }))
    ];

    // Convert brands to options format
    const brandOptions = [
        { value: "all", label: "All Brands" },
        ...(brands || []).map(brand => ({
            value: brand,
            label: brand
        }))
    ];

    const stockOptions = [
        { value: "all", label: "All Stock Levels" },
        { value: "inStock", label: "In Stock" },
        { value: "lowStock", label: "Low Stock (< 10)" },
        { value: "outOfStock", label: "Out of Stock" }
    ];

    const handleReset = () => {
        setSearchValue("");
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSelectedStock(null);
    };

    return (
        <div className="mb-6 border-b border-gray-200">
            {/* Main row with tabs and filters */}
            <div className="flex items-center justify-between px-2 sm:px-0">
                {/* Tabs */}
                <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <div
                            key={tab.key}
                            onClick={() => onChange(tab.key)}
                            className={`py-3 px-1 cursor-pointer border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === tab.key
                                    ? "border-blue-500 text-blue-500 font-semibold"
                                    : "border-transparent text-gray-600 hover:text-blue-400"
                                }`}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>

                {/* Filters - Desktop inline, Mobile toggle button */}
                <div className="flex items-center gap-3 pb-3">
                    {/* Desktop filters - hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-3">
                        {/* Category Dropdown */}
                        <Select
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={categoryOptions}
                            suffixIcon={<DownOutlined className="text-gray-400" />}
                            className="w-40"
                            allowClear
                        />

                        {/* Brand Dropdown */}
                        <Select
                            placeholder="Brand"
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                            options={brandOptions}
                            suffixIcon={<DownOutlined className="text-gray-400" />}
                            className="w-40"
                            allowClear
                        />

                        {/* Stock Status Dropdown */}
                        <Select
                            placeholder="Stock Status"
                            value={selectedStock}
                            onChange={setSelectedStock}
                            options={stockOptions}
                            suffixIcon={<DownOutlined className="text-gray-400" />}
                            className="w-40"
                            allowClear
                        />

                        {/* Search Bar */}
                        <Search
                            placeholder="Search by product name or brand..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={(value) => console.log("Search:", value)}
                            className="w-80"
                            allowClear
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
            </div>

            {/* Mobile filters dropdown */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:hidden px-2 pb-3 pt-2`}>
                <div className="flex flex-col gap-3">
                    {/* Category Dropdown */}
                    <Select
                        placeholder="Category"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={categoryOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                        allowClear
                    />

                    {/* Brand Dropdown */}
                    <Select
                        placeholder="Brand"
                        value={selectedBrand}
                        onChange={setSelectedBrand}
                        options={brandOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                        allowClear
                    />

                    {/* Stock Status Dropdown */}
                    <Select
                        placeholder="Stock Status"
                        value={selectedStock}
                        onChange={setSelectedStock}
                        options={stockOptions}
                        suffixIcon={<DownOutlined className="text-gray-400" />}
                        className="w-full"
                        allowClear
                    />

                    {/* Search Bar */}
                    <Search
                        placeholder="Search by product name or brand..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onSearch={(value) => console.log("Search:", value)}
                        className="w-full"
                        allowClear
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