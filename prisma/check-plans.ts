import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.product.findUnique({
  where: { slug: "chatgpt" },
  select: { id: true, pricingPlans: true },
}).then((r) => {
  console.log(JSON.stringify(r, null, 2));
}).finally(() => p.$disconnect());
