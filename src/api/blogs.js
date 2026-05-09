import api from "./axios";

// Public: Get published blogs - GET /api/blogs
export const getPublishedBlogs = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get(`/api/blogs?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

// Public: Get single blog - GET /api/blogs/:idOrSlug
export const getSingleBlog = async (idOrSlug) => {
  const { data } = await api.get(`/api/blogs/${idOrSlug}`);
  return data;
};
// Public: Add comment to blog - POST /api/blogs/comment/:id
export const addBlogComment = async (blogId, commentData) => {
  const { data } = await api.post(`/api/blogs/comment/${blogId}`, commentData);
  return data;
};
