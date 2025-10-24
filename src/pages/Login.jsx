import { useState } from "react";
import { login } from "../api/authApi";
import useAuthStore from "../store/useAuthStore";


import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { loginCall } = useAuthStore();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(formData);
            // adjust based on your API shape
            if (response?.data?.token) {
                loginCall(response.data); // ✅ use response.data (not the whole response)

                // wait a tick for Zustand persist to sync to sessionStorage
                // setTimeout(() => {
                //     console.log("Session storage after login:", sessionStorage.getItem("auth-storage"));
                // }, 200);
                if (response?.data?.user.role === 'admin') {
                    navigate("/admin/dashboard");
                }
                else {
                    navigate("/");

                }
                toast.success(response?.data?.message || "Login successful");

                // ...existing code...
            } else {
                toast.error(response?.data?.message || "Login failed");
            }
       
        } catch (err) {
            // axios interceptor already shows a toast, but show fallback here if needed
            const msg = err?.response?.data?.message || err?.message || "Login error";
            toast.error(msg);
            console.error(err);
        }
    }

    return (
        <div className="flex max-w-md flex-col items-center justify-center space-y-4 mx-auto p-4">
            <input type="text" value={formData.email} name="email" onChange={handleChange} placeholder="Email" />
            <input type="password" value={formData.password} name="password" onChange={handleChange} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
