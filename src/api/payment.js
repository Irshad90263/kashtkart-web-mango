import api from "./axios";

// Create Razorpay Order
export const createPaymentOrderApi = async (data) => {
    // data: { amount, currency, receipt }
    const res = await api.post("/api/payment/create-order", data);
    return res.data;
};

// Verify Payment and Create Order
export const verifyPaymentApi = async (data) => {
    // data: { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress, notes, offerCode }
    const res = await api.post("/api/payment/verify", data);
    return res.data;
};

// Handle Payment Failure
export const handlePaymentFailureApi = async (data) => {
    // data: { razorpay_order_id, error }
    const res = await api.post("/api/payment/failure", data);
    return res.data;
};
// Place Direct Order (COD or other)
export const placeOrderApi = async (data) => {
    // data: { addressId, paymentMethod, offerCode, notes }
    const res = await api.post("/api/orders", data);
    return res.data;
};
