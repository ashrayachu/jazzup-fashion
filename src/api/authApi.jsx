import axiosInstance from "./axios";

export  const login = (data) => axiosInstance.post("/auth/login", data);
export  const signup = (data) => axiosInstance.post("/auth/register", data);
export  const googleAuth = (idToken) => axiosInstance.post("/auth/google", { idToken });
