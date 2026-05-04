// src/apis/orderApi.js
import api from "./axios";

export const getUserOrdersApi = async () => {
    const res = await api.get("/api/user-orders");
    return res.data;
};

// cancel order
export const cancelOrderApi = async (orderId) => {
    const res = await api.put(`/api/user-orders/${orderId}/cancel`);
    return res.data;
};
