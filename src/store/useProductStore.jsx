// useAuthStore.js
import { create } from "zustand";

const useProductStore = create((set, get) => ({
    products: [],
    categories: [],
    filteredProducts: [],
    filters: {
        category: null,priceRange: [0, 1000], size: null, color: null, brand: null, 
    },

setCategories: (categories) => set({ categories }),
}

))

export default useProductStore;