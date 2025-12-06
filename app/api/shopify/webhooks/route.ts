// // src/app/api/shopify/webhooks/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyWebhookHmac } from '@/lib/shopify';
// import { prisma } from '@/lib/prisma';

// export async function POST(req: NextRequest) {
//   const rawBody = await req.text();
//   const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
//   const topic = req.headers.get('x-shopify-topic');
//   const shopDomain = req.headers.get('x-shopify-shop-domain');

//   if (!verifyWebhookHmac(rawBody, hmacHeader)) {
//     return new NextResponse('Unauthorized', { status: 401 });
//   }

//   if (!shopDomain) {
//     return new NextResponse('Missing shop domain', { status: 400 });
//   }

//   const tenant = await prisma.tenant.findUnique({ where: { shopDomain } });
//   if (!tenant) return new NextResponse('Tenant not found', { status: 404 });

//   const payload = JSON.parse(rawBody);

//   switch (topic) {
//     case 'orders/create':
//     case 'orders/updated': {
//       const shopifyOrderId = BigInt(payload.id);
//       const customerId = payload.customer?.id ? BigInt(payload.customer.id) : undefined;

//       let customerRecord = null;
//       if (customerId) {
//         const c = payload.customer;
//         customerRecord = await prisma.customer.upsert({
//           where: {
//             tenantId_shopifyCustomerId: {
//               tenantId: tenant.id,
//               shopifyCustomerId: customerId,
//             },
//           },
//           update: {
//             email: c.email,
//             firstName: c.first_name,
//             lastName: c.last_name,
//             updatedAt: c.updated_at ? new Date(c.updated_at) : null,
//           },
//           create: {
//             tenantId: tenant.id,
//             shopifyCustomerId: customerId,
//             email: c.email,
//             firstName: c.first_name,
//             lastName: c.last_name,
//             createdAt: c.created_at ? new Date(c.created_at) : null,
//             updatedAt: c.updated_at ? new Date(c.updated_at) : null,
//           },
//         });
//       }

//       const order = await prisma.order.upsert({
//         where: {
//           tenantId_shopifyOrderId: {
//             tenantId: tenant.id,
//             shopifyOrderId,
//           },
//         },
//         update: {
//           customerId: customerRecord?.id,
//           orderNumber: String(payload.order_number),
//           financialStatus: payload.financial_status,
//           totalPrice: payload.total_price,
//           currency: payload.currency,
//           processedAt: payload.processed_at ? new Date(payload.processed_at) : null,
//           updatedAt: new Date(),
//         },
//         create: {
//           tenantId: tenant.id,
//           shopifyOrderId,
//           customerId: customerRecord?.id,
//           orderNumber: String(payload.order_number),
//           financialStatus: payload.financial_status,
//           totalPrice: payload.total_price,
//           currency: payload.currency,
//           processedAt: payload.processed_at ? new Date(payload.processed_at) : null,
//         },
//       });

//       const lineItems = payload.line_items || [];
//       await prisma.orderItem.deleteMany({ where: { orderId: order.id } });

//       for (const item of lineItems) {
//         const productId = item.product_id ? BigInt(item.product_id) : undefined;
//         let productRecord = null;
//         if (productId) {
//           productRecord = await prisma.product.upsert({
//             where: {
//               tenantId_shopifyProductId: {
//                 tenantId: tenant.id,
//                 shopifyProductId: productId,
//               },
//             },
//             update: {
//               title: item.name,
//               sku: item.sku,
//               price: item.price,
//             },
//             create: {
//               tenantId: tenant.id,
//               shopifyProductId: productId,
//               title: item.name,
//               sku: item.sku,
//               price: item.price,
//             },
//           });
//         }

//         await prisma.orderItem.create({
//           data: {
//             orderId: order.id,
//             productId: productRecord?.id,
//             quantity: item.quantity,
//             price: item.price,
//           },
//         });
//       }

//       break;
//     }
//     case 'customers/create':
//     case 'customers/update': {
//       const c = payload;
//       await prisma.customer.upsert({
//         where: {
//           tenantId_shopifyCustomerId: {
//             tenantId: tenant.id,
//             shopifyCustomerId: BigInt(c.id),
//           },
//         },
//         update: {
//           email: c.email,
//           firstName: c.first_name,
//           lastName: c.last_name,
//           updatedAt: c.updated_at ? new Date(c.updated_at) : null,
//         },
//         create: {
//           tenantId: tenant.id,
//           shopifyCustomerId: BigInt(c.id),
//           email: c.email,
//           firstName: c.first_name,
//           lastName: c.last_name,
//           createdAt: c.created_at ? new Date(c.created_at) : null,
//           updatedAt: c.updated_at ? new Date(c.updated_at) : null,
//         },
//       });
//       break;
//     }
//     case 'carts/update':
//     case 'checkouts/create': {
//       await prisma.event.create({
//         data: {
//           tenantId: tenant.id,
//           shopifyCustomerId: payload.customer?.id
//             ? BigInt(payload.customer.id)
//             : null,
//           eventType: topic,
//           payload,
//         },
//       });
//       break;
//     }
//     default:
//       break;
//   }

//   return NextResponse.json({ ok: true });
// }
