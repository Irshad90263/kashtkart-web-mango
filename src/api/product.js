import api from "./axios";

// list
export const listProductsApi = async (sort = '', minPrice = '', maxPrice = '') => {
  const params = { status: 'active' };
  
  if (sort) params.sort = sort;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  
  const res = await api.get("/api/products", { params });
  return res.data;
};

// single get
export const getProductApi = async (idOrSlug) => {
    const res = await api.get(`/api/products/${idOrSlug}`);
    return res.data;
};

// by category

export const listProductsByCategoryApi = async (categoryId, sort = '') => {
    const params = sort ? { sort } : {};
    const res = await api.get(`/api/products/by-category/${categoryId}`, { params });
    return res.data;
};
