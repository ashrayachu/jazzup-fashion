import axiosInstance from "../axiosPrivate";

export const productCreateApi = (data) => axiosInstance.post("/admin/product-create", data);
export const categoryListApi = () => axiosInstance.get("/admin/product-categories");
export const productListApi = (filter) => axiosInstance.get("/admin/products", { params: filter });
export const addCategoryApi = (data) => axiosInstance.post("/admin/product-category-add", data);
export const getSingleProductApi = (id) => axiosInstance.get(`/admin/product/${id}`);
export const updateProductApi = (id, data) => axiosInstance.put(`/admin/product/${id}`, data);