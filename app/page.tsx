export default function HomePage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Shopify Analytics SaaS
      </h1>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        Connect your Shopify Store and view customers, orders and revenue at a
        glance.
      </p>

      <a
        href="/login"
        style={{
          padding: "12px 20px",
          borderRadius: "6px",
          background: "#0070f3",
          color: "white",
          textDecoration: "none",
          fontSize: "16px",
          marginRight: "10px"
        }}
      >
        Login
      </a>

      <a
        href="/register"
        style={{
          padding: "12px 20px",
          borderRadius: "6px",
          background: "#28a745",
          color: "white",
          textDecoration: "none",
          fontSize: "16px"
        }}
      >
        Register
      </a>

      <p style={{ marginTop: "30px", fontSize: "14px", opacity: 0.7 }}>
        Once connected, we’ll sync customers, orders & revenue from your Shopify
        dev store.
      </p>
    </main>
  );
}
