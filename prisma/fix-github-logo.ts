import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.product.update({
    where: { slug: "github" },
    data: { logoUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=128" },
  });
  console.log("Done — GitHub logo updated to Google favicon CDN.");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
