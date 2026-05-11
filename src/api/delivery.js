import api from "./axios";

export const checkDeliveryApi = async (pincode) => {
    const res = await api.get(`/api/delivery/check-delivery/${pincode}`);
    return res.data;
};
