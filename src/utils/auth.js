// Token management utilities
export const saveToken = (token) => {
    const tokenData = {
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    localStorage.setItem("userToken", JSON.stringify(tokenData));
};

export const getToken = () => {
    try {
        const tokenData = localStorage.getItem("userToken");
        if (!tokenData) return null;
        
        const parsed = JSON.parse(tokenData);
        
        // Check if token has expired
        if (Date.now() > parsed.expiresAt) {
            localStorage.removeItem("userToken");
            return null;
        }
        
        return parsed.token;
    } catch (error) {
        localStorage.removeItem("userToken");
        return null;
    }
};

export const saveUserData = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
};

export const getUserData = () => {
    try {
        const data = localStorage.getItem("userData");
        return data ? JSON.parse(data) : null;
    } catch (error) {
        return null;
    }
};

export const removeToken = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
};

export const isTokenValid = () => {
    return getToken() !== null;
};