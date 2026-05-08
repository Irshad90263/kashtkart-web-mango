import api from "./axios";

// Public: Get published blogs - GET /api/blogs
export const getPublishedBlogs = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/api/blogs?page=${page}&limit=${limit}`);
  return data;
};

// Public: Get single blog - GET /api/blogs/:idOrSlug
export const getSingleBlog = async (idOrSlug) => {
  const { data } = await api.get(`/api/blogs/${idOrSlug}`);
  return data;
};
