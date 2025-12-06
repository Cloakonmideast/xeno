import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { shopifyFetch } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    console.log("📩 Received body:", body);

    const { shop, token } = body;

    if (!shop) {
      return new Response(JSON.stringify({ error: "Missing shop URL" }), { status: 400 });
    }

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing Shopify shpat token" }), { status: 400 });
    }

    // Fix formatting: ensure full domain
    const normalizedShop = shop.includes(".myshopify.com")
      ? shop
      : `${shop}.myshopify.com`;

    console.log("🔍 Testing credentials for:", normalizedShop);

    // Try calling Shopify
    const response = await shopifyFetch(normalizedShop, token, "shop.json");

    console.log("✅ Shopify response:", response.shop?.name);

    const shopName = response.shop?.name || normalizedShop;

    // Save tenant only if connection works
    const tenant = await prisma.tenant.create({
      data: {
        shopDomain: normalizedShop,
        privateToken: token,
        name: shopName,
        tenantUsers: {
          create: { userId: user.id }
        }
      }
    });

    console.log("🎉 Tenant saved:", tenant);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error("❌ Shopify connect error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
