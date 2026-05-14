import api from "./axios";

export const checkDeliveryApi = async (pincode, weight = 1) => {
    const res = await api.post("/api/shipping/check-availability", {
        pincode,
        weight
    });
    return res.data;
};
