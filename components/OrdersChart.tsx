"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type Row = {
  day: string | Date;
  orders_count: number;
  revenue: number;
};

export default function OrdersChart({ data }: { data: Row[] }) {
  const labels = data.map((d) => new Date(d.day).toLocaleDateString());
  const orders = data.map((d) => d.orders_count);
  const revenue = data.map((d) => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: orders,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.3
      },
      {
        label: "Revenue",
        data: revenue,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3
      }
    ]
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #ddd"
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Orders & Revenue (Last 30 Days)</h3>
      <Line data={chartData} />
    </div>
  );
}
