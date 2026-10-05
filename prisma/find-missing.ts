import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const products = await prisma.product.findMany({ where: { status: 'PUBLISHED' }, select: { name: true, slug: true, integrations: true } })
  const allNames = new Set(products.map(p => p.name.toLowerCase()))
  const missing = new Set<string>()
  for (const p of products) {
    if (!p.integrations) continue
    const lines = p.integrations.split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      if (!allNames.has(line.toLowerCase())) missing.add(line)
    }
  }
  const sorted = [...missing].sort()
  console.log(`Missing pages (${sorted.length}):\n${sorted.join('\n')}`)
}
main().catch(console.error).finally(() => prisma.$disconnect())
