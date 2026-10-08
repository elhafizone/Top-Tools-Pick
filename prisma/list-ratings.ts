import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.product.findMany({ select: { slug: true, name: true, rating: true }, orderBy: { name: "asc" } });
  rows.forEach(r => console.log(r.name.padEnd(22), Number(r.rating).toFixed(2)));
}
main().finally(() => prisma.$disconnect());
