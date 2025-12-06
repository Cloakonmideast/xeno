// // src/app/api/shopify/callback/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { exchangeCodeForToken } from '@/lib/shopify';
// import { prisma } from '@/lib/prisma';

// export async function GET(req: NextRequest) {
//   const url = req.nextUrl;
//   const shop = url.searchParams.get('shop');
//   const code = url.searchParams.get('code');

//   if (!shop || !code) {
//     return NextResponse.json({ error: 'Missing shop or code' }, { status: 400 });
//   }

//   const token = await exchangeCodeForToken(shop, code);

//   const tenant = await prisma.tenant.upsert({
//     where: { shopDomain: shop },
//     update: { shopifyAccessToken: token },
//     create: {
//       name: shop,
//       shopDomain: shop,
//       shopifyAccessToken: token,
//     },
//   });

//   // You can trigger initial sync here if you want
//   // await fetch(`${process.env.APP_URL}/api/shopify/sync?tenantId=${tenant.id}`, { method: 'POST' });

//   return NextResponse.redirect(`${process.env.APP_URL}/dashboard?tenantId=${tenant.id}`);
// }
