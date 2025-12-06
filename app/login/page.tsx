"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    router.push("/dashboard");
  }

  const containerStyle = {
    width: "100%",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
  };

  const labelStyle = { fontSize: "14px", fontWeight: "bold" };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "4px",
    marginBottom: "12px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#0070f3",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  };

  const errorStyle = { color: "red", fontSize: "13px" };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <form onSubmit={onSubmit}>
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={labelStyle}>Password</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={errorStyle}>{error}</p>}

        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
