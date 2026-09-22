import React, { useState } from "react";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import InventoryDashboard from "../Dashboards/inventory_dashboard";
import AvailableDashboard from "../Dashboards/available_dashboard";
import "./inventory.css";

const ModelDashboard = () => {
  const [selectedDashboard, setSelectedDashboard] = useState("inventory");

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <div className="dashboard-body">
          <div className="inventory-hub">
            {/* Header */}
            <div className="inventory-header">
              <div className="inventory-title">
                <h1>Stock Insights &amp; Analytics</h1>
                <p>Visual breakdown of quantities by category and style model</p>
              </div>

              {/* Tab Selector */}
              <div className="inventory-tab-bar">
                <button
                  type="button"
                  className={`inventory-tab-btn ${selectedDashboard === "inventory" ? "active" : ""}`}
                  onClick={() => setSelectedDashboard("inventory")}
                >
                  <BarChartOutlinedIcon fontSize="small" />
                  Category Inventory
                </button>
                <button
                  type="button"
                  className={`inventory-tab-btn ${selectedDashboard === "available" ? "active" : ""}`}
                  onClick={() => setSelectedDashboard("available")}
                >
                  <PieChartOutlineOutlinedIcon fontSize="small" />
                  Model Distribution
                </button>
              </div>
            </div>

            {/* Content Card */}
            <div className="inventory-chart-card">
              {selectedDashboard === "inventory" ? (
                <InventoryDashboard />
              ) : (
                <AvailableDashboard />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDashboard;
