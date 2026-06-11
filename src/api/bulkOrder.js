// import http from "./http";

import api from "./axios";

export const createBulkOrderInquiryApi = async (data) => {
  try {
    const response = await api.post("/api/bulk-order", data);
    return response.data;
  } catch (error) {
    console.error("API error creating bulk order inquiry:", error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Network or server error" };
  }
};
