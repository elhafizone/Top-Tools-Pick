import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const r = await p.product.findMany({
  include: { category: { select: { name: true } } }
});
const cats = {};
r.forEach(t => {
  const cat = t.category?.name || 'unknown';
  cats[cat] = (cats[cat] || 0) + 1;
});
console.log("Total:", r.length);
console.log(JSON.stringify(cats, null, 2));
await p.$disconnect();
