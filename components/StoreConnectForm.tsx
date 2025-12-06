"use client";

import { useState } from "react";

export default function StoreConnectForm() {
  const [shop, setShop] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/shopify/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop, token })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // success → go to dashboard
    window.location.reload();
  }

  return (
    <form
      onSubmit={submit}
      style={{ 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        maxWidth: "400px",
        margin: "0 auto"
      }}
    >
      <input
        style={{ padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        placeholder="mystore.myshopify.com"
        value={shop}
        onChange={(e) => setShop(e.target.value)}
        required
      />

      <input
        style={{ padding: "12px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        placeholder="shpat_xxxxxxxxxxxxx"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 20px",
          borderRadius: "6px",
          background: "#0070f3",
          color: "white",
          fontSize: "16px",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Connecting..." : "Save Store"}
      </button>
    </form>
  );
}
