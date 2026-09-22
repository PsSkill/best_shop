import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "../Stock_Dashboard/stock_dashboard.css";
import requestApi from "../../utils/axios";

const StockDashboard = () => {
  const [chartData, setChartData] = useState({
    series: [
      { name: "Product Count (Qty)", data: [0, 0, 0] },
      { name: "Total Value (₹)", data: [0, 0, 0] },
      { name: "Avg Rate (₹)", data: [0, 0, 0] },
    ],

    options: {
      chart: {
        type: "bar",
        height: 380,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        fontFamily: "'Inter', sans-serif",
        background: "transparent",
      },
      colors: ["#0ea5e9", "#10b981", "#f59e0b"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "48%",
          borderRadius: 6,
          borderRadiusApplication: "end",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          if (!val || val === 0) return "";
          if (opt && opt.seriesIndex === 0) return val + " pcs";
          return "₹" + Number(val).toLocaleString("en-IN");
        },
        offsetY: -22,
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
        categories: ["Less Than 30 Days", "30 to 180 Days", "180 to 365 Days"],
        labels: {
          style: {
            colors: "var(--text-muted, #718096)",
            fontSize: "12px",
            fontWeight: 600,
          },
        },
        axisBorder: {
          show: true,
          color: "var(--border)",
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: [
        {
          seriesName: "Product Count (Qty)",
          title: {
            text: "Quantity (pcs)",
            style: { color: "#0ea5e9", fontSize: "12px", fontWeight: 600 },
          },
          labels: {
            formatter: (val) => Math.round(val),
            style: { colors: "var(--text-muted, #718096)" },
          },
        },
        {
          seriesName: "Total Value (₹)",
          opposite: true,
          title: {
            text: "Total Value / Rate (₹)",
            style: { color: "#10b981", fontSize: "12px", fontWeight: 600 },
          },
          labels: {
            formatter: (val) => "₹" + Math.round(val).toLocaleString("en-IN"),
            style: { colors: "var(--text-muted, #718096)" },
          },
        },
        {
          seriesName: "Total Value (₹)",
          show: false,
        },
      ],
      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: function (val, opt) {
            if (opt && opt.seriesIndex === 0) return Number(val) + " pcs";
            return "₹" + Number(val).toLocaleString("en-IN");
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 8,
        offsetY: 4,
        fontSize: "13px",
        fontWeight: 600,
        labels: {
          colors: "var(--text)",
        },
        markers: {
          radius: 4,
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestApi("GET", "/api/stock/dashboard-data");

        if (!response || !response.success) {
          throw new Error("Failed to fetch data");
        }

        const apiData = response.data;

        const seriesData = {
          total_quantity: [],
          total_price: [],
          rate_of_product: [],
        };

        apiData.forEach((item) => {
          seriesData.total_quantity.push(parseFloat(item.total_quantity) || 0);
          seriesData.total_price.push(parseFloat(item.total_price) || 0);
          seriesData.rate_of_product.push(parseFloat(item.rate_of_product) || 0);
        });

        const updatedSeries = [
          { name: "Product Count (Qty)", data: seriesData.total_quantity },
          { name: "Total Value (₹)", data: seriesData.total_price },
          { name: "Avg Rate (₹)", data: seriesData.rate_of_product },
        ];
        setChartData((prevChartData) => ({
          ...prevChartData,
          series: updatedSeries,
        }));
      } catch (error) {
        console.error("Error loading stock dashboard chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 390 }}>
      <ReactApexChart
        height={380}
        width="100%"
        options={chartData.options}
        series={chartData.series}
        type="bar"
      />
    </div>
  );
};

export default StockDashboard;