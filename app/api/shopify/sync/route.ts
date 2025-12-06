import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const { tenantId, shopDomain, privateToken } = await req.json();

    if (!tenantId || !shopDomain || !privateToken) {
      return NextResponse.json({ error: "Missing tenant/shop credentials" }, { status: 400 });
    }

    console.log("▶ Starting sync for:", shopDomain);

    /* -----------------------------------------
       1️⃣ FETCH DATA FROM SHOPIFY
    ----------------------------------------- */

    const customerData = await shopifyFetch(shopDomain, privateToken, "customers.json?limit=250");
    const productData = await shopifyFetch(shopDomain, privateToken, "products.json?limit=250");
    const orderData = await shopifyFetch(shopDomain, privateToken, "orders.json?status=any&limit=250");

    /* -----------------------------------------
       2️⃣ SYNC CUSTOMERS
    ----------------------------------------- */

    if (customerData?.customers?.length) {
      for (const c of customerData.customers) {
        await prisma.customer.upsert({
          where: {
            tenantId_shopifyCustomerId: {
              tenantId,
              shopifyCustomerId: BigInt(c.id)
            }
          },
          create: {
            tenantId,
            shopifyCustomerId: BigInt(c.id),
            firstName: c.first_name,
            lastName: c.last_name,
            email: c.email,
            totalSpent: c.total_spent,
            createdAt: c.created_at ? new Date(c.created_at) : null
          },
          update: {
            totalSpent: c.total_spent
          }
        });
      }
    }

    /* -----------------------------------------
       3️⃣ SYNC PRODUCTS
    ----------------------------------------- */

    if (productData?.products?.length) {
      for (const p of productData.products) {
        const variant = p.variants?.[0];

        await prisma.product.upsert({
          where: {
            tenantId_shopifyProductId: {
              tenantId,
              shopifyProductId: BigInt(p.id)
            }
          },
          create: {
            tenantId,
            shopifyProductId: BigInt(p.id),
            title: p.title,
            sku: variant?.sku || null,
            price: variant?.price || null
          },
          update: {
            title: p.title,
            price: variant?.price || null
          }
        });
      }
    }

    /* -----------------------------------------
       4️⃣ SYNC ORDERS + ITEMS
    ----------------------------------------- */

    if (orderData?.orders?.length) {
      for (const o of orderData.orders) {

        // Find linked Shopify customer record
        let existingCustomer = await prisma.customer.findFirst({
          where: {
            tenantId,
            shopifyCustomerId: BigInt(o.customer?.id || 0)
          }
        });

        const customerId = existingCustomer ? existingCustomer.id : null;

        // Create or update order
        const savedOrder = await prisma.order.upsert({
          where: {
            tenantId_shopifyOrderId: {
              tenantId,
              shopifyOrderId: BigInt(o.id)
            }
          },
          create: {
            tenantId,
            shopifyOrderId: BigInt(o.id),
            customerId,
            orderNumber: o.order_number?.toString() || null,
            financialStatus: o.financial_status,
            totalPrice: o.total_price,
            currency: o.currency,
            processedAt: o.processed_at ? new Date(o.processed_at) : null
          },
          update: {
            totalPrice: o.total_price,
            financialStatus: o.financial_status,
            customerId
          }
        });

        /* ---- SYNC LINE ITEMS ---- */
        if (o.line_items?.length) {
          for (const item of o.line_items) {
            await prisma.orderItem.upsert({
              where: {
                orderId_productId: {
                  orderId: savedOrder.id,
                  productId: item.product_id ? BigInt(item.product_id) : null
                }
              },
              create: {
                orderId: savedOrder.id,
                productId: item.product_id ? BigInt(item.product_id) : null,
                quantity: item.quantity,
                price: item.price
              },
              update: {
                quantity: item.quantity,
                price: item.price
              }
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Shopify sync completed successfully 🎉"
    });

  } catch (err: any) {
    console.error("❌ Sync error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
