"use client";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsChartsProps {
  revenueData: { date: string; amount: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; sales: number }[];
}

const CHART_COLORS = {
  sand: "#c8965a",
  oasis: "#2d7a6b",
  clay: "#3d2b1f",
  desert: "#f5e6c8",
  amber: "#d97706",
  red: "#dc2626",
  blue: "#2563eb",
};

export function AnalyticsCharts({
  revenueData,
  ordersByStatus,
  topProducts,
}: AnalyticsChartsProps) {
  const lineData = {
    labels: revenueData.map((d) => d.date),
    datasets: [
      {
        label: "Revenue (DZD)",
        data: revenueData.map((d) => d.amount),
        borderColor: CHART_COLORS.sand,
        backgroundColor: "rgba(200,150,90,0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.sand,
        pointRadius: 4,
      },
    ],
  };

  const statusColors: Record<string, string> = {
    PENDING: CHART_COLORS.amber,
    CONFIRMED: CHART_COLORS.blue,
    PROCESSING: "#7c3aed",
    SHIPPED: CHART_COLORS.oasis,
    DELIVERED: "#16a34a",
    CANCELLED: CHART_COLORS.red,
    REFUNDED: "#64748b",
  };

  const doughnutData = {
    labels: ordersByStatus.map((s) => s.status),
    datasets: [
      {
        data: ordersByStatus.map((s) => s.count),
        backgroundColor: ordersByStatus.map((s) => statusColors[s.status] || "#94a3b8"),
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: topProducts.map((p) => p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name),
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.map((p) => p.sales),
        backgroundColor: CHART_COLORS.oasis,
        borderRadius: 8,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#6b4c3b" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b4c3b", maxRotation: 45 },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#3d2b1f", padding: 16, font: { size: 11 } },
      },
    },
    cutout: "65%",
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y" as const,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#6b4c3b" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#6b4c3b", font: { size: 11 } },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Line Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-desert-200 p-6">
        <h3 className="font-semibold text-clay-800 mb-5">Revenue Over Time</h3>
        {revenueData.length > 0 ? (
          <Line data={lineData} options={lineOptions} />
        ) : (
          <div className="flex items-center justify-center h-48 text-clay-300">
            <p className="text-sm">No revenue data yet</p>
          </div>
        )}
      </div>

      {/* Orders by Status Doughnut */}
      <div className="bg-white rounded-2xl border border-desert-200 p-6">
        <h3 className="font-semibold text-clay-800 mb-5">Orders by Status</h3>
        {ordersByStatus.length > 0 ? (
          <Doughnut data={doughnutData} options={doughnutOptions} />
        ) : (
          <div className="flex items-center justify-center h-48 text-clay-300">
            <p className="text-sm">No orders yet</p>
          </div>
        )}
      </div>

      {/* Top Products Bar Chart */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-desert-200 p-6">
        <h3 className="font-semibold text-clay-800 mb-5">Top Products by Sales</h3>
        {topProducts.length > 0 ? (
          <Bar data={barData} options={barOptions} />
        ) : (
          <div className="flex items-center justify-center h-48 text-clay-300">
            <p className="text-sm">No sales data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
