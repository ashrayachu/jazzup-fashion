import axiosInstance from "./axios";

export  const login = (data) => axiosInstance.post("/auth/login", data);