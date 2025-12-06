"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import DashboardCards from "@/components/DashboardCards";
import OrdersChart from "@/components/OrdersChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import StoreConnectForm from "@/components/StoreConnectForm";
import SyncButton from "../../components/SyncButton";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const tenantUser = await prisma.tenantUser.findFirst({
    where: { userId: user.id },
    include: { tenant: true },
  });

  // --- If No Store Connected ---
  if (!tenantUser) {
    return (
      <main
        style={{
          background: "#0f1115",
          minHeight: "100vh",
          paddingTop: "90px",
          display: "flex",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: "420px",
            background: "#151820",
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #2a2d33",
            textAlign: "center",
            boxShadow: "0px 0px 18px rgba(0,255,180,0.08)",
          }}
        >
          <h2
            style={{
              color: "#E5E7EB",
              fontSize: "22px",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            Connect Your Shopify Store
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              lineHeight: "1.6",
              marginBottom: "24px",
            }}
          >
            Begin syncing orders, revenue metrics & customer performance analytics.
          </p>

          <StoreConnectForm />
        </div>
      </main>
    );
  }

  const tenantId = tenantUser.tenantId;

  // --- Summary Stats ---
  const [summary] = await prisma.$queryRawUnsafe(`
      SELECT
        (SELECT COUNT(*) FROM "Customer" WHERE "tenantId" = '${tenantId}') AS total_customers,
        (SELECT COUNT(*) FROM "Order" WHERE "tenantId" = '${tenantId}') AS total_orders,
        (SELECT COALESCE(SUM("totalPrice"), 0) FROM "Order" WHERE "tenantId" = '${tenantId}') AS total_revenue
  `);

  // Ensure numeric conversion
  const safeSummary = {
    totalCustomers: Number(summary.total_customers),
    totalOrders: Number(summary.total_orders),
    totalRevenue: Number(summary.total_revenue),
  };

  // --- Chart Data ---
  const chartData = await prisma.$queryRawUnsafe(`
      SELECT 
        to_char("processedAt", 'YYYY-MM-DD') AS day,
        COUNT(*) AS orders_count,
        SUM("totalPrice") AS revenue
      FROM "Order"
      WHERE 
        "tenantId" = '${tenantId}' AND "processedAt" IS NOT NULL
      GROUP BY day
      ORDER BY day ASC;
  `);

  const safeChartData = chartData.map((row: any) => ({
    day: row.day,
    orders_count: Number(row.orders_count),
    revenue: Number(row.revenue),
  }));

  // --- Top Customers ---
  const topCustomers = await prisma.$queryRawUnsafe(`
      SELECT 
        c.id,
        c."firstName",
        c."lastName",
        c.email,
        SUM(o."totalPrice") AS spent
      FROM "Customer" c
      LEFT JOIN "Order" o ON o."customerId" = c.id
      WHERE c."tenantId" = '${tenantId}'
      GROUP BY c.id, c."firstName", c."lastName", c.email
      ORDER BY spent DESC
      LIMIT 5;
  `);

  const safeCustomers = topCustomers.map((c: any) => ({
    ...c,
    spent: Number(c.spent),
  }));

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        background: "#0f1115",
        minHeight: "100vh",
        color: "#E5E7EB",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "36px",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            margin: 0,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          📊 Xeno Dashboard
        </h1>

        <SyncButton
          tenantId={tenantId}
          shopDomain={tenantUser.tenant.shopDomain}
          privateToken={tenantUser.tenant.privateToken}
        />
      </div>

      {/* Cards */}
      <DashboardCards {...safeSummary} />

      {/* Chart + Table */}
      <div style={{ display: "flex", gap: "28px", marginTop: "40px" }}>
        <div style={{ flex: 2 }}>
          <OrdersChart data={safeChartData} />
        </div>
        <div style={{ flex: 1 }}>
          <TopCustomersTable customers={safeCustomers} />
        </div>
      </div>
    </main>
  );
}
