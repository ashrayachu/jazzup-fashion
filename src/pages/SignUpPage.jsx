import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../api/authApi";
import { validateSignupForm } from "../utils/authValidation";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: nextValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const validationErrors = validateSignupForm(formData);
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] || "" }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignupForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the highlighted fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };

            const response = await signup(payload);
            toast.success(response?.data?.message || "Account created!");
            navigate("/login");
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Signup error";
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
                style={{ maxWidth: "448px", animation: "fadeUp 0.5s ease both" }}
            >
                <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
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
          .jz-input-error { border-color: #dc2626; }
          .jz-error-text {
            color: #fca5a5;
            font-size: 0.8rem;
            margin-top: 0.4rem;
          }
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
          .jz-checkbox {
            width: 1rem;
            height: 1rem;
            margin-top: 2px;
            accent-color: #8B6F47;
            cursor: pointer;
            flex-shrink: 0;
          }
        `}</style>

                <div
                    style={{
                        background: "#1E140F",
                        borderRadius: "1rem",
                        border: "1px solid #3a2a20",
                        padding: "2rem",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
                    }}
                >
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
                            Create Account
                        </h1>
                        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                            Join JazzUp Fashion today
                        </p>
                    </div>

                    <form onSubmit={handleSignup} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label className="jz-label">Full Name</label>
                            <div style={{ position: "relative" }}>
                                <User
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className={`jz-input ${errors.name ? "jz-input-error" : ""}`}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="John Doe"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={errors.name ? "signup-name-error" : undefined}
                                />
                            </div>
                            {errors.name && <p id="signup-name-error" className="jz-error-text">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="jz-label">Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className={`jz-input ${errors.email ? "jz-input-error" : ""}`}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? "signup-email-error" : undefined}
                                />
                            </div>
                            {errors.email && <p id="signup-email-error" className="jz-error-text">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="jz-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className={`jz-input ${errors.password ? "jz-input-error" : ""}`}
                                    style={{ paddingRight: "3rem" }}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="........"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? "signup-password-error" : undefined}
                                />
                                <button className="jz-icon-btn" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p id="signup-password-error" className="jz-error-text">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="jz-label">Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                                />
                                <input
                                    className={`jz-input ${errors.confirmPassword ? "jz-input-error" : ""}`}
                                    style={{ paddingRight: "3rem" }}
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="........"
                                    aria-invalid={Boolean(errors.confirmPassword)}
                                    aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
                                />
                                <button className="jz-icon-btn" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p id="signup-confirm-password-error" className="jz-error-text">{errors.confirmPassword}</p>}
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                            <input
                                className="jz-checkbox"
                                type="checkbox"
                                id="terms"
                                name="acceptedTerms"
                                checked={formData.acceptedTerms}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(errors.acceptedTerms)}
                                aria-describedby={errors.acceptedTerms ? "signup-terms-error" : undefined}
                            />
                            <label htmlFor="terms" style={{ fontSize: "0.875rem", color: "#9ca3af", lineHeight: "1.4", cursor: "pointer" }}>
                                I agree to the{" "}
                                <Link to="/terms" className="jz-link">Terms of Service</Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="jz-link">Privacy Policy</Link>
                            </label>
                        </div>
                        {errors.acceptedTerms && <p id="signup-terms-error" className="jz-error-text" style={{ marginTop: "-0.75rem" }}>{errors.acceptedTerms}</p>}

                        <button className="jz-btn-primary" type="submit" disabled={loading}>
                            {loading && <span className="jz-spinner" />}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9ca3af", fontSize: "0.875rem" }}>
                        Already have an account?{" "}
                        <Link to="/login" className="jz-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
