import React from "react";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import InventoryDashboard from "../Dashboards/inventory_dashboard";
import "./inventory.css";

export default function SimpleBarChart() {
  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <div className="dashboard-body">
          <div className="inventory-hub">
            <div className="inventory-header">
              <div className="inventory-title">
                <h1>Inventory Stock Analysis</h1>
                <p>Available quantity vs total quantity by product categories</p>
              </div>
            </div>

            <div className="inventory-chart-card">
              <InventoryDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
