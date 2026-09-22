import React, { useState } from "react";
import * as XLSX from "xlsx";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import requestApi from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import "../export_data/export.css";

const ImportData = ({ isEmbedded = false }) => {
  const [jsonData, setJsonData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const parsedData = rawJson.slice(1); // skip header row
        const filteredData = parsedData.filter(
          (row) => Array.isArray(row) && row.some((cell) => cell !== "" && cell !== undefined)
        );

        const formattedData = filteredData.map((row) => ({
          category: String(row[0] || "").trim(),
          sub_category: String(row[1] || "").trim(),
          brand: String(row[2] || "").trim(),
          size: String(row[3] || "").trim(),
          model: String(row[4] || "").trim(),
          color: String(row[5] || "").trim(),
          item_name: String(row[6] || row[7] || "").trim(),
          sell_quantity: parseFloat(row[8] || row[10]) || 0,
          mrp: parseFloat(row[9] || row[22]) || 0,
        }));

        setJsonData(formattedData);
        toast.info(`Loaded ${formattedData.length} records from ${file.name}`);
      } catch (err) {
        console.error("Error reading excel file:", err);
        toast.error("Failed to parse Excel file. Please verify format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToBackend = async () => {
    if (!jsonData.length) {
      toast.warning("Please choose an Excel file first.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await requestApi("POST", "/api/sales/sales", jsonData);
      if (response.success) {
        toast.success(`Successfully imported ${jsonData.length} sales records!`);
        setJsonData([]);
        setFileName("");
      } else {
        toast.error("Failed to import sales data to server.");
      }
    } catch (err) {
      console.error("Error importing sales:", err);
      toast.error("Failed to upload sales data.");
    } finally {
      setIsUploading(false);
    }
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {/* File Drop Label */}
      <label className="io-file-drop" htmlFor="excel-file-input">
        <CloudUploadOutlinedIcon style={{ fontSize: 44, color: "#10b981" }} />
        <p>{fileName ? fileName : "Click to browse Excel file (.xlsx, .xls)"}</p>
        <span>
          {jsonData.length > 0
            ? `${jsonData.length} rows ready to import`
            : "Supports exported sales spreadsheets"}
        </span>
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </label>

      {jsonData.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
          <CheckCircleOutlineIcon fontSize="small" />
          <span>Ready: {jsonData.length} rows recognized</span>
        </div>
      )}

      <button
        type="button"
        className="io-btn import"
        onClick={sendDataToBackend}
        disabled={isUploading || jsonData.length === 0}
      >
        <FileUploadOutlinedIcon />
        {isUploading ? "Uploading Sales Data..." : "Upload & Apply Sales Records"}
      </button>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <ToastContainer />
        <div className="dashboard-body">
          <div className="io-hub">
            <div className="io-header">
              <h1>Import Sales Records</h1>
              <p>Upload sold stock records from external spreadsheets</p>
            </div>
            <div className="io-card" style={{ maxWidth: 600 }}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
