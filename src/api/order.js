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

// track order
export const trackShiprocketOrderApi = async (awbCode) => {
    const res = await api.get(`/api/shiprocket/track/${awbCode}`);
    return res.data;
};
