import api from "./axios";

export const createCorporateInquiryApi = async (payload) => {
    const res = await api.post("/api/corporate-inquiry", payload);
    return res.data;
};
