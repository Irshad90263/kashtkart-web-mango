
// src/apis/userApi.js
import api from "./axios";

// add
export const addAddressApi = async (payload) => {
    const res = await api.post("/api/users/addresses", payload);
    return res.data;
};

// get

export const getAddressesApi = async () => {
    const res = await api.get("/api/users/addresses");
    return res.data;
};

// update
export const updateAddressApi = async (addressId, payload) => {
    const res = await api.put(`/api/users/addresses/${addressId}`, payload);
    return res.data;
};



