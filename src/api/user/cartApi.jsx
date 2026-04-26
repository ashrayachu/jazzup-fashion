import axiosInstance from "../axiosPrivate";

export const addToCart = (productId, cartData) => 
    axiosInstance.post(`/add-to-cart/${productId}`, cartData);
export const getCart = () => axiosInstance.get("/get-cart");
export const updateCartItem = (cartId, quantity) => axiosInstance.put(`/update-cart/${cartId}`, { quantity });
export const removeFromCart = (cartId) => axiosInstance.delete(`/remove-from-cart/${cartId}`);
export const clearCart = () => axiosInstance.delete("/clear-cart");