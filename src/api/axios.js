// src/apis/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Required for cookies (like adminToken) to be sent/received
});

// Attach token for every request (Optional if using Cookies, but kept for compatibility)
api.interceptors.request.use((config) => {
    try {
        const tokenData = localStorage.getItem("userToken");
        if (tokenData) {
            const parsed = JSON.parse(tokenData);
            // Check if token has expired
            if (Date.now() > parsed.expiresAt) {
                localStorage.removeItem("userToken");
                return config;
            }
            config.headers.Authorization = `Bearer ${parsed.token}`;
        }
    } catch (error) {
        localStorage.removeItem("userToken");
    }
    return config;
});

export default api;
