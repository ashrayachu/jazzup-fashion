import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { googleAuth, login } from "../api/authApi";
import useAuthStore from "../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";


const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { loginCall } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await login(formData);
            if (response?.data?.token) {
                loginCall(response.data);
                toast.success(response?.data?.message || "Login successful");
                if (response?.data?.user?.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(response?.data?.message || "Login failed");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Login error";
            toast.error(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async (credentialResponse) => {
        const idToken = credentialResponse?.credential;

        if (!idToken) {
            toast.error("Google sign in did not return a token");
            return;
        }

        setLoading(true);
        try {
            const response = await googleAuth(idToken);
            if (response?.data?.token) {
                loginCall(response.data);
                toast.success(response?.data?.message || "Google login successful");

                if (response?.data?.user?.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(response?.data?.message || "Google login failed");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Google authentication failed";
            toast.error(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ minHeight: "100vh", background: "#010001" }}
            className="flex items-center justify-center px-4 py-12"
        >
            <div
                className="w-full"
                style={{
                    maxWidth: "448px",
                    animation: "fadeUp 0.5s ease both",
                }}
            >
                <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .jz-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.75rem;
            background: #010001;
            border: 1px solid #3a2a20;
            border-radius: 0.5rem;
            color: #fff;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }
          .jz-input::placeholder { color: #6b7280; }
          .jz-input:focus { border-color: #8B6F47; }
          .jz-btn-primary {
            width: 100%;
            padding: 0.75rem;
            background: #8B6F47;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, transform 0.15s;
            letter-spacing: 0.02em;
          }
          .jz-btn-primary:hover:not(:disabled) { background: #a88a5f; transform: scale(1.02); }
          .jz-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
          .jz-btn-google {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            background: #fff;
            color: #1E140F;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
          }
          .jz-btn-google:hover { background: #f3f4f6; }
          .jz-link {
            color: #8B6F47;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
          }
          .jz-link:hover { color: #a88a5f; }
          .jz-icon-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #9ca3af;
            padding: 0;
            display: flex;
            align-items: center;
            transition: color 0.2s;
          }
          .jz-icon-btn:hover { color: #d1d5db; }
          .jz-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 0.5rem;
          }
          .jz-spinner {
            width: 18px; height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

                {/* Card */}
                <div
                    style={{
                        background: "#1E140F",
                        borderRadius: "1rem",
                        border: "1px solid #3a2a20",
                        padding: "2rem",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
                    }}
                >
                    {/* Header */}
                    <div className="text-center" style={{ marginBottom: "2rem" }}>
                        <h1
                            style={{
                                fontSize: "1.875rem",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "0.5rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                            Sign in to JazzUp Fashion
                        </p>
                    </div>

                    {/* Google Button */}
                    <GoogleLogin
                        onSuccess={handleGoogleAuth}
                        onError={() => toast.error("Google Sign In failed")}
                        width="100%"
                        theme="filled_black"
                        shape="rectangular"
                    />

                    {/* Divider */}
                    <div style={{ position: "relative", margin: "1.5rem 0" }}>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                            <div style={{ width: "100%", borderTop: "1px solid #3a2a20" }} />
                        </div>
                        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                            <span style={{ padding: "0 1rem", background: "#1E140F", color: "#9ca3af", fontSize: "0.875rem" }}>
                                Or sign in with email
                            </span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        {/* Email */}
                        <div>
                            <label className="jz-label">Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className="jz-input"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <label className="jz-label" style={{ margin: 0 }}>Password</label>
                                <Link to="/forgot-password" className="jz-link" style={{ fontSize: "0.8rem" }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className="jz-input"
                                    style={{ paddingRight: "3rem" }}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                <button className="jz-icon-btn" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button className="jz-btn-primary" onClick={handleLogin} disabled={loading}>
                            {loading && <span className="jz-spinner" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>

                    {/* Footer link */}
                    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9ca3af", fontSize: "0.875rem" }}>
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="jz-link">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
