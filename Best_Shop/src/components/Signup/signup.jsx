import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import requestApi from "../../utils/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import "../Login/login.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [role, setRole] = useState(null);
  const [number, setNumber] = useState("");
  const [shopLocations, setShopLocations] = useState([]);
  const [masterRoles, setMasterRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [locRes, roleRes] = await Promise.all([
          requestApi("GET", "/api/master/shop-location"),
          requestApi("GET", "/api/master/role"),
        ]);
        if (locRes?.data && Array.isArray(locRes.data)) {
          setShopLocations(
            locRes.data.map((l) => ({ value: l.id, label: l.name }))
          );
        }
        if (roleRes?.data && Array.isArray(roleRes.data)) {
          setMasterRoles(
            roleRes.data.map((r) => ({ value: r.id, label: r.name }))
          );
        }
      } catch (err) {
        console.error("Error fetching signup options:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.warning("Please choose a shop location");
      return;
    }
    if (!role) {
      toast.warning("Please choose a role");
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestApi("POST", "/api/auth/signup", {
        name,
        password,
        location: location.value,
        number,
        role: role.value,
      });

      if (response?.data) {
        toast.success("Account created successfully! Please sign in.");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        toast.error("Failed to create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <ToastContainer />
      <div className="login-auth-card" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-badge">
            <StorefrontIcon style={{ fontSize: 32 }} />
          </div>
          <h2>Create Staff Account</h2>
          <p>Register a new user for Best Shop Inventory</p>
        </div>

        {/* Signup Form */}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="login-input-group">
            <label htmlFor="reg-username">Staff Username</label>
            <div className="login-input-wrap">
              <PersonOutlineIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                id="reg-username"
                type="text"
                placeholder="Choose username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <div className="login-input-wrap">
              <PhoneOutlinedIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                id="reg-phone"
                type="tel"
                placeholder="Phone number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="reg-password">Password</label>
            <div className="login-input-wrap">
              <LockOutlinedIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Set password"
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="login-input-group">
              <label>Shop Location</label>
              <Select
                options={shopLocations}
                value={location}
                onChange={(val) => setLocation(val)}
                placeholder="Location..."
                styles={{
                  control: (p) => ({
                    ...p,
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: 10,
                  }),
                  singleValue: (p) => ({ ...p, color: "var(--text)" }),
                  menu: (p) => ({ ...p, backgroundColor: "var(--surface)", border: "1px solid var(--border)", zIndex: 30 }),
                  option: (p, s) => ({
                    ...p,
                    backgroundColor: s.isFocused ? "var(--surface-hover, rgba(14,165,233,0.1))" : "var(--surface)",
                    color: "var(--text)",
                  }),
                }}
              />
            </div>

            <div className="login-input-group">
              <label>Role</label>
              <Select
                options={masterRoles}
                value={role}
                onChange={(val) => setRole(val)}
                placeholder="Role..."
                styles={{
                  control: (p) => ({
                    ...p,
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: 10,
                  }),
                  singleValue: (p) => ({ ...p, color: "var(--text)" }),
                  menu: (p) => ({ ...p, backgroundColor: "var(--surface)", border: "1px solid var(--border)", zIndex: 30 }),
                  option: (p, s) => ({
                    ...p,
                    backgroundColor: s.isFocused ? "var(--surface-hover, rgba(14,165,233,0.1))" : "var(--surface)",
                    color: "var(--text)",
                  }),
                }}
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            <HowToRegOutlinedIcon fontSize="small" />
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="login-footer-links">
          <span>Already have an account?</span>
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;