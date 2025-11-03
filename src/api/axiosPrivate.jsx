import axios from "axios";
import { toast } from "react-toastify";

const axiosPrivate = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_REACT_APP_API_AXIOS,
    // headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth header   
// ...existing code...
axiosPrivate.interceptors.request.use(
    (config) => {
        // Get the auth-storage object
        const authStorage = sessionStorage.getItem('auth-storage');
        let token = null;
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                token = parsed.state?.accessToken;
            } catch (e) {
                // ignore JSON parse error
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// ...existing code...
// Response interceptor for handling errors
axiosPrivate.interceptors.response.use(
    (response) => {
        if (response?.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    (error) => {
        const msg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong";

        // Handle unauthorized errors
        if (error?.response?.status === 401) {
            // Remove token and redirect to login
            sessionStorage.removeItem('auth-storage');
            window.location.href = '/login'; // or your login route
        }

        toast.error(msg, {
            position: "top-right",
            autoClose: 5000,
        });
        return Promise.reject(error);
    }
);

export default axiosPrivate;
