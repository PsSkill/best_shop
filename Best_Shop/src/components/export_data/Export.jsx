import React, { useState, useEffect } from "react";
import HorizontalNavbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import requestApi from "../../utils/axios";
import Select from "react-select";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import dayjs from "dayjs";
import ImportData from "../import_data/import";
import "./export.css";

const ExportData = () => {
  const [bill, setBill] = useState("");
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { success, data } = await requestApi(
          "GET",
          "/api/master/shop-location"
        );
        if (success && Array.isArray(data)) {
          const options = data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setLocation(options);
          if (options.length > 0) {
            setSelectedLocation(options[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching shop locations:", err);
      }
    };

    fetchLocations();
  }, []);

  const handleDownload = async () => {
    if (!selectedLocation) {
      toast.warning("Please select a shop location");
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        date: selectedDate.format("YYYY-MM-DD"),
        shop_location: selectedLocation.value,
      });

      if (bill.trim()) {
        queryParams.append("bill_number", bill.trim());
      }

      const { success, data } = await requestApi(
        "GET",
        `/api/stock/export-csv?${queryParams}`
      );

      if (success && Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: "text/csv" });
        const urlPath = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = urlPath;
        let fileName = `Stock_${selectedLocation.label}_${selectedDate.format("YYYY-MM-DD")}`;
        if (bill.trim()) {
          fileName += `_Bill_${bill.trim()}`;
        }
        fileName += ".csv";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel/CSV downloaded successfully!");
      } else {
        toast.info("No stock records found for the selected shop and date.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export stock file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <HorizontalNavbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <ToastContainer />
        <div className="dashboard-body">
          <div className="io-hub">
            <div className="io-header">
              <h1>Import &amp; Export Data</h1>
              <p>Download Excel backups of inventory or import sold stock spreadsheets</p>
            </div>

            <div className="io-grid">
              {/* Card 1: Export Stock */}
              <div className="io-card">
                <div className="io-card-header">
                  <div className="io-card-icon export">
                    <FileDownloadOutlinedIcon style={{ fontSize: 28 }} />
                  </div>
                  <div className="io-card-title">
                    <h3>Export Stock Spreadsheet</h3>
                    <p>Download CSV/Excel file of incoming inventory</p>
                  </div>
                </div>

                <div className="io-form-group">
                  <label>
                    <StorefrontOutlinedIcon style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }} />
                    Shop Location
                  </label>
                  <Select
                    value={selectedLocation}
                    onChange={(val) => setSelectedLocation(val)}
                    options={location}
                    placeholder="Select Shop..."
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: 8,
                        padding: "2px",
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "var(--text)",
                        fontWeight: 600,
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        zIndex: 30,
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                          ? "var(--surface-hover, rgba(14,165,233,0.1))"
                          : "var(--surface)",
                        color: "var(--text)",
                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>

                <div className="io-form-group">
                  <label>
                    <CalendarMonthOutlinedIcon style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }} />
                    Record Date
                  </label>
                  <input
                    type="date"
                    className="io-form-input"
                    value={selectedDate.format("YYYY-MM-DD")}
                    onChange={(e) => {
                      if (e.target.value) setSelectedDate(dayjs(e.target.value));
                    }}
                  />
                </div>

                <div className="io-form-group">
                  <label>
                    <ReceiptLongOutlinedIcon style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }} />
                    Bill Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="io-form-input"
                    placeholder="Leave empty for all bills..."
                    value={bill}
                    onChange={(e) => setBill(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="io-btn export"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  <FileDownloadOutlinedIcon />
                  {isLoading ? "Preparing Download..." : "Download Stock Spreadsheet"}
                </button>
              </div>

              {/* Card 2: Import Sold Stock */}
              <div className="io-card">
                <div className="io-card-header">
                  <div className="io-card-icon import">
                    <FileUploadOutlinedIcon style={{ fontSize: 28 }} />
                  </div>
                  <div className="io-card-title">
                    <h3>Import Sales Data</h3>
                    <p>Upload sold stock records from Excel</p>
                  </div>
                </div>

                <ImportData isEmbedded={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;