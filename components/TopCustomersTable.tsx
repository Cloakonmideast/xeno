export default function TopCustomersTable({ customers }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #ddd",
    }}>
      <h3 style={{ marginBottom: "10px" }}>Top Customers</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Spent</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td style={{ padding: "8px" }}>{c.firstName} {c.lastName}</td>
              <td style={{ padding: "8px" }}>{c.email}</td>
              <td style={{ padding: "8px" }}>${Number(c.spent).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
