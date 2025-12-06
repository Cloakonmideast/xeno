"use client";
export default function TopCustomersTable({ customers }) {
  const containerStyle: React.CSSProperties = {
    background: "#151820",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid #252830",
    color: "#E5E7EB",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0px 0px 16px rgba(0,255,180,0.05)",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    marginBottom: "16px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "-0.5px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const headerCellStyle: React.CSSProperties = {
    padding: "10px 8px",
    borderBottom: "1px solid #323741",
    fontWeight: 500,
    color: "#9CA3AF",
    textAlign: "left",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.6px",
  };

  const rowStyle: React.CSSProperties = {
    transition: "0.2s ease",
  };

  const rowHoverStyle: React.CSSProperties = {
    background: "#1b1f28",
    cursor: "pointer",
  };

  const cellStyle: React.CSSProperties = {
    padding: "10px 8px",
    borderBottom: "1px solid #252830",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🏆 Top Customers</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Email</th>
            <th style={{ ...headerCellStyle, textAlign: "right" }}>Spent</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                No customer data available.
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr
                key={c.id}
                style={rowStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, rowHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, rowStyle)}
              >
                <td style={cellStyle}>{c.firstName} {c.lastName}</td>
                <td style={cellStyle}>{c.email}</td>
                <td style={{ ...cellStyle, textAlign: "right", color: "#10B981", fontWeight: 600 }}>
                  ${Number(c.spent).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
