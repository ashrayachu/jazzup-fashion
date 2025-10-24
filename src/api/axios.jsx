import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_REACT_APP_API_AXIOS,
});

// axiosPrivate.jsx

import Swal from "sweetalert2";
// import useAuthStore from "../store/useAuthStore";

// export const axiosPrivate = axiosInstance;

// axiosPrivate.interceptors.request.use(
//   (config) => {

//     const accessToken = useAuthStore.getState().accessToken;
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// axiosPrivate.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {

//     if (!error.response || error.response.status !== 401) {
//       return Promise.reject(error);
//     }

//     const prevRequest = error?.config;
//     if (error.response.status === 401 && !prevRequest?.sent) {
//       try {
//         prevRequest.sent = true;


//         const response = await axiosInstance.post(
//           "/auth/refresh-token",
//           {},
//           { withCredentials: true }
//         );

//         if (response.data.success) {

//           useAuthStore.getState().loginCall({
//             user: useAuthStore.getState().user,
//             accessToken: response.data.accessToken,
//             userType: useAuthStore.getState().userType,
//           });


//           prevRequest.headers[
//             "Authorization"
//           ] = `Bearer ${response.data.accessToken}`;
//           return axiosInstance(prevRequest);
//         }
//       } catch (refreshError) {
//         Swal.fire({
//           title: "Session Expired",
//           text: "Your session has expired. Please login again.",
//           icon: "warning",
//         }).then(() => {
//           useAuthStore.getState().logoutCall();
//           window.location.href = "/";
//         });
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosPrivate;

// add a response interceptor to show error toasts
axiosInstance.interceptors.response.use(
    (response) => {
        // Optionally show success toasts from API messages:
        // if (response?.data?.message) {
        //   toast.success(response.data.message);
        // }
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