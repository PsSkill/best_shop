import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import apiHost from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import "./login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiHost}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const { token, username } = await response.json();
        Cookies.set("token", token);
        Cookies.set("username", username);
        toast.success("Welcome back! Login successful.");
        setTimeout(() => {
          navigate("/addStock");
        }, 300);
      } else {
        setError("Invalid username or password. Please verify.");
        toast.error("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please check backend.");
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <ToastContainer />
      <div className="login-auth-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-badge">
            <StorefrontIcon style={{ fontSize: 32 }} />
          </div>
          <h2>Best Shop Stock System</h2>
          <p>Sign in to access your inventory and stock records</p>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="username">Username</label>
            <div className="login-input-wrap">
              <PersonOutlineIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <LockOutlinedIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}
              >
                {showPassword ? (
                  <VisibilityOffIcon style={{ fontSize: 18 }} />
                ) : (
                  <VisibilityIcon style={{ fontSize: 18 }} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            <LoginIcon fontSize="small" />
            {isLoading ? "Signing in..." : "Sign In to Best Shop"}
          </button>
        </form>

        <div className="login-footer-links">
          <span>Need a new account?</span>
          <Link to="/signup">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
