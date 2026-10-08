import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const rows = await p.product.findMany({ select: { slug:true, name:true, status:true }, orderBy: { name:"asc" } });
  for (const r of rows) console.log(r.status.padEnd(12), r.slug.padEnd(30), r.name);
}
main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
