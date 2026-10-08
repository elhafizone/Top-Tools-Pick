import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.product.update({ where: { slug: "twilio" }, data: { rating: 4.3 } });
  console.log("Done — Twilio rating set to 4.3");
}
main().finally(() => prisma.$disconnect());
