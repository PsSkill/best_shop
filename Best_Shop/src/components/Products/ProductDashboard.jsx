import React, { useState, useEffect, useMemo } from "react";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import requestApi from "../../utils/axios";
import dayjs from "dayjs";
import axios from "axios";
import Cookies from "js-cookie";
import apiHost from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import "./ProductDashboard.css";

const ProductDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit State
  const [editingItem, setEditingItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const notifySuccess = (message) => {
    toast.success(message, { position: toast.POSITION.BOTTOM_LEFT });
  };

  const notifyError = (message) => {
    toast.error(message, { position: toast.POSITION.BOTTOM_LEFT });
  };

  const fetchData = async (date) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        date: date.format("YYYY-MM-DD"),
      });
      const response = await requestApi(
        "GET",
        `/api/stock/stock?${queryParams}`
      );
      if (Array.isArray(response?.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching stock list:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  // Quick Date Selectors
  const setQuickDate = (type) => {
    if (type === "today") setSelectedDate(dayjs());
    else if (type === "yesterday") setSelectedDate(dayjs().subtract(1, "day"));
  };

  // Filtered List
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      (item.name || "").toLowerCase().includes(term) ||
      (item.model_name || "").toLowerCase().includes(term) ||
      (item.color_name || "").toLowerCase().includes(term) ||
      (item.size_name || "").toLowerCase().includes(term) ||
      (item.shop || "").toLowerCase().includes(term) ||
      (item.user || "").toLowerCase().includes(term) ||
      String(item.bill_number || "").includes(term) ||
      String(item.selling_price || "").includes(term) ||
      String(item.mrp || "").includes(term)
    );
  }, [data, searchTerm]);

  // Summary Metrics
  const totalPieces = useMemo(() => {
    return filteredList.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  }, [filteredList]);

  const totalValue = useMemo(() => {
    return filteredList.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0);
  }, [filteredList]);

  // Edit Handlers
  const handleEditClick = (item) => {
    setEditingItem({ ...item });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      const token = Cookies.get("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestBody = {
        id: editingItem.id,
        selling_price: parseFloat(editingItem.selling_price) || 0,
        mrp: parseFloat(editingItem.mrp) || 0,
        quantity: parseInt(editingItem.quantity, 10) || 0,
      };

      const response = await axios.put(
        `${apiHost}/api/stock/stock`,
        requestBody,
        { headers }
      );

      if (response.status === 200) {
        notifySuccess("Stock entry updated successfully");
        setEditOpen(false);
        fetchData(selectedDate);
      }
    } catch (error) {
      console.error("Error editing stock:", error);
      notifyError("Failed to update stock entry");
    }
  };

  // Delete Handlers
  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      const token = Cookies.get("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(`${apiHost}/api/stock/stock`, {
        headers,
        data: { id: deletingItem.id },
      });

      if (response.status >= 200 && response.status < 300) {
        notifySuccess("Stock deleted successfully");
        setDeleteOpen(false);
        setData((prev) => prev.filter((item) => item.id !== deletingItem.id));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      notifyError("Failed to delete stock entry");
    }
  };

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <ToastContainer />
        <div className="dashboard-body">
          <div className="stock-records-hub">
            {/* Header */}
            <div className="stock-records-header">
              <div className="stock-records-title">
                <h1>Stock Records &amp; History</h1>
                <p>View, search, edit, or remove incoming product inventory</p>
              </div>

              {/* Summary Chips */}
              <div className="stock-summary-chips">
                <div className="stock-chip">
                  <span>Entries:</span>
                  <strong>{filteredList.length}</strong>
                </div>
                <div className="stock-chip">
                  <span>Total Pieces:</span>
                  <strong>{totalPieces.toLocaleString()}</strong>
                </div>
                <div className="stock-chip">
                  <span>Total Value:</span>
                  <strong style={{ color: "#10b981" }}>₹{totalValue.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Filter & Date Bar */}
            <div className="stock-filter-bar">
              {/* Search Box */}
              <div className="stock-search-wrap">
                <SearchIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="Search by product, model, color, bill, or shop..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    <CloseIcon style={{ fontSize: 16 }} />
                  </button>
                )}
              </div>

              {/* Date Presets & Picker */}
              <div className="stock-date-controls">
                <button
                  type="button"
                  className={`stock-date-btn ${selectedDate.isSame(dayjs(), "day") ? "active" : ""}`}
                  onClick={() => setQuickDate("today")}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`stock-date-btn ${selectedDate.isSame(dayjs().subtract(1, "day"), "day") ? "active" : ""}`}
                  onClick={() => setQuickDate("yesterday")}
                >
                  Yesterday
                </button>

                {/* Direct Date Input */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px" }}>
                  <CalendarMonthOutlinedIcon style={{ fontSize: 18, color: "#0ea5e9" }} />
                  <input
                    type="date"
                    value={selectedDate.format("YYYY-MM-DD")}
                    onChange={(e) => {
                      if (e.target.value) setSelectedDate(dayjs(e.target.value));
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--text)",
                      fontSize: 13,
                      fontWeight: 600,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="stock-date-btn"
                  onClick={() => fetchData(selectedDate)}
                  title="Refresh data"
                >
                  <RefreshIcon style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="stock-table-card">
              <div className="stock-table-wrap">
                <table className="modern-stock-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bill &amp; Date</th>
                      <th>Product &amp; Style</th>
                      <th>Color &amp; Size</th>
                      <th>Quantity</th>
                      <th>MRP</th>
                      <th>Selling Price</th>
                      <th>Total Value</th>
                      <th>Shop &amp; User</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "40px" }}>
                          Loading stock records...
                        </td>
                      </tr>
                    ) : filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={10}>
                          <div className="stock-empty-state">
                            <ReceiptLongOutlinedIcon style={{ fontSize: 48, color: "var(--text-muted)", opacity: 0.6 }} />
                            <h3>No Stock Entries Found</h3>
                            <p>No products were added on {selectedDate.format("DD MMM YYYY")}{searchTerm ? " matching your search" : ""}.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong style={{ color: "var(--text)" }}>Bill #{item.bill_number || "-"}</strong>
                            <div className="stock-prod-meta">{item.date} &bull; {item.time || ""}</div>
                          </td>
                          <td>
                            <span className="stock-prod-name">{item.name}</span>
                            <span className="stock-prod-meta">Model: {item.model_name || "-"}</span>
                          </td>
                          <td>
                            <span className="stock-prod-name">{item.color_name || "-"}</span>
                            <span className="stock-prod-meta">Size: {item.size_name || "-"}</span>
                          </td>
                          <td>
                            <span className="stock-badge-qty">{item.quantity} pcs</span>
                          </td>
                          <td>₹{Number(item.mrp || 0).toLocaleString()}</td>
                          <td>₹{Number(item.selling_price || 0).toLocaleString()}</td>
                          <td>
                            <strong style={{ color: "#10b981" }}>
                              ₹{Number(item.total_price || (item.selling_price * item.quantity) || 0).toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <span className="stock-prod-name">{item.shop || "-"}</span>
                            <span className="stock-prod-meta">{item.user || "-"}</span>
                          </td>
                          <td>
                            <div className="stock-action-btns">
                              <button
                                className="stock-btn-icon"
                                title="Edit quantity or pricing"
                                onClick={() => handleEditClick(item)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                className="stock-btn-icon delete"
                                title="Delete stock record"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editOpen && editingItem && (
            <Dialog
              fullWidth
              maxWidth="sm"
              open={editOpen}
              onClose={() => setEditOpen(false)}
              PaperProps={{
                style: {
                  background: "var(--surface)",
                  color: "var(--text)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                },
              }}
            >
              <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>Edit Stock Entry</span>
                <button
                  onClick={() => setEditOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}
                >
                  <CloseIcon />
                </button>
              </DialogTitle>

              <DialogContent>
                <div className="stock-modal-body">
                  <div className="stock-modal-item-summary">
                    <strong>{editingItem.name}</strong> &bull; Model: {editingItem.model_name} &bull; Size: {editingItem.size_name} &bull; Color: {editingItem.color_name}
                  </div>

                  <div className="stock-modal-field">
                    <label>Quantity (pieces)</label>
                    <input
                      type="number"
                      min="1"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    />
                  </div>

                  <div className="stock-modal-field">
                    <label>Selling Price (₹)</label>
                    <input
                      type="number"
                      value={editingItem.selling_price}
                      onChange={(e) => setEditingItem({ ...editingItem, selling_price: e.target.value })}
                    />
                  </div>

                  <div className="stock-modal-field">
                    <label>MRP (₹)</label>
                    <input
                      type="number"
                      value={editingItem.mrp}
                      onChange={(e) => setEditingItem({ ...editingItem, mrp: e.target.value })}
                    />
                  </div>

                  <div className="stock-modal-actions">
                    <button
                      type="button"
                      className="stock-date-btn"
                      onClick={() => setEditOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="stock-date-btn active"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Delete Confirmation Modal */}
          {deleteOpen && deletingItem && (
            <Dialog
              fullWidth
              maxWidth="xs"
              open={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              PaperProps={{
                style: {
                  background: "var(--surface)",
                  color: "var(--text)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                },
              }}
            >
              <DialogTitle style={{ fontWeight: 700, fontSize: 17, color: "#ef4444" }}>
                Confirm Stock Deletion
              </DialogTitle>
              <DialogContent>
                <p style={{ margin: "0 0 16px 0", fontSize: 14, color: "var(--text)" }}>
                  Are you sure you want to delete this stock entry for <strong>{deletingItem.name}</strong> ({deletingItem.quantity} pcs)?
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    type="button"
                    className="stock-date-btn"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={handleConfirmDelete}
                  >
                    Yes, Delete
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
