import axios from "../axios";

// Public user-facing product APIs (no authentication required)
export const getUserProductsApi = (filter) => axios.get("/products", { params: filter });
export const getUserProductByIdApi = (id) => axios.get(`/products/${id}`);
export const getUserCategoriesApi = () => axios.get("/categories");
export const getFeaturedProductsApi = () => axios.get("/products/featured");
export const getRelatedProductsApi = (categoryId) => axios.get(`/products/related/${categoryId}`);
export const getProductsByCollectionApi = (collectionName) => axios.get(`/products/collection/${collectionName}`);
