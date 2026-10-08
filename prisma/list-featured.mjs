import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const r = await p.product.findMany({
  where: { featured: true },
  select: { name: true, editorialScore: true },
  orderBy: { editorialScore: "desc" }
});
console.log("Featured count:", r.length);
r.forEach(t => console.log(" -", t.name, `(${t.editorialScore})`));
await p.$disconnect();
