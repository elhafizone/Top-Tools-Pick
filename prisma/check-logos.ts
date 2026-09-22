import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, name: true, logoUrl: true },
    orderBy: { name: "asc" }
  });
  for (const p of products) {
    console.log(`${p.slug.padEnd(20)} ${p.logoUrl ?? "NULL"}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
