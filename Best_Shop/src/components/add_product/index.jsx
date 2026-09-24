import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import requestApi from "../../utils/axios";
import apiHost from "../../utils/api";
import "./add_product.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// MUI Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StraightenIcon from "@mui/icons-material/Straighten";
import ListAltIcon from "@mui/icons-material/ListAlt";

// ─────────────────────────────────────────────────────────
// Small reusable: SelectBox
// ─────────────────────────────────────────────────────────
function SelectBox({ value, placeholder, onClick, onClear, disabled }) {
  const filled = !!value;
  return (
    <div
      className={`as-select-box ${filled ? "filled" : "placeholder"} ${disabled ? "disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
      style={disabled ? { opacity: 0.45, cursor: "not-allowed" } : {}}
    >
      <span className="as-select-value">{value || placeholder}</span>
      <span className="as-select-icons">
        {filled && onClear ? (
          <button
            type="button"
            className="as-select-clear-btn"
            title="Clear selection"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <CloseIcon style={{ fontSize: 16 }} />
          </button>
        ) : filled ? (
          <CheckCircleOutlineIcon className="check-icon" />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Picker Dialog — generic list picker
// ─────────────────────────────────────────────────────────
function PickerDialog({
  open,
  onClose,
  title,
  items,
  selectedId,
  onSelect,
  allowClear,
  tab,
  setTab,
  newForm,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const getName = (item) =>
    item?.name || item?.item_name || item?.sub_category_name || item?.brand_name ||
    item?.size_name || item?.model_name || item?.occasion_name || item?.type_name || "";

  const list = Array.isArray(items) ? items : [];

  // Deduplicate items by displayed name
  const seenNames = new Set();
  const dedupedList = [];
  for (const item of list) {
    const rawName = getName(item);
    const normalized = (rawName || "").trim().toUpperCase();
    if (normalized) {
      if (!seenNames.has(normalized)) {
        seenNames.add(normalized);
        dedupedList.push(item);
      }
    } else {
      dedupedList.push(item);
    }
  }

  const filtered = dedupedList.filter((i) =>
    getName(i).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) setSearch("");
  }, [open, tab]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          background: "var(--surface)",
          color: "var(--text)",
          borderRadius: 12,
          border: "1px solid var(--border)",
        },
      }}
    >
      {/* Header */}
      <div className="as-dialog-title" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        fontSize: 15, fontWeight: 700
      }}>
        <span>{title}</span>
        <button onClick={onClose} className="as-list-item-btn" style={{ width: 30, height: 30 }}>
          <CloseIcon style={{ fontSize: 18 }} />
        </button>
      </div>

      <DialogContent style={{ background: "var(--surface)", color: "var(--text)", padding: "16px 20px" }}>
        {/* Tabs */}
        <div className="as-tab-bar">
          <button className={`as-tab ${tab === "existing" ? "active" : ""}`} onClick={() => setTab("existing")}>
            Select Existing
          </button>
          <button className={`as-tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>
            Add New
          </button>
        </div>

        {tab === "existing" ? (
          <>
            {/* Search */}
            <div className="as-search-box">
              <SearchIcon />
              <input
                className="as-search-input"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* List */}
            <div className="as-list-grid">
              {allowClear && (
                <div
                  className={`as-list-item as-clear-item ${!selectedId ? "selected" : ""}`}
                  onClick={() => {
                    onSelect(null);
                    onClose();
                  }}
                >
                  <span style={{ color: "var(--text-muted)", fontStyle: "italic", display: "flex", alignItems: "center", gap: 6 }}>
                    <CloseIcon style={{ fontSize: 16 }} /> Clear selection (None)
                  </span>
                  {!selectedId && <CheckCircleOutlineIcon className="check-icon" style={{ fontSize: 16 }} />}
                </div>
              )}
              {filtered.length === 0 ? (
                <div className="as-loading">No items found</div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`as-list-item ${selectedId === item.id ? "selected" : ""}`}
                    onClick={() => { onSelect(item); onClose(); }}
                  >
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getName(item)}
                    </span>
                    {(onEdit || onDelete) && (
                      <span className="as-list-item-actions" onClick={(e) => e.stopPropagation()}>
                        {onEdit && (
                          <button className="as-list-item-btn" onClick={() => { onEdit(item); onClose(); }}>
                            <EditOutlinedIcon />
                          </button>
                        )}
                        {onDelete && (
                          <button className="as-list-item-btn danger" onClick={() => onDelete(item.id, getName(item))}>
                            <DeleteOutlineIcon />
                          </button>
                        )}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div>{newForm}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Edit dialog
// ─────────────────────────────────────────────────────────
function EditDialog({ open, onClose, title, value, onChange, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"
      PaperProps={{ style: { background: "var(--surface)", color: "var(--text)", borderRadius: 12, border: "1px solid var(--border)" } }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 15 }}>Edit {title}</div>
      <DialogContent style={{ background: "var(--surface)", padding: "16px 20px" }}>
        <div className="as-new-form">
          <input className="as-new-input" value={value} onChange={onChange} placeholder={`Enter ${title} name`} />
          <div className="as-dialog-actions">
            <button className="as-btn-secondary" onClick={onClose}>Cancel</button>
            <button className="as-btn-primary" onClick={onSave}>Save</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
export default function AddStocks() {
  const notify = {
    success: (m) => toast.success(m, { position: "bottom-left" }),
    error: (m) => toast.error(m, { position: "bottom-left" }),
  };

  // ── Bill number
  const [bill, setBill] = useState("");

  // ── Selected product hierarchy
  const [sel, setSel] = useState({
    category: null,
    itemName: null,
    subCategory: null,
    brand: null,
    model: null,
    color: null,
    occasion: null,
    type: null,
  });

  // ── Data lists loaded from API
  const [lists, setLists] = useState({
    categories: [],
    itemNames: [],
    subCategories: [],
    brands: [],
    models: [],
    colors: [],
    sizes: [],
    occasions: [],
    types: [],
  });

  // ── Size rows: array of { id, size_id, size_name, quantity }
  const [sizeRows, setSizeRows] = useState([{ id: Date.now(), size_id: "", size_name: "", quantity: "" }]);

  // ── Pricing
  const [pricing, setPricing] = useState({ purchase: "", selling: "", mrp: "" });

  // ── Dialog open states
  const [dialogs, setDialogs] = useState({
    category: false, itemName: false, subCategory: false, brand: false,
    model: false, color: false, size: false, occasion: false, type: false,
  });

  // ── Dialog tabs
  const [tabs, setTabs] = useState({
    category: "existing", itemName: "existing", subCategory: "existing", brand: "existing",
    model: "existing", color: "existing", size: "existing", occasion: "existing", type: "existing",
  });

  const [activeSizeRowId, setActiveSizeRowId] = useState(null);

  // ── New item values
  const [newVals, setNewVals] = useState({
    category: "", categoryImg: null,
    itemName: "", itemImg: null,
    subCategory: "", subImg: null,
    brand: "", brandImg: null,
    model: "", color: "", size: "", occasion: "", type: "",
  });

  // ── Edit states
  const [edit, setEdit] = useState({ open: false, type: "", id: null, value: "" });

  // ── Misc
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentList, setRecentList] = useState([]);

  // ─────────────────────────────────────────────────────
  // Fetch helpers
  // ─────────────────────────────────────────────────────
  const fetchList = useCallback(async (url, key) => {
    try {
      const res = await requestApi("GET", url, {});
      if (res.success) setLists((prev) => ({ ...prev, [key]: res.data }));
    } catch (_) {}
  }, []);

  // Initial loads — load all existing items across all levels
  useEffect(() => {
    fetchList("/api/structure/category", "categories");
    fetchList("/api/structure/item-name", "itemNames");
    fetchList("/api/structure/sub-category", "subCategories");
    fetchList("/api/structure/brand", "brands");
    fetchList("/api/structure/model", "models");
    fetchList("/api/structure/color", "colors");
    fetchList("/api/structure/size", "sizes");
    fetchList("/api/structure/occasion", "occasions");
    fetchList("/api/structure/type", "types");
  }, [fetchList]);

  // ─────────────────────────────────────────────────────
  // Selection handler
  // ─────────────────────────────────────────────────────
  const handleSelect = (field, value) => {
    setSel((prev) => ({ ...prev, [field]: value }));
    setDialogs((prev) => ({ ...prev, [field]: false }));
    setTabs((prev) => ({ ...prev, [field]: "existing" }));
  };

  const openDialog = (field) => {
    setDialogs((prev) => ({ ...prev, [field]: true }));
    setTabs((prev) => ({ ...prev, [field]: "existing" }));
  };
  const closeDialog = (field) => {
    setDialogs((prev) => ({ ...prev, [field]: false }));
  };

  // ─────────────────────────────────────────────────────
  // Size row handlers
  // ─────────────────────────────────────────────────────
  const addSizeRow = () => {
    setSizeRows((prev) => [...prev, { id: Date.now(), size_id: "", size_name: "", quantity: "" }]);
  };

  const removeSizeRow = (rowId) => {
    setSizeRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const updateSizeRow = (rowId, field, value, sizeNameOverride) => {
    setSizeRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        if (field === "size_id") {
          const found = lists.sizes.find((s) => s.id === Number(value) || s.id === value);
          const name = sizeNameOverride || (found ? (found.name || found.size_name) : "");
          return { ...r, size_id: value, size_name: name };
        }
        return { ...r, [field]: value };
      })
    );
  };

  // ─────────────────────────────────────────────────────
  // Pricing handlers
  // ─────────────────────────────────────────────────────
  const handleSellingChange = (v) => {
    setPricing((prev) => ({ ...prev, selling: v, mrp: v }));
  };

  // ─────────────────────────────────────────────────────
  // Live summary calculations
  // ─────────────────────────────────────────────────────
  const totalQty = sizeRows.reduce((s, r) => s + (Number(r.quantity) || 0), 0);
  const totalValue = totalQty * (Number(pricing.mrp) || 0);

  // ─────────────────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────────────────
  const handleReset = () => {
    setSel({ category: null, itemName: null, subCategory: null, brand: null, model: null, color: null, occasion: null, type: null });
    setSizeRows([{ id: Date.now(), size_id: "", size_name: "", quantity: "" }]);
    setPricing({ purchase: "", selling: "", mrp: "" });
    setBill("");
  };

  // ─────────────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!bill.toString().trim()) return notify.error("Please enter S.No / Bill number.");
    if (!sel.category) return notify.error("Please select a Category.");
    if (!sel.itemName) return notify.error("Please select an Item Name.");
    if (!sel.subCategory) return notify.error("Please select a Sub-Category.");
    if (!sel.brand) return notify.error("Please select a Brand.");
    if (!sel.model) return notify.error("Please select a Model.");
    if (!sel.color) return notify.error("Please select a Colour.");

    const validRows = sizeRows.filter((r) => r.size_id && Number(r.quantity) > 0);
    if (validRows.length === 0) return notify.error("Please add at least one size with quantity.");

    if (!pricing.purchase || Number(pricing.purchase) <= 0) return notify.error("Please enter a valid Purchase Price.");
    if (!pricing.selling || Number(pricing.selling) <= 0) return notify.error("Please enter a valid Selling Price.");
    if (!pricing.mrp || Number(pricing.mrp) <= 0) return notify.error("Please enter a valid MRP.");

    const productName = [sel.category?.name, sel.itemName?.name, sel.subCategory?.name, sel.brand?.name]
      .filter(Boolean).join("-");

    const bodyData = {
      bill_number: bill,
      category: sel.category?.id,
      item_name: sel.itemName?.id,
      sub_category: sel.subCategory?.id,
      brand: sel.brand?.id,
      model: sel.model?.id,
      color: sel.color?.id,
      size: validRows.map((r) => Number(r.size_id)),
      quantity: validRows.map((r) => Number(r.quantity)),
      occasion: sel.occasion?.id || null,
      type: sel.type?.id || null,
      name: productName,
      purchasing_price: pricing.purchase,
      selling_price: pricing.selling,
      mrp: pricing.mrp,
    };

    setIsSubmitting(true);
    try {
      const res = await requestApi("POST", "/api/stock/stock", bodyData, {});
      if (res.success) {
        notify.success("Stock added successfully!");
        const sizesSummary = validRows.map((r) => r.size_name || r.size_id).join(", ");
        setRecentList((prev) => [

          {
            id: Date.now(),
            name: productName,
            sub: `${sel.color?.name} · Sizes: ${sizesSummary} · ${totalQty} pcs · Bill ${bill}`,
            price: `₹${totalValue.toLocaleString()}`,
          },
          ...prev.slice(0, 9),
        ]);
        // Reset pricing + sizes but keep product selection for next entry
        setSizeRows([{ id: Date.now(), size_id: "", size_name: "", quantity: "" }]);
        setPricing({ purchase: "", selling: "", mrp: "" });
      } else {
        notify.error((res.error && res.error.response && res.error.response.data && res.error.response.data.message) || "Failed to add stock.");
      }
    } catch (_) {
      notify.error("Failed to add stock.");
    }
    setIsSubmitting(false);
  };

  // ─────────────────────────────────────────────────────
  // Add NEW item helpers (via structure API)
  // ─────────────────────────────────────────────────────
  const addNewItem = async (endpoint, formData, successMsg, refreshFn) => {
    try {
      const res = await fetch(`${apiHost}${endpoint}`, { method: "POST", body: formData });
      if (res.ok) {
        notify.success(successMsg);
        if (refreshFn) await refreshFn();
      } else {
        const errorData = await res.json().catch(() => ({}));
        notify.error(errorData.error || errorData.message || "Failed to add.");
      }
    } catch (_) {
      notify.error("Failed to add.");
    }
  };

  const submitNewCategory = async () => {
    if (!newVals.category) return notify.error("Name is required.");
    const fd = new FormData();
    fd.append("name", newVals.category.trim());
    if (newVals.categoryImg) fd.append("image", newVals.categoryImg);
    await addNewItem("/api/structure/category", fd, "Category added.", async () => {
      await fetchList("/api/structure/category", "categories");
      setNewVals((p) => ({ ...p, category: "", categoryImg: null }));
      setTabs((p) => ({ ...p, category: "existing" }));
    });
  };

  const submitNewItemName = async () => {
    if (!newVals.itemName) return notify.error("Enter item name.");
    const fd = new FormData();
    if (sel.category) fd.append("category", sel.category.id);
    else if (lists.categories.length > 0) fd.append("category", lists.categories[0].id);
    else fd.append("category", "0");
    fd.append("name", newVals.itemName.trim());
    if (newVals.itemImg) fd.append("image", newVals.itemImg);
    await addNewItem("/api/structure/item-name", fd, "Item name added.", async () => {
      await fetchList("/api/structure/item-name", "itemNames");
      setNewVals((p) => ({ ...p, itemName: "", itemImg: null }));
      setTabs((p) => ({ ...p, itemName: "existing" }));
    });
  };

  const submitNewSubCategory = async () => {
    if (!newVals.subCategory) return notify.error("Enter sub-category name.");
    const fd = new FormData();
    if (sel.itemName) fd.append("item_name", sel.itemName.id);
    else if (lists.itemNames.length > 0) fd.append("item_name", lists.itemNames[0].id);
    else fd.append("item_name", "0");
    fd.append("name", newVals.subCategory.trim());
    if (newVals.subImg) fd.append("image", newVals.subImg);
    await addNewItem("/api/structure/sub-category", fd, "Sub-category added.", async () => {
      await fetchList("/api/structure/sub-category", "subCategories");
      setNewVals((p) => ({ ...p, subCategory: "", subImg: null }));
      setTabs((p) => ({ ...p, subCategory: "existing" }));
    });
  };

  const submitNewBrand = async () => {
    if (!newVals.brand) return notify.error("Enter brand name.");
    const fd = new FormData();
    if (sel.subCategory) fd.append("sub_category", sel.subCategory.id);
    else if (lists.subCategories.length > 0) fd.append("sub_category", lists.subCategories[0].id);
    else fd.append("sub_category", "0");
    fd.append("name", newVals.brand.trim());
    if (newVals.brandImg) fd.append("image", newVals.brandImg);
    await addNewItem("/api/structure/brand", fd, "Brand added.", async () => {
      await fetchList("/api/structure/brand", "brands");
      setNewVals((p) => ({ ...p, brand: "", brandImg: null }));
      setTabs((p) => ({ ...p, brand: "existing" }));
    });
  };

  const submitNewModel = async () => {
    if (!newVals.model) return notify.error("Enter model name.");
    const fd = new FormData();
    if (sel.brand) fd.append("brand", sel.brand.id);
    else if (lists.brands.length > 0) fd.append("brand", lists.brands[0].id);
    else fd.append("brand", "0");
    fd.append("name", newVals.model.trim());
    await addNewItem("/api/structure/model", fd, "Model added.", async () => {
      await fetchList("/api/structure/model", "models");
      setNewVals((p) => ({ ...p, model: "" }));
      setTabs((p) => ({ ...p, model: "existing" }));
    });
  };

  const submitNewColor = async () => {
    if (!newVals.color) return notify.error("Enter colour name.");
    const fd = new FormData();
    if (sel.model) fd.append("model", sel.model.id);
    else if (lists.models.length > 0) fd.append("model", lists.models[0].id);
    else fd.append("model", "0");
    fd.append("name", newVals.color.trim());
    await addNewItem("/api/structure/color", fd, "Colour added.", async () => {
      await fetchList("/api/structure/color", "colors");
      setNewVals((p) => ({ ...p, color: "" }));
      setTabs((p) => ({ ...p, color: "existing" }));
    });
  };

  const submitNewSize = async () => {
    if (!newVals.size) return notify.error("Enter size name.");
    const fd = new FormData();
    const sizeName = newVals.size.trim();
    if (sel.color) fd.append("color", sel.color.id);
    else if (lists.colors.length > 0) fd.append("color", lists.colors[0].id);
    else fd.append("color", "0");
    fd.append("name", sizeName);
    await addNewItem("/api/structure/size", fd, "Size added.", async () => {
      const res = await requestApi("GET", "/api/structure/size", {});
      if (res.success && Array.isArray(res.data)) {
        setLists((prev) => ({ ...prev, sizes: res.data }));
        if (activeSizeRowId) {
          const created = res.data.find((s) => (s.name || s.size_name || "").toUpperCase() === sizeName.toUpperCase());
          if (created) {
            updateSizeRow(activeSizeRowId, "size_id", created.id, created.name || created.size_name || sizeName);
          }
        }
      }
      setNewVals((p) => ({ ...p, size: "" }));
      setTabs((p) => ({ ...p, size: "existing" }));
    });
  };

  const submitNewOccasion = async () => {
    if (!newVals.occasion) return notify.error("Enter occasion name.");
    const fd = new FormData();
    fd.append("name", newVals.occasion.trim());
    fd.append("size", "0");
    await addNewItem("/api/structure/occasion", fd, "Occasion added.", async () => {
      await fetchList("/api/structure/occasion", "occasions");
      setNewVals((p) => ({ ...p, occasion: "" }));
      setTabs((p) => ({ ...p, occasion: "existing" }));
    });
  };

  const submitNewType = async () => {
    if (!newVals.type) return notify.error("Enter type name.");
    const fd = new FormData();
    fd.append("name", newVals.type.trim());
    fd.append("occasion", "0");
    await addNewItem("/api/structure/type", fd, "Type added.", async () => {
      await fetchList("/api/structure/type", "types");
      setNewVals((p) => ({ ...p, type: "" }));
      setTabs((p) => ({ ...p, type: "existing" }));
    });
  };

  // ─────────────────────────────────────────────────────
  // Delete helpers
  // ─────────────────────────────────────────────────────
  const handleDelete = async (endpoint, id, name, refreshFn) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await requestApi("DELETE", `${endpoint}?id=${id}`, {});
      if (res.success) { notify.success(`"${name}" deleted.`); refreshFn(); }
      else notify.error("Failed to delete.");
    } catch (_) { notify.error("Failed to delete."); }
  };

  // ─────────────────────────────────────────────────────
  // Edit helpers
  // ─────────────────────────────────────────────────────
  const openEdit = (type, id, value) => setEdit({ open: true, type, id, value });
  const closeEditDialog = () => setEdit({ open: false, type: "", id: null, value: "" });

  const handleSaveEdit = async () => {
    const endpointMap = {
      category: "/api/structure/category",
      itemName: "/api/structure/item-name",
      subCategory: "/api/structure/sub-category",
      brand: "/api/structure/brand",
      model: "/api/structure/model",
      color: "/api/structure/color",
      size: "/api/structure/size",
      occasion: "/api/structure/occasion",
      type: "/api/structure/type",
    };
    const refreshMap = {
      category: () => fetchList("/api/structure/category", "categories"),
      itemName: () => fetchList("/api/structure/item-name", "itemNames"),
      subCategory: () => fetchList("/api/structure/sub-category", "subCategories"),
      brand: () => fetchList("/api/structure/brand", "brands"),
      model: () => fetchList("/api/structure/model", "models"),
      color: () => fetchList("/api/structure/color", "colors"),
      size: () => fetchList("/api/structure/size", "sizes"),
      occasion: () => fetchList("/api/structure/occasion", "occasions"),
      type: () => fetchList("/api/structure/type", "types"),
    };
    try {
      const res = await requestApi("PUT", endpointMap[edit.type], { id: edit.id, name: edit.value });
      if (res.success) {
        notify.success("Updated successfully.");
        if (refreshMap[edit.type]) refreshMap[edit.type]();
      } else notify.error("Update failed.");
    } catch (_) { notify.error("Update failed."); }
    closeEditDialog();
  };

  // ─────────────────────────────────────────────────────
  // New-item form builders
  // ─────────────────────────────────────────────────────
  const imageNewForm = (nameKey, imgKey, onSubmit) => (
    <div className="as-new-form">
      <input className="as-new-input" placeholder="Enter name" value={newVals[nameKey]}
        onChange={(e) => setNewVals((p) => ({ ...p, [nameKey]: e.target.value }))} />
      <label className="as-file-input-label">
        <UploadFileOutlinedIcon />
        {newVals[imgKey] ? newVals[imgKey].name : "Upload image (optional)"}
        <input type="file" accept="image/*" className="as-file-input"
          onChange={(e) => setNewVals((p) => ({ ...p, [imgKey]: e.target.files[0] }))} />
      </label>
      <div className="as-dialog-actions">
        <button className="as-btn-primary" onClick={onSubmit}>
          <CheckIcon style={{ fontSize: 16, marginRight: 4 }} /> Add
        </button>
      </div>
    </div>
  );

  const textNewForm = (nameKey, onSubmit) => (
    <div className="as-new-form">
      <input className="as-new-input" placeholder="Enter name" value={newVals[nameKey]}
        onChange={(e) => setNewVals((p) => ({ ...p, [nameKey]: e.target.value }))} />
      <div className="as-dialog-actions">
        <button className="as-btn-primary" onClick={onSubmit}>
          <CheckIcon style={{ fontSize: 16, marginRight: 4 }} /> Add
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  return (
    <div className="addstock-page">
      <Navbar />
      <div className="addstock-content">
        <VerticalNavbar />

        <div className="addstock-main">
          {/* ── Top bar ── */}
          <div className="addstock-topbar">
            <div className="addstock-topbar-left">
              <InventoryIcon style={{ color: "var(--accent)", fontSize: 22 }} />
              <div>
                <div className="addstock-page-title">Add Stock</div>
                <div className="addstock-page-subtitle">Select product details and enter quantities per size</div>
              </div>
            </div>

            {/* Bill number */}
            <div className="addstock-bill-bar">
              <label>S.No / Bill</label>
              <input
                id="bill-number-input"
                className="addstock-bill-input"
                type="number"
                placeholder="1042"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
              />
            </div>
          </div>

          {/* ── Two-column form ── */}
          <div className="addstock-form-area">

            {/* ════════ LEFT COLUMN ════════ */}
            <div className="addstock-left">

              {/* Product Details card */}
              <div className="as-card">
                <div className="as-card-title">
                  <LocalOfferOutlinedIcon /> Product Details
                </div>
                <div className="as-fields-group">

                  {/* Category */}
                  <div className="as-field">
                    <span className="as-field-label">Category</span>
                    <SelectBox value={sel.category?.name} placeholder="Select category"
                      onClick={() => openDialog("category")} />
                  </div>

                  {/* Item Name + Sub-Category */}
                  <div className="as-field-row">
                    <div className="as-field">
                      <span className="as-field-label">Item Name</span>
                      <SelectBox value={sel.itemName?.name} placeholder="Select item"
                        onClick={() => openDialog("itemName")} />
                    </div>
                    <div className="as-field">
                      <span className="as-field-label">Sub-Category</span>
                      <SelectBox value={sel.subCategory?.name} placeholder="Select"
                        onClick={() => openDialog("subCategory")} />
                    </div>
                  </div>

                  {/* Brand + Model */}
                  <div className="as-field-row">
                    <div className="as-field">
                      <span className="as-field-label">Brand</span>
                      <SelectBox value={sel.brand?.name} placeholder="Select brand"
                        onClick={() => openDialog("brand")} />
                    </div>
                    <div className="as-field">
                      <span className="as-field-label">Model</span>
                      <SelectBox value={sel.model?.name} placeholder="Select model"
                        onClick={() => openDialog("model")} />
                    </div>
                  </div>

                  {/* Colour + Occasion */}
                  <div className="as-field-row">
                    <div className="as-field">
                      <span className="as-field-label">Colour</span>
                      <SelectBox value={sel.color?.name} placeholder="Select colour"
                        onClick={() => openDialog("color")} />
                    </div>
                    <div className="as-field">
                      <span className="as-field-label">Occasion <span style={{ fontSize: 10, color: "var(--text-muted)" }}>(optional)</span></span>
                      <SelectBox value={sel.occasion?.name} placeholder="Select"
                        onClick={() => openDialog("occasion")}
                        onClear={() => handleSelect("occasion", null)} />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="as-field">
                    <span className="as-field-label">Type <span style={{ fontSize: 10, color: "var(--text-muted)" }}>(optional)</span></span>
                    <SelectBox value={sel.type?.name} placeholder="Select type (optional)"
                      onClick={() => openDialog("type")}
                      onClear={() => handleSelect("type", null)} />
                  </div>

                </div>
              </div>

              {/* Pricing card */}
              <div className="as-card">
                <div className="as-card-title">
                  <LocalOfferOutlinedIcon /> Pricing
                </div>
                <div className="as-price-grid">
                  <div className="as-price-field">
                    <label>Purchase ₹</label>
                    <input id="purchase-price-input" className={`as-price-input ${pricing.purchase ? "filled" : ""}`}
                      type="number" placeholder="0" value={pricing.purchase}
                      onChange={(e) => setPricing((p) => ({ ...p, purchase: e.target.value }))} />
                  </div>
                  <div className="as-price-field">
                    <label>Selling ₹</label>
                    <input id="selling-price-input" className={`as-price-input ${pricing.selling ? "filled" : ""}`}
                      type="number" placeholder="0" value={pricing.selling}
                      onChange={(e) => handleSellingChange(e.target.value)} />
                  </div>
                  <div className="as-price-field">
                    <label>MRP ₹</label>
                    <input id="mrp-input" className={`as-price-input ${pricing.mrp ? "filled" : ""}`}
                      type="number" placeholder="0" value={pricing.mrp}
                      onChange={(e) => setPricing((p) => ({ ...p, mrp: e.target.value }))} />
                  </div>
                </div>
              </div>

            </div>

            {/* ════════ RIGHT COLUMN ════════ */}
            <div className="addstock-right">

              {/* Sizes & Quantities card */}
              <div className="as-card" style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div className="as-card-title" style={{ margin: 0 }}>
                    <StraightenIcon /> Sizes &amp; Quantities
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSizeRowId(null);
                      setTabs((p) => ({ ...p, size: "new" }));
                      openDialog("size");
                    }}
                    style={{
                      background: "rgba(14, 165, 233, 0.1)",
                      color: "var(--accent)",
                      border: "1px solid rgba(14, 165, 233, 0.25)",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      opacity: 1,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <AddIcon style={{ fontSize: 14 }} /> Create / Manage Sizes
                  </button>
                </div>

                <div className="as-size-table">
                  <div className="as-size-table-head">
                    <span>Size</span>
                    <span style={{ textAlign: "center" }}>Qty</span>
                    <span style={{ textAlign: "center" }}>Remove</span>
                  </div>

                  <div className="as-size-rows">
                    {sizeRows.map((row) => (
                      <div key={row.id} className="as-size-row">
                        {/* Size selector */}
                        <div
                          className={`as-size-select-box ${row.size_id ? "filled" : "placeholder"}`}
                          onClick={() => {
                            setActiveSizeRowId(row.id);
                            openDialog("size");
                          }}
                        >
                          <span className="as-size-select-value">
                            {row.size_name || "Select size…"}
                          </span>
                          <span className="as-select-icons">
                            {row.size_id ? (
                              <CheckCircleOutlineIcon className="check-icon" style={{ fontSize: 16 }} />
                            ) : (
                              <KeyboardArrowDownIcon style={{ fontSize: 16 }} />
                            )}
                          </span>
                        </div>

                        {/* Qty input */}
                        <input
                          className={`as-qty-input ${Number(row.quantity) > 0 ? "has-value" : ""}`}
                          type="number"
                          min="0"
                          placeholder="0"
                          value={row.quantity}
                          onChange={(e) => updateSizeRow(row.id, "quantity", e.target.value)}
                        />

                        {/* Remove */}
                        <button className="as-remove-btn" onClick={() => removeSizeRow(row.id)}
                          title="Remove row" disabled={sizeRows.length === 1}>
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="as-add-size-btn" style={{ flex: 1 }} onClick={addSizeRow}>
                      <AddIcon /> Add Size Row
                    </button>
                  </div>
                </div>
              </div>

              {/* Live summary card */}
              <div className="as-card">
                <div className="as-card-title">
                  <ListAltIcon /> Entry Summary
                </div>
                <div className="as-summary-grid">
                  <div className="as-summary-item">
                    <div className="as-summary-label">Category</div>
                    <div className={`as-summary-value ${!sel.category ? "empty" : ""}`}>{sel.category?.name || "—"}</div>
                  </div>
                  <div className="as-summary-item">
                    <div className="as-summary-label">Brand · Model</div>
                    <div className={`as-summary-value ${!sel.brand ? "empty" : ""}`}>
                      {sel.brand && sel.model ? `${sel.brand.name} · ${sel.model.name}` : "—"}
                    </div>
                  </div>
                  <div className="as-summary-item">
                    <div className="as-summary-label">Item · Sub</div>
                    <div className={`as-summary-value ${!sel.itemName ? "empty" : ""}`}>
                      {sel.itemName && sel.subCategory ? `${sel.itemName.name} · ${sel.subCategory.name}` : "—"}
                    </div>
                  </div>
                  <div className="as-summary-item">
                    <div className="as-summary-label">Colour</div>
                    <div className={`as-summary-value ${!sel.color ? "empty" : ""}`}>{sel.color?.name || "—"}</div>
                  </div>
                  <div className="as-summary-item">
                    <div className="as-summary-label">Total Qty</div>
                    <div className={`as-summary-value ${totalQty > 0 ? "highlight" : "empty"}`}>
                      {totalQty > 0 ? `${totalQty} pcs` : "—"}
                    </div>
                  </div>
                  <div className="as-summary-item">
                    <div className="as-summary-label">Total Value</div>
                    <div className={`as-summary-value ${totalValue > 0 ? "highlight" : "empty"}`}>
                      {totalValue > 0 ? `₹${totalValue.toLocaleString()}` : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="as-submit-area">
                <button className="as-btn-reset" onClick={handleReset}>
                  <RefreshIcon /> Reset
                </button>
                <button id="add-stock-submit-btn" className="as-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                  <CheckIcon /> {isSubmitting ? "Adding..." : "Add to Stock"}
                </button>
              </div>

              {/* Recent additions */}
              <div className="as-card">
                <div className="as-card-title">
                  <ListAltIcon /> Recently Added (This Session)
                </div>
                <div className="as-recent-list">
                  {recentList.length === 0 ? (
                    <div className="as-recent-empty">No entries yet this session</div>
                  ) : (
                    recentList.map((item, idx) => (
                      <div key={item.id} className="as-recent-item">
                        <div className="as-recent-badge">#{idx + 1}</div>
                        <div className="as-recent-info">
                          <div className="as-recent-name">{item.name}</div>
                          <div className="as-recent-sub">{item.sub}</div>
                        </div>
                        <div className="as-recent-price">{item.price}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ════════ PICKER DIALOGS ════════ */}

      {/* Category */}
      <PickerDialog open={dialogs.category} onClose={() => closeDialog("category")}
        title="Category" items={lists.categories} selectedId={sel.category?.id}
        onSelect={(v) => handleSelect("category", v)}
        tab={tabs.category} setTab={(t) => setTabs((p) => ({ ...p, category: t }))}
        newForm={imageNewForm("category", "categoryImg", submitNewCategory)}
        onEdit={(item) => openEdit("category", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/category", id, name,
          () => fetchList("/api/structure/category", "categories"))} />

      {/* Item Name */}
      <PickerDialog open={dialogs.itemName} onClose={() => closeDialog("itemName")}
        title="Item Name" items={lists.itemNames} selectedId={sel.itemName?.id}
        onSelect={(v) => handleSelect("itemName", v)}
        tab={tabs.itemName} setTab={(t) => setTabs((p) => ({ ...p, itemName: t }))}
        newForm={imageNewForm("itemName", "itemImg", submitNewItemName)}
        onEdit={(item) => openEdit("itemName", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/item-name", id, name,
          () => fetchList("/api/structure/item-name", "itemNames"))} />

      {/* Sub-Category */}
      <PickerDialog open={dialogs.subCategory} onClose={() => closeDialog("subCategory")}
        title="Sub-Category" items={lists.subCategories} selectedId={sel.subCategory?.id}
        onSelect={(v) => handleSelect("subCategory", v)}
        tab={tabs.subCategory} setTab={(t) => setTabs((p) => ({ ...p, subCategory: t }))}
        newForm={imageNewForm("subCategory", "subImg", submitNewSubCategory)}
        onEdit={(item) => openEdit("subCategory", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/sub-category", id, name,
          () => fetchList("/api/structure/sub-category", "subCategories"))} />

      {/* Brand */}
      <PickerDialog open={dialogs.brand} onClose={() => closeDialog("brand")}
        title="Brand" items={lists.brands} selectedId={sel.brand?.id}
        onSelect={(v) => handleSelect("brand", v)}
        tab={tabs.brand} setTab={(t) => setTabs((p) => ({ ...p, brand: t }))}
        newForm={imageNewForm("brand", "brandImg", submitNewBrand)}
        onEdit={(item) => openEdit("brand", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/brand", id, name,
          () => fetchList("/api/structure/brand", "brands"))} />

      {/* Model */}
      <PickerDialog open={dialogs.model} onClose={() => closeDialog("model")}
        title="Model" items={lists.models} selectedId={sel.model?.id}
        onSelect={(v) => handleSelect("model", v)}
        tab={tabs.model} setTab={(t) => setTabs((p) => ({ ...p, model: t }))}
        newForm={textNewForm("model", submitNewModel)}
        onEdit={(item) => openEdit("model", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/model", id, name,
          () => fetchList("/api/structure/model", "models"))} />

      {/* Colour */}
      <PickerDialog open={dialogs.color} onClose={() => closeDialog("color")}
        title="Colour" items={lists.colors} selectedId={sel.color?.id}
        onSelect={(v) => handleSelect("color", v)}
        tab={tabs.color} setTab={(t) => setTabs((p) => ({ ...p, color: t }))}
        newForm={textNewForm("color", submitNewColor)}
        onEdit={(item) => openEdit("color", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/color", id, name,
          () => fetchList("/api/structure/color", "colors"))} />

      {/* Size */}
      <PickerDialog open={dialogs.size} onClose={() => closeDialog("size")}
        title="Size" items={lists.sizes}
        selectedId={activeSizeRowId ? sizeRows.find(r => r.id === activeSizeRowId)?.size_id : null}
        onSelect={(v) => {
          if (v && activeSizeRowId) {
            updateSizeRow(activeSizeRowId, "size_id", v.id, v.name || v.size_name || "");
          }
        }}
        tab={tabs.size} setTab={(t) => setTabs((p) => ({ ...p, size: t }))}
        newForm={textNewForm("size", submitNewSize)}
        onEdit={(item) => openEdit("size", item.id, item.name || item.size_name)}
        onDelete={(id, name) => handleDelete("/api/structure/size", id, name,
          () => fetchList("/api/structure/size", "sizes"))} />

      {/* Occasion */}
      <PickerDialog open={dialogs.occasion} onClose={() => closeDialog("occasion")}
        title="Occasion" items={lists.occasions} selectedId={sel.occasion?.id}
        onSelect={(v) => handleSelect("occasion", v)}
        allowClear={true}
        tab={tabs.occasion} setTab={(t) => setTabs((p) => ({ ...p, occasion: t }))}
        newForm={textNewForm("occasion", submitNewOccasion)}
        onEdit={(item) => openEdit("occasion", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/occasion", id, name,
          () => fetchList("/api/structure/occasion", "occasions"))} />

      {/* Type */}
      <PickerDialog open={dialogs.type} onClose={() => closeDialog("type")}
        title="Type" items={lists.types} selectedId={sel.type?.id}
        onSelect={(v) => handleSelect("type", v)}
        allowClear={true}
        tab={tabs.type} setTab={(t) => setTabs((p) => ({ ...p, type: t }))}
        newForm={textNewForm("type", submitNewType)}
        onEdit={(item) => openEdit("type", item.id, item.name)}
        onDelete={(id, name) => handleDelete("/api/structure/type", id, name,
          () => fetchList("/api/structure/type", "types"))} />

      {/* Edit dialog */}
      <EditDialog open={edit.open} onClose={closeEditDialog}
        title={edit.type} value={edit.value}
        onChange={(e) => setEdit((p) => ({ ...p, value: e.target.value }))}
        onSave={handleSaveEdit} />

      <ToastContainer />
    </div>
  );
}
