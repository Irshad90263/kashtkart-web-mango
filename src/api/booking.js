import api from "./axios";

export const createBookingApi = async (payload) => {
    const res = await api.post("/api/bookings", payload);
    return res.data;
};

export const createBookingPaymentOrderApi = async (payload) => {
    const res = await api.post("/api/bookings/create-payment-order", payload);
    return res.data;
};

export const verifyBookingPaymentApi = async (payload) => {
    const res = await api.post("/api/bookings/verify-payment", payload);
    return res.data;
};
