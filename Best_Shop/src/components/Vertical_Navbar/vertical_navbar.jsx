import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AddchartIcon from "@mui/icons-material/Addchart";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import "./vertical_navbar.css";

const VerticalNavbar = () => {
  const rawUsername = Cookies.get("username") || "Staff";
  const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.substring(1) || "home";

  const navItems = [
    { key: "home", icon: <SpaceDashboardOutlinedIcon />, label: "Dashboard", path: "/home" },
    { key: "addStock", icon: <AddchartIcon />, label: "Add Stock", path: "/addStock" },
    { key: "productdashboard", icon: <ReceiptLongOutlinedIcon />, label: "Stock Records", path: "/productdashboard" },
    { key: "stocks", icon: <Inventory2OutlinedIcon />, label: "Stock Catalog", path: "/stocks" },
    { key: "model", icon: <BarChartOutlinedIcon />, label: "Analytics", path: "/model" },
    { key: "export", icon: <FileDownloadOutlinedIcon />, label: "Import & Export", path: "/export" },
  ];

  return (
    <aside className="vertical-navbar">
      <div>
        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            <PersonOutlineIcon style={{ fontSize: 20 }} />
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{username}</span>
            <span className="sidebar-user-status">
              <span className="sidebar-status-dot"></span>
              Store Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const isActive = currentPath === item.key || (item.key === "model" && currentPath === "inventory");
            return (
              <li
                key={item.key}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="sidebar-footer-text">&bull; Best Shop POS System</span>
        <span className="sidebar-footer-text" style={{ fontSize: 10, opacity: 0.7 }}>Retail Inventory Manager</span>
      </div>
    </aside>
  );
};

export default VerticalNavbar;