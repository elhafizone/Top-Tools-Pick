import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const count = await prisma.product.count();
console.log("Total products:", count);
const byCat = await prisma.product.groupBy({ by: ["categoryId"], _count: true });
const cats = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
const catMap = Object.fromEntries(cats.map(c => [c.id, c.name]));
byCat.forEach(b => console.log(" ", catMap[b.categoryId], ":", b._count));
await prisma.$disconnect();
