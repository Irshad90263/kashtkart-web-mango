import api from "./axios";


// create
export const createUserApi = async (payload) => {
    const res = await api.post(
        "/api/users/register",
        payload
    );
    return res.data;
};

// login

export const loginUserApi = async (payload) => {
    const res = await api.post(
        "/api/users/login",
        payload
    );
    return res.data;
};

// get profile

export const getProfileApi = async () => {
    const res = await api.get("/api/users/profile");
    return res.data;
};


// update user profile
export const updateProfileApi = async (payload) => {
    const res = await api.put("/api/users/profile", payload);
    return res.data;
};


