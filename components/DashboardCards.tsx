type Props = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function DashboardCards({
  totalCustomers,
  totalOrders,
  totalRevenue
}: Props) {
  const cardStyle: React.CSSProperties = {
    flex: 1,
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "center"
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "8px"
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div style={cardStyle}>
        <div>Customers</div>
        <div style={valueStyle}>{totalCustomers}</div>
      </div>
      <div style={cardStyle}>
        <div>Orders</div>
        <div style={valueStyle}>{totalOrders}</div>
      </div>
      <div style={cardStyle}>
        <div>Total Revenue</div>
        <div style={valueStyle}>${totalRevenue.toFixed(2)}</div>
      </div>
    </div>
  );
}
