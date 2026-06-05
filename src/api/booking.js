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

export const getUserBookingsApi = async () => {
    const res = await api.get("/api/bookings/my-bookings");
    return res.data;
};

export const createRemainingPaymentOrderApi = async (payload) => {
    const res = await api.post("/api/bookings/create-remaining-payment-order", payload);
    return res.data;
};

export const verifyRemainingPaymentApi = async (payload) => {
    const res = await api.post("/api/bookings/verify-remaining-payment", payload);
    return res.data;
};
