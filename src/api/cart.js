// src/apis/cartApi.js
import api from "./axios";

export const addToCartApi = async (payload) => {
    const res = await api.post("/api/cart/add", payload);
    return res.data;
};

// get 
export const getCartApi = async () => {
    const res = await api.get("/api/cart/total");
    return res.data;
};

// updaet qty
export const updateCartItemApi = async (itemId, quantity) => {
    const res = await api.put(`/api/cart/item/${itemId}`, { quantity });
    return res.data;
};

// remove from cart
export const removeFromCartApi = async (itemId) => {
    const res = await api.delete(`/api/cart/item/${itemId}`);
    return res.data;
};

// clear cart
export const clearCartApi = async () => {
    const res = await api.delete("/api/cart/clear");
    return res.data;
};