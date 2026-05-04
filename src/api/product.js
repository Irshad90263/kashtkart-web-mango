import api from "./axios";

// list
export const listProductsApi = async () => {
    const res = await api.get("/api/products?status=active");
    return res.data;
};

// single get
export const getProductApi = async (idOrSlug) => {
    const res = await api.get(`/api/products/${idOrSlug}`);
    return res.data;
};

// by category

export const listProductsByCategoryApi = async (categoryId) => {
    const res = await api.get(`/api/products/by-category/${categoryId}`);
    return res.data;
};

