import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import requestApi from "../../utils/axios";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "../Inventory/inventory.css";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--background)",
    borderColor: state.isFocused ? "#0ea5e9" : "var(--border)",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(14, 165, 233, 0.2)" : "none",
    borderRadius: 10,
    padding: "2px 4px",
    color: "var(--text)",
    cursor: "pointer",
    minHeight: 42,
    "&:hover": {
      borderColor: "#0ea5e9",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--text)",
    fontWeight: 600,
    fontSize: 14,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--text-muted, #718096)",
    fontSize: 14,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    zIndex: 30,
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0ea5e9"
      : state.isFocused
      ? "var(--surface-hover, rgba(14, 165, 233, 0.08))"
      : "var(--surface)",
    color: state.isSelected ? "#ffffff" : "var(--text)",
    fontWeight: state.isSelected ? 600 : 500,
    fontSize: 14,
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--text)",
  }),
};

export default function AvailableDashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await requestApi("GET", "/api/structure/category");
        if (res.success && Array.isArray(res.data)) {
          const catOptions = res.data.map((c) => ({
            value: c.id,
            label: c.name,
          }));
          setCategories(catOptions);
          if (catOptions.length > 0) {
            setSelectedCategory(catOptions[0]);
          }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setItems([]);
      setSelectedItem(null);
      return;
    }
    const fetchItems = async () => {
      try {
        const res = await requestApi(
          "GET",
          `/api/structure/item-name?category=${selectedCategory.value}`
        );
        if (res.success && Array.isArray(res.data)) {
          const itemOptions = res.data.map((i) => ({
            value: i.id,
            label: i.name,
          }));
          setItems(itemOptions);
          if (itemOptions.length > 0) {
            setSelectedItem(itemOptions[0]);
          } else {
            setSelectedItem(null);
            setModelData([]);
          }
        }
      } catch (err) {
        console.error("Error loading items:", err);
      }
    };
    fetchItems();
  }, [selectedCategory]);

  // Fetch model data when selectedItem changes
  useEffect(() => {
    if (!selectedItem) {
      setModelData([]);
      return;
    }
    const fetchModels = async () => {
      setLoading(true);
      try {
        const res = await requestApi(
          "GET",
          `/api/stock/model-dashboard?item_name=${selectedItem.value}`
        );
        if (res.success && Array.isArray(res.data)) {
          setModelData(res.data);
        } else {
          setModelData([]);
        }
      } catch (err) {
        console.error("Error loading model data:", err);
        setModelData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [selectedItem]);

  const modelNames = modelData.map((m) => m.model_name);
  const availableQuantities = modelData.map((m) =>
    parseInt(m.available_quantity, 10) || 0
  );
  const totalQuantities = modelData.map((m) =>
    parseInt(m.total_quantity, 10) || 0
  );

  const totalAvailable = availableQuantities.reduce((a, b) => a + b, 0);
  const totalPieces = totalQuantities.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {/* Filters Bar */}
      <div className="analytics-filters-bar">
        <div className="analytics-filter-item">
          <label className="analytics-filter-label">
            <CategoryOutlinedIcon style={{ fontSize: 18, color: "#0ea5e9" }} />
            Category
          </label>
          <div className="analytics-select-wrapper">
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(opt) => setSelectedCategory(opt)}
              placeholder="Select Category..."
              styles={customSelectStyles}
            />
          </div>
        </div>

        <div className="analytics-filter-item">
          <label className="analytics-filter-label">
            <LayersOutlinedIcon style={{ fontSize: 18, color: "#0ea5e9" }} />
            Item
          </label>
          <div className="analytics-select-wrapper">
            <Select
              options={items}
              value={selectedItem}
              onChange={(opt) => setSelectedItem(opt)}
              placeholder={selectedCategory ? "Select Item..." : "Select Category first"}
              isDisabled={!selectedCategory || items.length === 0}
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      {/* Overview Stat Chips */}
      {modelData.length > 0 && (
        <div className="analytics-metrics-row">
          <div className="analytics-metric-chip">
            <CheckCircleOutlineIcon style={{ fontSize: 18, color: "#10b981" }} />
            <span>Models Found: <strong>{modelData.length}</strong></span>
          </div>
          <div className="analytics-metric-chip">
            <span>Available In Stock: <strong>{totalAvailable} pcs</strong></span>
          </div>
          <div className="analytics-metric-chip">
            <span>Total Stock Recorded: <strong>{totalPieces} pcs</strong></span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
          Loading model distribution data...
        </div>
      ) : !selectedCategory || !selectedItem ? (
        <div className="inventory-empty">
          <CategoryOutlinedIcon style={{ fontSize: 52, color: "#0ea5e9", opacity: 0.6 }} />
          <h3>Select a Category and Item</h3>
          <p>Choose product category and item options above to analyze model stock distribution.</p>
        </div>
      ) : modelData.length === 0 ? (
        <div className="inventory-empty">
          <Inventory2OutlinedIcon style={{ fontSize: 52, color: "var(--text-muted)", opacity: 0.6 }} />
          <h3>No Model Records Found</h3>
          <p>No stock entries recorded for <strong>{selectedItem.label}</strong> yet.</p>
        </div>
      ) : (
        <>
          {/* Comparison Bar Chart */}
          <div style={{ width: "100%", minHeight: 360 }}>
            <ReactApexChart
              height={360}
              width="100%"
              type="bar"
              series={[
                { name: "Available Stock", data: availableQuantities },
                { name: "Total Stock", data: totalQuantities },
              ]}
              options={{
                chart: {
                  type: "bar",
                  toolbar: {
                    show: true,
                    offsetX: -4,
                    offsetY: 0,
                    tools: {
                      download: true,
                      selection: false,
                      zoom: false,
                      zoomin: false,
                      zoomout: false,
                      pan: false,
                      reset: false,
                    },
                    export: {
                      csv: {
                        filename: `${selectedItem?.label || "model"}-distribution-data`,
                        headerCategory: "Model Name",
                      },
                      svg: {
                        filename: `${selectedItem?.label || "model"}-distribution-chart`,
                      },
                      png: {
                        filename: `${selectedItem?.label || "model"}-distribution-chart`,
                      },
                    },
                  },
                  fontFamily: "'Inter', sans-serif",
                  background: "transparent",
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "42%",
                    borderRadius: 6,
                    borderRadiusApplication: "end",
                    dataLabels: {
                      position: "top",
                    },
                  },
                },
                colors: ["#10b981", "#0ea5e9"],
                dataLabels: {
                  enabled: true,
                  formatter: (val) => (val > 0 ? `${val} pcs` : ""),
                  offsetY: -20,
                  style: {
                    fontSize: "11px",
                    fontWeight: 600,
                    colors: ["var(--text)"],
                  },
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: modelNames,
                  labels: {
                    style: {
                      colors: "var(--text-muted, #718096)",
                      fontSize: "12px",
                      fontWeight: 600,
                    },
                  },
                  axisBorder: { show: true, color: "var(--border)" },
                  axisTicks: { show: false },
                },
                yaxis: {
                  title: {
                    text: "Quantity (Pieces)",
                    style: { color: "var(--text-muted)", fontSize: "12px", fontWeight: 600 },
                  },
                  labels: {
                    formatter: (val) => Math.round(val),
                    style: { colors: "var(--text-muted, #718096)", fontSize: "12px" },
                  },
                },
                grid: {
                  borderColor: "var(--border)",
                  strokeDashArray: 4,
                  yaxis: { lines: { show: true } },
                },
                legend: {
                  position: "top",
                  horizontalAlign: "left",
                  offsetX: 8,
                  offsetY: 4,
                  labels: { colors: "var(--text)" },
                  markers: { radius: 4 },
                },
                tooltip: {
                  theme: "dark",
                  y: {
                    formatter: (val) => `${val} pieces`,
                  },
                },
              }}
            />
          </div>

          {/* Model Breakdown Cards Grid */}
          <div className="model-cards-grid">
            {modelData.map((item, index) => {
              const avail = parseInt(item.available_quantity, 10) || 0;
              const total = parseInt(item.total_quantity, 10) || 0;
              const percentage = total > 0 ? Math.min(100, Math.round((avail / total) * 100)) : 0;
              const statusClass = avail > 5 ? "in-stock" : avail > 0 ? "low-stock" : "out-of-stock";
              const statusLabel = avail > 5 ? "In Stock" : avail > 0 ? "Low Stock" : "Out of Stock";

              return (
                <div key={index} className="model-stat-card">
                  <div className="model-card-header">
                    <span className="model-card-title">{item.model_name}</span>
                    <span className={`model-stock-badge ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="model-qty-row">
                    <span className="model-qty-label">Stock Status</span>
                    <span className="model-qty-val">
                      {avail} <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/ {total} pcs</span>
                    </span>
                  </div>

                  <div className="model-progress-track">
                    <div
                      className="model-progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>Availability</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
