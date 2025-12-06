import { prisma } from "@/lib/prisma";

/**
 * Fetch from Shopify using a private app token (shpat_xxx)
 */
export async function shopifyFetch(shop: string, token: string, endpoint: string) {
  const url = `https://${shop}/admin/api/2024-01/${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API Error: ${res.status} → ${text}`);
  }

  return res.json();
}

/**
 * Optional helper: test if credentials work
 */
export async function validateShopifyCredentials(shop: string, token: string) {
  try {
    const data = await shopifyFetch(shop, token, "shop.json");
    return {
      valid: true,
      shopName: data.shop?.name ?? shop,
    };
  } catch {
    return { valid: false };
  }
}
