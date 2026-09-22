import React, { useState, useEffect, useMemo } from "react";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CloseIcon from "@mui/icons-material/Close";
import requestApi from "../../utils/axios";
import apiHost from "../../utils/api";
import "./stocks.css";

function Stocks() {
  const [items, setItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await requestApi("GET", "/api/stock/products");
      if (Array.isArray(response?.data)) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching stock catalog:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubItems = async (item) => {
    setLoading(true);
    try {
      const response = await requestApi(
        "GET",
        `/api/stock/products/item?item_name=${item.id}`
      );
      if (Array.isArray(response?.data)) {
        setSubItems(response.data);
      } else {
        setSubItems([]);
      }
      setSelectedItem(item);
      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching item variants:", error);
      setSubItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items in catalog view
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.item_name || "").toLowerCase().includes(q) ||
        (item.category_name || "").toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Filter variants in detail view
  const filteredSubItems = useMemo(() => {
    if (!searchQuery.trim()) return subItems;
    const q = searchQuery.toLowerCase();
    return subItems.filter(
      (s) =>
        (s.model_name || "").toLowerCase().includes(q) ||
        (s.color_name || "").toLowerCase().includes(q) ||
        (s.size_name || "").toLowerCase().includes(q) ||
        (s.brand_name || "").toLowerCase().includes(q) ||
        (s.subcategory_name || "").toLowerCase().includes(q)
    );
  }, [subItems, searchQuery]);

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <div className="dashboard-body">
          <div className="stocks-hub">
            {/* Top Navigation Bar: Changes depending on selected view */}
            {selectedItem == null ? (
              <div className="stocks-header">
                <div className="stocks-title">
                  <h1>Stock Catalog &amp; Available Inventory</h1>
                  <p>Browse product categories and check current stock quantities</p>
                </div>
              </div>
            ) : (
              <div className="stocks-back-bar">
                <button
                  type="button"
                  className="stocks-back-btn"
                  onClick={() => {
                    setSelectedItem(null);
                    setSearchQuery("");
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Back to All Categories
                </button>
                <div className="stocks-selected-title">
                  <LayersOutlinedIcon style={{ color: "#0ea5e9" }} />
                  <span>
                    {selectedItem.category_name} &bull; <strong>{selectedItem.item_name}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Search Filter Bar */}
            <div className="stocks-search-bar">
              <SearchIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
              <input
                type="text"
                placeholder={
                  selectedItem == null
                    ? "Search any product name or category..."
                    : "Search models, colors, or sizes inside this item..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <CloseIcon style={{ fontSize: 16 }} />
                </button>
              )}
            </div>

            {/* View 1: Main Catalog Cards */}
            {selectedItem == null && (
              <div className="stocks-grid">
                {loading ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                    Loading stock catalog...
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                    <Inventory2OutlinedIcon style={{ fontSize: 48, opacity: 0.5 }} />
                    <h3 style={{ marginTop: 12, color: "var(--text)" }}>No Products Found</h3>
                    <p>No products match your search query.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const count = Number(item.count) || 0;
                    return (
                      <div
                        className="stocks-card"
                        key={item.id}
                        onClick={() => fetchSubItems(item)}
                      >
                        <div className="stocks-card-top">
                          <div className="stocks-card-thumb">
                            {item.category_image ? (
                              <img
                                src={`${apiHost}/${item.category_image}`}
                                alt={item.item_name}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <Inventory2OutlinedIcon style={{ color: "#0ea5e9" }} />
                            )}
                          </div>
                          <div className="stocks-card-details">
                            <span className="stocks-cat-badge">{item.category_name}</span>
                            <span className="stocks-item-name">{item.item_name}</span>
                          </div>
                        </div>

                        <div className="stocks-card-bottom">
                          <span
                            className={`stocks-status-pill ${
                              count > 5 ? "in-stock" : count > 0 ? "low-stock" : "out-of-stock"
                            }`}
                          >
                            {count > 0 ? `${count} Available` : "Out of Stock"}
                          </span>
                          <span className="stocks-card-action">
                            View Sizes &amp; Variants &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* View 2: Sub-Item Variants Detail View */}
            {selectedItem != null && (
              <div className="stocks-variant-grid">
                {loading ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                    Loading item variants...
                  </div>
                ) : filteredSubItems.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                    <LayersOutlinedIcon style={{ fontSize: 48, opacity: 0.5 }} />
                    <h3 style={{ marginTop: 12, color: "var(--text)" }}>No Variants Found</h3>
                    <p>No variants match your search for this product.</p>
                  </div>
                ) : (
                  filteredSubItems.map((subItem, index) => (
                    <div className="stocks-variant-card" key={index}>
                      <div className="stocks-variant-header">
                        <span className="stocks-variant-title">{subItem.model_name || "Standard Model"}</span>
                        <span className="stocks-variant-size">Size: {subItem.size_name || "-"}</span>
                      </div>

                      <div className="stocks-variant-meta">
                        <div className="stocks-meta-item">
                          <span className="stocks-meta-label">Brand</span>
                          <span className="stocks-meta-val">{subItem.brand_name || "-"}</span>
                        </div>
                        <div className="stocks-meta-item">
                          <span className="stocks-meta-label">Color</span>
                          <span className="stocks-meta-val">{subItem.color_name || "-"}</span>
                        </div>
                        <div className="stocks-meta-item">
                          <span className="stocks-meta-label">Sub-Category</span>
                          <span className="stocks-meta-val">{subItem.subcategory_name || "-"}</span>
                        </div>
                        <div className="stocks-meta-item">
                          <span className="stocks-meta-label">MRP</span>
                          <span className="stocks-meta-val">₹{Number(subItem.price || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Current In Stock</span>
                        <strong style={{ fontSize: 16, color: Number(subItem.total_quantity) > 0 ? "#10b981" : "#ef4444" }}>
                          {subItem.total_quantity || 0} pcs
                        </strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stocks;