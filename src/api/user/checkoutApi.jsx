import axiosInstance from "../axiosPrivate";

export const initiateCheckout = (payload) => axiosInstance.post("/checkout/initiate", payload);
export const verifyPayment = (payload) => axiosInstance.post("/checkout/verify-payment", payload);
export const placeOrderCOD = (payload) => axiosInstance.post("/checkout/cod", payload);

export const getUserOrders = (params) => axiosInstance.get("/orders", { params });
export const getOrderById = (orderId) => axiosInstance.get(`/orders/${orderId}`);
export const cancelOrder = (orderId) => axiosInstance.post(`/orders/${orderId}/cancel`);

export const getStores = () => axiosInstance.get("/stores");

export const getAddresses = () => axiosInstance.get("/addresses");
export const addAddress = (payload) => axiosInstance.post("/addresses", payload);
export const updateAddress = (addressId, payload) => axiosInstance.put(`/addresses/${addressId}`, payload);
export const deleteAddress = (addressId) => axiosInstance.delete(`/addresses/${addressId}`);
