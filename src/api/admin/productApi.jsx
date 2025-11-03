import axiosPrivate from "../axiosPrivate";

export  const productCreateApi = (data) => axiosPrivate.post("/admin/product-create", data);
export const categoryListApi = () => axiosPrivate.get("/admin/product-categories");
export const productListApi = () => axiosPrivate.get("/admin/products");