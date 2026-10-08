import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

// Set featured=true on these high-scoring tools from different categories
const slugs = ["figma", "vercel", "stripe"];

for (const slug of slugs) {
  const result = await p.product.updateMany({
    where: { slug },
    data: { featured: true },
  });
  console.log(slug, "→ updated", result.count, "row(s)");
}

// Confirm final list
const featured = await p.product.findMany({
  where: { featured: true },
  select: { name: true, editorialScore: true },
  orderBy: { editorialScore: "desc" },
});
console.log("\nFeatured tools now:", featured.length);
featured.forEach(t => console.log(" -", t.name, `(${t.editorialScore})`));

await p.$disconnect();
