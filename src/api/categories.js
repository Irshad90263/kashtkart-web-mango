import api from "./axios";


// list
export const listCategoriesApi = async () => {
  const res = await api.get("/api/categories?status=active");
  return res.data;
};
