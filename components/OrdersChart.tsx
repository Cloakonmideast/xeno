"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function OrdersChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "32px",
          textAlign: "center",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
          color: "#6b7280"
        }}
      >
        📊 No chart data yet — sync your Shopify store to see trends.
      </div>
    );
  }

  const formattedData = data.map((row: any) => ({
    date: new Date(row.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    }),
    orders: Number(row.orders_count),
    revenue: Number(row.revenue)
  }));

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827"
          }}
        >
          📈 Sales Performance
        </h3>
        <span
          style={{
            background: "#f3f4f6",
            fontSize: "12px",
            padding: "6px 10px",
            borderRadius: "6px",
            color: "#4b5563"
          }}
        >
          Last 30 days
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            style={{ fontSize: "12px", color: "#6b7280" }}
          />
          <YAxis style={{ fontSize: "12px", color: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px"
            }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
