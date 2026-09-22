import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import StockDashboard from "../Dashboards/main_dashboard";
import requestApi from "../../utils/axios";
import CountUp from "react-countup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userDataResponse, shopCountResponse, totalPriceResponse] =
          await Promise.all([
            requestApi("GET", "/api/stock/shop-user"),
            requestApi("GET", "/api/stock/shop-count"),
            requestApi("GET", "/api/stock/dashboard-data"),
          ]);

        if (userDataResponse?.data?.[0]?.shop_user !== undefined) {
          setUserData(userDataResponse.data[0].shop_user);
        }
        if (shopCountResponse?.data?.[0]?.shop_count !== undefined) {
          setShopCount(shopCountResponse.data[0].shop_count);
        }
        if (Array.isArray(totalPriceResponse?.data)) {
          const total = totalPriceResponse.data.reduce(
            (sum, item) => sum + (parseFloat(item.total_price) || 0),
            0
          );
          setTotalPrice(total);
        }
      } catch (error) {
        console.error("Error fetching home dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const todayString = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <div className="dashboard-body">
          <div className="home-hub">
            {/* Welcome Banner */}
            <div className="home-welcome-card">
              <div className="home-welcome-text">
                <h1>Shop Management Hub</h1>
                <p>{todayString} &bull; Quick actions and live stock summary</p>
              </div>
              <div className="home-quick-actions">
                <button
                  className="home-action-btn primary"
                  onClick={() => navigate("/addStock")}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                  Add New Stock
                </button>
                <button
                  className="home-action-btn secondary"
                  onClick={() => navigate("/stocks")}
                >
                  <Inventory2OutlinedIcon fontSize="small" />
                  View Stock Catalog
                </button>
                <button
                  className="home-action-btn secondary"
                  onClick={() => navigate("/productdashboard")}
                >
                  <ReceiptLongOutlinedIcon fontSize="small" />
                  Stock Records Table
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="home-metrics-grid">
              <div className="home-metric-card">
                <div className="home-metric-icon green">
                  <AttachMoneyOutlinedIcon />
                </div>
                <div className="home-metric-info">
                  <span className="home-metric-label">Total Stock Value</span>
                  <span className="home-metric-value">
                    ₹<CountUp duration={1.5} end={totalPrice} separator="," />
                  </span>
                  <span className="home-metric-sub">Calculated live</span>
                </div>
              </div>

              <div className="home-metric-card">
                <div className="home-metric-icon blue">
                  <StorefrontOutlinedIcon />
                </div>
                <div className="home-metric-info">
                  <span className="home-metric-label">Active Shops</span>
                  <span className="home-metric-value">
                    <CountUp duration={1} end={shopCount} />
                  </span>
                  <span className="home-metric-sub">Locations enabled</span>
                </div>
              </div>

              <div className="home-metric-card">
                <div className="home-metric-icon purple">
                  <PeopleAltOutlinedIcon />
                </div>
                <div className="home-metric-info">
                  <span className="home-metric-label">Staff / Users</span>
                  <span className="home-metric-value">
                    <CountUp duration={1} end={userData} />
                  </span>
                  <span className="home-metric-sub">Authorized accounts</span>
                </div>
              </div>

              <div className="home-metric-card">
                <div className="home-metric-icon amber">
                  <TrendingUpOutlinedIcon />
                </div>
                <div className="home-metric-info">
                  <span className="home-metric-label">Inventory Health</span>
                  <span className="home-metric-value">Active</span>
                  <span className="home-metric-sub">Stock system online</span>
                </div>
              </div>
            </div>

            {/* Main Section: Chart + Quick Jump Panel */}
            <div className="home-main-grid">
              {/* Left Chart Area */}
              <div className="home-chart-card">
                <div className="home-card-header">
                  <div>
                    <div className="home-card-title">
                      <BarChartOutlinedIcon style={{ color: "#0ea5e9" }} />
                      Stock Aging Breakdown
                    </div>
                    <span className="home-card-subtitle">
                      Distribution by arrival time: Fresh (&lt;30 days), Medium (30-180 days), Aged (&gt;180 days)
                    </span>
                  </div>
                  <button
                    className="home-action-btn secondary"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                    onClick={() => navigate("/model")}
                  >
                    Detailed Analysis &rarr;
                  </button>
                </div>

                <div style={{ minHeight: "380px" }}>
                  <StockDashboard />
                </div>
              </div>

              {/* Right Shortcuts Area */}
              <div className="home-side-card">
                <div className="home-card-header">
                  <div className="home-card-title">
                    <Inventory2OutlinedIcon style={{ color: "#0ea5e9" }} />
                    Quick Tasks
                  </div>
                </div>

                <div className="home-shortcut-list">
                  <div
                    className="home-shortcut-item"
                    onClick={() => navigate("/addStock")}
                  >
                    <div className="home-shortcut-left">
                      <AddCircleOutlineIcon style={{ color: "#10b981" }} />
                      <div>
                        <div className="home-shortcut-title">Add Incoming Stock</div>
                        <div className="home-shortcut-desc">Enter products &amp; sizes</div>
                      </div>
                    </div>
                    <ArrowForwardIosIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                  </div>

                  <div
                    className="home-shortcut-item"
                    onClick={() => navigate("/stocks")}
                  >
                    <div className="home-shortcut-left">
                      <Inventory2OutlinedIcon style={{ color: "#0ea5e9" }} />
                      <div>
                        <div className="home-shortcut-title">Stock Catalog</div>
                        <div className="home-shortcut-desc">Browse by category &amp; model</div>
                      </div>
                    </div>
                    <ArrowForwardIosIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                  </div>

                  <div
                    className="home-shortcut-item"
                    onClick={() => navigate("/productdashboard")}
                  >
                    <div className="home-shortcut-left">
                      <ReceiptLongOutlinedIcon style={{ color: "#8b5cf6" }} />
                      <div>
                        <div className="home-shortcut-title">All Stock Records</div>
                        <div className="home-shortcut-desc">Filter, edit &amp; manage entries</div>
                      </div>
                    </div>
                    <ArrowForwardIosIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                  </div>

                  <div
                    className="home-shortcut-item"
                    onClick={() => navigate("/model")}
                  >
                    <div className="home-shortcut-left">
                      <BarChartOutlinedIcon style={{ color: "#f59e0b" }} />
                      <div>
                        <div className="home-shortcut-title">Category Insights</div>
                        <div className="home-shortcut-desc">Explore models &amp; quantities</div>
                      </div>
                    </div>
                    <ArrowForwardIosIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                  </div>

                  <div
                    className="home-shortcut-item"
                    onClick={() => navigate("/export")}
                  >
                    <div className="home-shortcut-left">
                      <FileDownloadOutlinedIcon style={{ color: "#ec4899" }} />
                      <div>
                        <div className="home-shortcut-title">Export / Backup Excel</div>
                        <div className="home-shortcut-desc">Download stock spreadsheets</div>
                      </div>
                    </div>
                    <ArrowForwardIosIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
