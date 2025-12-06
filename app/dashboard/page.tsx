"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import DashboardCards from "@/components/DashboardCards";
import OrdersChart from "@/components/OrdersChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import StoreConnectForm from "@/components/StoreConnectForm";
import SyncButton from "../../components/SyncButton"; // <-- Client component

export default async function DashboardPage() {
  // 1) Ensure user is authenticated
  const user = await requireUser();
  if (!user) redirect("/login");

  // 2) Lookup store connection
  const tenantUser = await prisma.tenantUser.findFirst({
    where: { userId: user.id },
    include: { tenant: true }
  });

  // If no store connected — show setup UI
  if (!tenantUser) {
    return (
      <main
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
          No Shopify Store Connected
        </h2>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Connect a Shopify store to start syncing customers, orders, and products.
        </p>

        <StoreConnectForm />
      </main>
    );
  }

  const tenantId = tenantUser.tenantId;

  // 3) Summary Stats
  const [summary] = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*) FROM "Customer" WHERE "tenantId" = '${tenantId}') AS total_customers,
      (SELECT COUNT(*) FROM "Order" WHERE "tenantId" = '${tenantId}') AS total_orders,
      (SELECT COALESCE(SUM("totalPrice"), 0) FROM "Order" WHERE "tenantId" = '${tenantId}') AS total_revenue
  `);

  // 4) Chart Data
  const chartData = await prisma.$queryRawUnsafe(`
    SELECT date_trunc('day', "processedAt") AS day,
           COUNT(*) AS orders_count,
           SUM("totalPrice") AS revenue
    FROM "Order"
    WHERE "tenantId" = '${tenantId}'
    GROUP BY day ORDER BY day
  `);

  // 5) Top customers (fixed JOIN field)
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
    LIMIT 5
  `);

  return (
    <main
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

      {/* Sync button is now fully client-safe */}
      <SyncButton 
  tenantId={tenantId} 
  shopDomain={tenantUser.tenant.shopDomain} 
  privateToken={tenantUser.tenant.privateToken} 
/>


      <DashboardCards
        totalCustomers={Number(summary.total_customers)}
        totalOrders={Number(summary.total_orders)}
        totalRevenue={Number(summary.total_revenue)}
      />

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={{ flex: 2 }}>
          <OrdersChart data={chartData} />
        </div>
        <div style={{ flex: 1 }}>
          <TopCustomersTable customers={topCustomers} />
        </div>
      </div>
    </main>
  );
}
