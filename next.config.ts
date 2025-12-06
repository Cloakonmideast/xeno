import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get tenant + token
  const tenantUser = await prisma.tenantUser.findFirst({
    where: { userId: user.id },
    include: { tenant: true }
  });

  if (!tenantUser || !tenantUser.tenant) {
    return NextResponse.json({ error: "No Shopify store connected" }, { status: 400 });
  }

  const { shopDomain, shopifyAccessToken } = tenantUser.tenant;
  const tenantId = tenantUser.tenantId;

  // ---- Fetch data from Shopify ----
  const response = await fetch(
    `https://${shopDomain}/admin/api/2024-10/orders.json?status=any&limit=250`,
    {
      headers: {
        "X-Shopify-Access-Token": shopifyAccessToken,
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();

  // ---- Handle Shopify API Errors ----
  if (!response.ok) {
    console.error("❌ Shopify API Error:", data);
    return NextResponse.json(
      { error: "Shopify API request failed", details: data },
      { status: response.status }
    );
  }

  // ---- Ensure orders exists ----
  const orders = Array.isArray(data.orders) ? data.orders : [];

  console.log(`➡️ Syncing ${orders.length} orders...`);

  for (const order of orders) {
    // -------------------------------
    // 1️⃣ Upsert Customer (must happen first)
    // -------------------------------
    let customerRecord = null;

    if (order.customer) {
      customerRecord = await prisma.customer.upsert({
        where: {
          shopifyCustomerId_tenantId: {
            shopifyCustomerId: order.customer.id,
            tenantId
          }
        },
        update: {
          email: order.customer.email,
          firstName: order.customer.first_name,
          lastName: order.customer.last_name
        },
        create: {
          tenantId,
          shopifyCustomerId: order.customer.id,
          email: order.customer.email,
          firstName: order.customer.first_name,
          lastName: order.customer.last_name
        }
      });
    }

    // -------------------------------
    // 2️⃣ Upsert Order
    // -------------------------------
    const savedOrder = await prisma.order.upsert({
      where: {
        shopifyOrderId_tenantId: {
          shopifyOrderId: order.id,
          tenantId
        }
      },
      update: {
        financialStatus: order.financial_status,
        totalPrice: parseFloat(order.total_price || "0"),
        processedAt: order.processed_at ? new Date(order.processed_at) : null,
        customerId: customerRecord?.id || null
      },
      create: {
        tenantId,
        shopifyOrderId: order.id,
        orderNumber: order.order_number?.toString() || "",
        financialStatus: order.financial_status,
        totalPrice: parseFloat(order.total_price || "0"),
        currency: order.currency,
        processedAt: order.processed_at ? new Date(order.processed_at) : null,
        customerId: customerRecord?.id || null
      }
    });

    // -------------------------------
    // 3️⃣ Products + Order Items
    // -------------------------------
    for (const item of order.line_items) {
      const productRecord = await prisma.product.upsert({
        where: {
          shopifyProductId_tenantId: {
            shopifyProductId: item.product_id,
            tenantId
          }
        },
        update: { title: item.title, sku: item.sku, price: parseFloat(item.price) },
        create: {
          tenantId,
          shopifyProductId: item.product_id,
          title: item.title,
          sku: item.sku,
          price: parseFloat(item.price)
        }
      });

      await prisma.orderItem.upsert({
        where: {
          orderId_productId: {
            orderId: savedOrder.id,
            productId: productRecord.id
          }
        },
        update: {
          quantity: item.quantity,
          price: parseFloat(item.price)
        },
        create: {
          orderId: savedOrder.id,
          productId: productRecord.id,
          quantity: item.quantity,
          price: parseFloat(item.price)
        }
      });
    }
  }

  return NextResponse.json({ success: true, message: "Shopify sync complete!" });
}
