import axiosPrivate from "../axiosPrivate";

export const productCreateApi = (data) => axiosPrivate.post("/admin/product-create", data);
export const categoryListApi = () => axiosPrivate.get("/admin/product-categories");
export const productListApi = (filter) => axiosPrivate.get("/admin/products", { params: filter });
export const addCategoryApi = (data) => axiosPrivate.post("/admin/product-category-add", data);
export const getSingleProductApi = (id) => axiosPrivate.get(`/admin/product/${id}`);
export const updateProductApi = (id, data) => axiosPrivate.put(`/admin/product/${id}`, data);