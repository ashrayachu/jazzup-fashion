import { create } from "zustand";
import { getUserProductsApi, getUserProductByIdApi } from '../api/user/productApi';

const useUserProductStore = create((set, get) => ({
    // Core Data - User-facing products
    products: [],
    loading: false,
    error: null,

    // Single product detail
    currentProduct: null,

    // Categories for filtering
    categories: [],

    // Pagination metadata from backend
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
    },

    // Filter state for UI (user shop filters)
    filters: {
        category: null,
        subCategory: null,
        brand: null,
        priceRange: { min: 0, max: 10000 },
        search: '',
        sortBy: 'newest', // 'newest' | 'priceLow' | 'priceHigh' | 'popular'
    },

    // ==================== ACTIONS ====================

    // Fetch products from API with current filters and pagination
    fetchProducts: async () => {
        const state = get();
        set({ loading: true, error: null });

        try {
            // Build API params from current state
            const params = {
                page: state.pagination.currentPage,
                limit: state.pagination.limit,
            };

            // Add filters if they exist
            if (state.filters.category) {
                params.category = state.filters.category;
            }
            if (state.filters.subCategory) {
                params.subCategory = state.filters.subCategory;
            }
            if (state.filters.brand) {
                params.brand = state.filters.brand;
            }
            if (state.filters.search) {
                params.search = state.filters.search;
            }
            if (state.filters.sortBy) {
                params.sortBy = state.filters.sortBy;
            }
            if (state.filters.priceRange) {
                params.minPrice = state.filters.priceRange.min;
                params.maxPrice = state.filters.priceRange.max;
            }

            const response = await getUserProductsApi(params);

            if (response?.data?.success) {
                const productsData = response.data.data.products;

                // Process products: add keys for React rendering
                const processedProducts = productsData.map(product => ({
                    ...product,
                    key: product._id,
                }));

                set({
                    products: processedProducts,
                    loading: false,
                    pagination: response.data.data.pagination || state.pagination,
                });

                return processedProducts;
            }
        } catch (error) {
            console.error('Error fetching user products:', error);
            set({
                error: error.message,
                loading: false
            });
            return [];
        }
    },

    // Fetch single product by ID
    fetchProductById: async (productId) => {
        set({ loading: true, error: null });

        try {
            const response = await getUserProductByIdApi(productId);

            if (response?.data?.success) {
                const productData = response.data.product || response.data.data?.product || response.data.data;

                set({
                    currentProduct: productData || null,
                    loading: false,
                    error: productData ? null : 'Product not found',
                });

                return productData || null;
            }

            set({
                currentProduct: null,
                loading: false,
                error: response?.data?.message || 'Product not found',
            });

            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            set({
                error: error.message,
                loading: false,
                currentProduct: null,
            });
            return null;
        }
    },

    // ==================== FILTER ACTIONS ====================

    // Set filters and refetch
    setFilters: async (newFilters) => {
        set({
            filters: { ...get().filters, ...newFilters },
            pagination: { ...get().pagination, currentPage: 1 } // Reset to page 1
        });
        await get().fetchProducts();
    },

    // Clear all filters and refetch
    clearFilters: async () => {
        set({
            filters: {
                category: null,
                subCategory: null,
                brand: null,
                priceRange: { min: 0, max: 10000 },
                search: '',
                sortBy: 'newest',
            },
            pagination: { ...get().pagination, currentPage: 1 }
        });
        await get().fetchProducts();
    },

    // ==================== PAGINATION ACTIONS ====================

    // Set page and refetch
    setPage: async (page) => {
        set({
            pagination: { ...get().pagination, currentPage: page }
        });
        await get().fetchProducts();
    },

    // Set page size and refetch
    setPageSize: async (size) => {
        set({
            pagination: { ...get().pagination, limit: size, currentPage: 1 }
        });
        await get().fetchProducts();
    },

    // ==================== UTILITY ACTIONS ====================

    // Get product by ID from current products list
    getProductById: (productId) => {
        return get().products.find(p => p._id === productId);
    },

    // Set categories
    setCategories: (categories) => {
        set({ categories });
    },

    // Clear current product (when navigating away from detail page)
    clearCurrentProduct: () => {
        set({ currentProduct: null });
    },
}));

export default useUserProductStore;
