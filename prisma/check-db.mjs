import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const cats = await p.category.findMany({ select: { slug: true, name: true } });
console.log("CATEGORIES:", JSON.stringify(cats, null, 2));
const count = await p.product.count();
console.log("TOTAL PRODUCTS:", count);
const slugs = await p.product.findMany({ select: { slug: true } });
console.log("SLUGS:", JSON.stringify(slugs.map(s => s.slug)));
await p.$disconnect();
