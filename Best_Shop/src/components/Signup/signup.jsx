import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import requestApi from "../../utils/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
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
  
  // Modals for adding shop and role
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!Cookies.get("token");
  const rawRole = Cookies.get("role") || "";
  const rawUsername = Cookies.get("username") || "";
  const isAdmin = Cookies.get("is_admin") === "true" || rawRole.toLowerCase() === "admin" || rawRole === "4" || rawUsername.toLowerCase() === "admin";

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

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleAddShop = async (e) => {
    e.preventDefault();
    if (!newShopName.trim()) {
      toast.warning("Please enter shop name");
      return;
    }
    setIsSubmittingShop(true);
    try {
      const res = await requestApi("POST", "/api/master/shop-location", {
        name: newShopName.trim(),
      });
      if (res?.data || res?.message || res?.success !== false) {
        toast.success(`Shop "${newShopName.trim().toUpperCase()}" added successfully!`);
        const locRes = await requestApi("GET", "/api/master/shop-location");
        if (locRes?.data && Array.isArray(locRes.data)) {
          const updated = locRes.data.map((l) => ({ value: l.id, label: l.name }));
          setShopLocations(updated);
          const created = updated.find(
            (l) => l.label?.toUpperCase() === newShopName.trim().toUpperCase()
          );
          if (created) setLocation(created);
        }
        setNewShopName("");
        setShopModalOpen(false);
      } else {
        toast.error("Failed to add shop location");
      }
    } catch (err) {
      console.error("Error adding shop:", err);
      toast.error("Error adding shop location");
    } finally {
      setIsSubmittingShop(false);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.warning("Please enter role name");
      return;
    }
    setIsSubmittingRole(true);
    try {
      const res = await requestApi("POST", "/api/master/role", {
        name: newRoleName.trim(),
      });
      if (res?.data || res?.message || res?.success !== false) {
        toast.success(`Role "${newRoleName.trim().toUpperCase()}" added successfully!`);
        const roleRes = await requestApi("GET", "/api/master/role");
        if (roleRes?.data && Array.isArray(roleRes.data)) {
          const updated = roleRes.data.map((r) => ({ value: r.id, label: r.name }));
          setMasterRoles(updated);
          const created = updated.find(
            (r) => r.label?.toUpperCase() === newRoleName.trim().toUpperCase()
          );
          if (created) setRole(created);
        }
        setNewRoleName("");
        setRoleModalOpen(false);
      } else {
        toast.error("Failed to add role");
      }
    } catch (err) {
      console.error("Error adding role:", err);
      toast.error("Error adding role");
    } finally {
      setIsSubmittingRole(false);
    }
  };

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
        toast.success("Account created successfully!");
        setTimeout(() => {
          if (isLoggedIn) {
            navigate("/addStock");
          } else {
            navigate("/login");
          }
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

  if (isLoggedIn && !isAdmin) {
    return (
      <div className="login-page-container">
        <div className="login-auth-card" style={{ maxWidth: 440, textAlign: "center" }}>
          <div className="login-brand-header">
            <div className="login-brand-badge" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
              <LockOutlinedIcon style={{ fontSize: 32 }} />
            </div>
            <h2 style={{ color: "var(--text)" }}>Access Restricted</h2>
            <p>Only users with the Administrator role can create and manage user accounts.</p>
          </div>
          <button
            type="button"
            className="login-submit-btn"
            onClick={() => navigate("/addStock")}
            style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <ArrowBackIcon fontSize="small" />
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-container">
      <ToastContainer />
      <div className="login-auth-card" style={{ maxWidth: 480, position: "relative" }}>
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "var(--surface-2, rgba(255,255,255,0.05))",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ArrowBackIcon style={{ fontSize: 16 }} /> Back
          </button>
        )}

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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ margin: 0 }}>Shop Location</label>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewShopName("");
                      setShopModalOpen(true);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent, #0ea5e9)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: 0,
                    }}
                  >
                    <AddIcon style={{ fontSize: 14 }} /> Add Shop
                  </button>
                )}
              </div>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ margin: 0 }}>Role</label>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewRoleName("");
                      setRoleModalOpen(true);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent, #0ea5e9)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: 0,
                    }}
                  >
                    <AddIcon style={{ fontSize: 14 }} /> Add Role
                  </button>
                )}
              </div>
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

      {/* ── Add Shop Location Modal ── */}
      <Dialog
        open={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            borderRadius: 14,
            border: "1px solid var(--border)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <span>Add Shop Location</span>
          <button
            onClick={() => setShopModalOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: 0,
            }}
          >
            <CloseIcon style={{ fontSize: 20 }} />
          </button>
        </div>
        <DialogContent style={{ padding: "18px" }}>
          <form onSubmit={handleAddShop}>
            <div className="login-input-group">
              <label>Shop Location Name</label>
              <div className="login-input-wrap">
                <StorefrontIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="e.g. MAIN BRANCH, CHENNAI STORE"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setShopModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2, transparent)",
                  color: "var(--text)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingShop}
                className="login-submit-btn"
                style={{ flex: 1, marginTop: 0 }}
              >
                <CheckIcon fontSize="small" />
                {isSubmittingShop ? "Saving..." : "Add Shop"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Role Modal ── */}
      <Dialog
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            borderRadius: 14,
            border: "1px solid var(--border)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <span>Add User Role</span>
          <button
            onClick={() => setRoleModalOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: 0,
            }}
          >
            <CloseIcon style={{ fontSize: 20 }} />
          </button>
        </div>
        <DialogContent style={{ padding: "18px" }}>
          <form onSubmit={handleAddRole}>
            <div className="login-input-group">
              <label>Role Name</label>
              <div className="login-input-wrap">
                <PersonOutlineIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="e.g. MANAGER, CASHIER, SUPERVISOR"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2, transparent)",
                  color: "var(--text)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingRole}
                className="login-submit-btn"
                style={{ flex: 1, marginTop: 0 }}
              >
                <CheckIcon fontSize="small" />
                {isSubmittingRole ? "Saving..." : "Add Role"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;