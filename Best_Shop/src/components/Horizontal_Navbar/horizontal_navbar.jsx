import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CustomizedSwitches from "./toggleTheme";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AddchartIcon from "@mui/icons-material/Addchart";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "./horizontal_navbar.css";

const HorizontalNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const rawUsername = Cookies.get("username") || "Staff";
  const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);

  const handleNavigate = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    navigate("/login", { state: { successMessage: "Logged out successfully" } });
  };

  const navItems = [
    { icon: <SpaceDashboardOutlinedIcon fontSize="small" />, label: "Dashboard", path: "/home" },
    { icon: <AddchartIcon fontSize="small" />, label: "Add Stock", path: "/addStock" },
    { icon: <ReceiptLongOutlinedIcon fontSize="small" />, label: "Stock Records", path: "/productdashboard" },
    { icon: <Inventory2OutlinedIcon fontSize="small" />, label: "Stock Catalog", path: "/stocks" },
    { icon: <BarChartOutlinedIcon fontSize="small" />, label: "Analytics", path: "/model" },
    { icon: <FileDownloadOutlinedIcon fontSize="small" />, label: "Import / Export", path: "/export" },
  ];

  return (
    <nav className="navbar">
      {/* Brand Logo & Name */}
      <div className="navbar-brand-wrap" onClick={() => handleNavigate("/home")}>
        <div className="navbar-brand-icon">
          <StorefrontIcon fontSize="medium" />
        </div>
        <div className="navbar-brand-text">
          <h1 className="navbar-title">Best Shop</h1>
          <span className="navbar-badge">Retail &bull; Stock POS</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="navbar-right">
        {/* Theme Toggle (Dark/Light) */}
        <CustomizedSwitches />

        {/* User Pill */}
        <div className="navbar-user-chip" title="Signed in user">
          <div className="navbar-user-avatar">
            <PersonOutlineIcon style={{ fontSize: 18 }} />
          </div>
          <span>{username}</span>
        </div>

        {/* Dedicated Logout Button (Clean, single icon) */}
        <button
          type="button"
          className="navbar-logout-btn"
          onClick={handleLogout}
          title="Sign out of system"
        >
          <LogoutOutlinedIcon style={{ fontSize: 16 }} />
          <span>Sign Out</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-hamburger"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle Navigation Menu"
        >
          {showMenu ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {showMenu && (
        <div className="mobile-dropdown-menu">
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li
                key={item.path}
                className="mobile-nav-item"
                onClick={() => handleNavigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default HorizontalNavbar;