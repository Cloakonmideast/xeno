// // src/app/api/shopify/install/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getShopifyInstallUrl } from '@/lib/shopify';

// export async function GET(req: NextRequest) {
//   const shop = req.nextUrl.searchParams.get('shop');
//   if (!shop) {
//     return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
//   }

//   const url = getShopifyInstallUrl(shop);
//   return NextResponse.redirect(url);
// }
