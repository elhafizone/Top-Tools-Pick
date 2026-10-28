import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function run() {
  const total = await prisma.product.count();
  const byCat = await prisma.product.groupBy({ by: ["categoryId"], _count: true });
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catMap = Object.fromEntries(cats.map(c => [c.id, c.slug]));
  console.log(`\nTotal products: ${total}\n`);
  for (const c of byCat.sort((a,b) => a._count - b._count)) {
    console.log(`  ${catMap[c.categoryId]}: ${c._count}`);
  }
  await prisma.$disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
