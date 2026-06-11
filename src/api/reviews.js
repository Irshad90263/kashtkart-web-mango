import axiosInstance from "./axios";

// Check if user is eligible to review
export const checkReviewEligibility = async (productId) => {
  const response = await axiosInstance.get(`/api/reviews/eligibility/${productId}`);
  return response.data;
};

// Add a new review
export const addReview = async (productId, reviewData) => {
  const response = await axiosInstance.post(`/api/reviews/product/${productId}`, reviewData);
  return response.data;
};

// Get reviews for a product
export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/api/reviews/product/${productId}`);
  return response.data;
};
