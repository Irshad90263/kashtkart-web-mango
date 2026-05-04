// src/apis/videoApi.js
import api from "./axios";


export const getAllVideosApi = async () => {
  const res = await api.get("/api/videos");
  return res.data;
};

export const getSingleVideoApi = async (id) => {
  const res = await api.get(`/api/videos/${id}`);
  return res.data;
};

