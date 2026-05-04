import api from "./axios";

export const getPaymentMethodsApi = async () => {
    const res = await api.get("/api/method/get?status=true");
    return res.data; // Backend directly returns array
};
