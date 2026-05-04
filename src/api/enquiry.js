// src/apis/enquiryApi.js
import api from "./axios";

export const createEnquiryApi = async (payload) => {
    const res = await api.post("/api/enquiry", payload);
    return res.data;
};
