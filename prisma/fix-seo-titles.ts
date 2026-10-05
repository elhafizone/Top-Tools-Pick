import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, seoTitle: true }
  })

  let updated = 0
  for (const p of products) {
    if (!p.seoTitle || !p.seoTitle.includes('Review')) continue
    const newTitle = p.seoTitle
      .replace(/\s*Review\s*2025\s*—/g, ' —')
      .replace(/\s*Review\s*2025\b/g, '')
      .replace(/\s*Review\s*:/g, ':')
      .replace(/\s*Review\b/g, '')
      .trim()
    await prisma.product.update({ where: { id: p.id }, data: { seoTitle: newTitle } })
    console.log(`✓ ${p.name}: "${p.seoTitle}" → "${newTitle}"`)
    updated++
  }
  console.log(`\nUpdated ${updated} products`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
