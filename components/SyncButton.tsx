"use client";

export default function SyncButton({ tenantId, shopDomain, privateToken }: any) {
  async function triggerSync() {
    try {
      const res = await fetch("/api/shopify/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId, shopDomain, privateToken }),
      });

      const data = await res.json();
      alert(data.message || "Synced!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Sync failed");
    }
  }

  return (
    <button
      onClick={triggerSync}
      style={{
        padding: "10px 20px",
        background: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "20px"
      }}
    >
      Sync Now 🔄
    </button>
  );
}
