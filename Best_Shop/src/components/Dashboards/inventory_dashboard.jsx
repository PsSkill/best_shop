import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import requestApi from "../../utils/axios";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

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
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--text)",
  }),
};

export default function InventoryDashboard() {
  const [chartData, setChartData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await requestApi("GET", "/api/structure/category");
        if (response.success && Array.isArray(response.data)) {
          const options = response.data.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }));
          setCategoryOptions(options);
          if (options.length > 0) {
            setSelectedCategoryId(options[0].value);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await requestApi(
          "GET",
          `/api/stock/sales-dashboard?category=${selectedCategoryId}`
        );
        if (response.success) {
          setChartData(response.data);
        }
      } catch (error) {
        console.error("Error fetching category chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategoryId]);

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption) setSelectedCategoryId(selectedOption.value);
  };

  const itemNames = chartData?.item_names || [];
  const totalQuantities = chartData?.total_quantities || [];
  const availableQuantities = chartData?.available_quantity || [];
  const hasData = itemNames.length > 0;

  const currentSelection = categoryOptions.find(
    (opt) => opt.value === selectedCategoryId
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Category Filter Selector */}
      <div className="analytics-filters-bar">
        <div className="analytics-filter-item">
          <label className="analytics-filter-label">
            <BarChartOutlinedIcon style={{ fontSize: 18, color: "#0ea5e9" }} />
            Category
          </label>
          <div className="analytics-select-wrapper">
            <Select
              options={categoryOptions}
              onChange={handleCategoryChange}
              value={currentSelection}
              placeholder="Choose product category..."
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      {/* Chart or Empty State */}
      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
          Loading category stock analysis...
        </div>
      ) : !hasData ? (
        <div className="inventory-empty">
          <BarChartOutlinedIcon style={{ fontSize: 48, opacity: 0.5 }} />
          <h3>No Stock Records in this Category</h3>
          <p>This category does not have any items added yet.</p>
        </div>
      ) : (
        <div style={{ width: "100%", minHeight: 400 }}>
          <ReactApexChart
            height={420}
            width="100%"
            type="bar"
            series={[
              { name: "Available Quantity", data: availableQuantities },
              { name: "Total Quantity", data: totalQuantities },
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
                      filename: `${currentSelection?.label || "category"}-inventory-data`,
                      headerCategory: "Item Name",
                    },
                    svg: {
                      filename: `${currentSelection?.label || "category"}-inventory-chart`,
                    },
                    png: {
                      filename: `${currentSelection?.label || "category"}-inventory-chart`,
                    },
                  },
                },
                fontFamily: "Inter, sans-serif",
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "45%",
                  borderRadius: 6,
                },
              },
              colors: ["#10b981", "#0ea5e9"],
              dataLabels: { enabled: false },
              stroke: { show: true, width: 2, colors: ["transparent"] },
              xaxis: {
                categories: itemNames,
                labels: {
                  style: { colors: "var(--text)", fontSize: "12px", fontWeight: 500 },
                },
              },
              yaxis: {
                labels: {
                  style: { colors: "var(--text)", fontSize: "12px" },
                },
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
      )}
    </div>
  );
}
