import api from "./axios";

export const registerUser = async (data: any) => {

    const response = await api.post(
        "/register",
        data
    );

    return response.data;
};

export const loginUser = async (data: any) => {

    const response = await api.post(
        "/login",
        data
    );

    return response.data;
};

export const getProfile = async () => {

    const response = await api.get(
        "/profile"
    );

    return response.data;
};

export const updateProfile = async (data: any) => {

    const response = await api.put(
        "/profile",
        data
    );

    return response.data;
};
