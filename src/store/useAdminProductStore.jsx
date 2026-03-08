import { create } from "zustand";
import { productListApi } from '../api/admin/productApi';

const useAdminProductStore = create((set, get) => ({
  // Core Data - Only current page from API
  products: [],
  loading: false,
  error: null,
  // Categories
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

  // Filter state for UI
  filters: {
    stockStatus: 'all', // 'all' | 'inStock' | 'lowStock' | 'outOfStock'
    category: null,
    brand: null,
    search: '',
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
      if (state.filters.brand) {
        params.brand = state.filters.brand;
      }
      if (state.filters.search) {
        params.search = state.filters.search;
      }

      // Note: stockStatus is handled client-side for now
      // If backend supports it, add: params.stockStatus = state.filters.stockStatus

      const response = await productListApi(params);

      if (response?.data?.success) {
        const productsData = response.data.data.products;

        // Process products: add keys and calculate stock
        const processedProducts = productsData.map(product => ({
          ...product,
          key: product._id,
          totalStock: get().calculateTotalStock(product.variants),
        }));

        // Filter by stock status client-side (if needed)
        let filteredProducts = processedProducts;
        if (state.filters.stockStatus !== 'all') {
          filteredProducts = processedProducts.filter(product => {
            const stock = product.totalStock;
            switch (state.filters.stockStatus) {
              case 'inStock':
                return stock > 10;
              case 'lowStock':
                return stock > 0 && stock <= 10;
              case 'outOfStock':
                return stock === 0;
              default:
                return true;
            }
          });
        }

        set({
          products: filteredProducts,
          loading: false,
          pagination: response.data.data.pagination || state.pagination,
        });

        return filteredProducts;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      set({
        error: error.message,
        loading: false
      });
      return [];
    }
  },

  // Calculate total stock from variants
  calculateTotalStock: (variants) => {
    if (!variants || !Array.isArray(variants)) return 0;

    return variants.reduce((total, variant) => {
      const variantStock = variant.sizes?.reduce((sum, size) => {
        return sum + (size.quantity || 0);
      }, 0) || 0;
      return total + variantStock;
    }, 0);
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
        stockStatus: 'all',
        category: null,
        brand: null,
        search: '',
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

  // Get product by ID
  getProductById: (productId) => {
    return get().products.find(p => p._id === productId);
  },

  // Set categories
  setCategories: (categories) => {
    set({ categories });
  },
}));

export default useAdminProductStore;