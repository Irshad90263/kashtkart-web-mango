import api from "./axios";


// list
export const listCategoriesApi = async () => {
  const res = await api.get("/api/product-categories");
  return res.data;
};

// list varieties
export const listVarietiesApi = async () => {
  const res = await api.get("/api/varieties?status=active");
  return res.data;
};
