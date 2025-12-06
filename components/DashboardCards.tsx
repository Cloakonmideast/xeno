type Props = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function DashboardCards({ totalCustomers, totalOrders, totalRevenue }: Props) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "24px",
    marginBottom: "32px",
  };

  const cardStyle: React.CSSProperties = {
    flex: 1,
    background: "#151820",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #252830",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "0.25s ease",
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "0.6px",
    color: "#8b95a5",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    marginTop: "10px",
    letterSpacing: "-0.4px",
  };

  const formatValue = (val: any) => {
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...cardStyle,
          borderTop: "4px solid #3b82f6",
        }}
      >
        <span style={labelStyle}>Customers</span>
        <span style={{ ...valueStyle, color: "#3b82f6" }}>
          {formatValue(totalCustomers)}
        </span>
      </div>

      <div
        style={{
          ...cardStyle,
          borderTop: "4px solid #22c55e",
        }}
      >
        <span style={labelStyle}>Orders</span>
        <span style={{ ...valueStyle, color: "#22c55e" }}>
          {formatValue(totalOrders)}
        </span>
      </div>

      <div
        style={{
          ...cardStyle,
          borderTop: "4px solid #fbbf24",
        }}
      >
        <span style={labelStyle}>Revenue</span>
        <span style={{ ...valueStyle, color: "#fbbf24" }}>
          ${formatValue(totalRevenue)}
        </span>
      </div>
    </div>
  );
}
