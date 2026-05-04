import api from "./axios";

/**
 * GET ACTIVE SLIDERS
 */
export const getActiveSlidersApi = async () => {
    const res = await api.get("/api/sliders");
    return res.data;
};
