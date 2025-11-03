import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_REACT_APP_API_AXIOS,
});



// add a response interceptor to show error toasts
axiosInstance.interceptors.response.use(
    (response) => {
        // Optionally show success toasts from API messages:
        if (response?.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    (error) => {
        // Safely extract message
        const msg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong";
        // Show toast error
        toast.error(msg, {
            position: "top-right",
            autoClose: 5000,
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;