import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      integrations: { not: null },
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      integrations: true,
    }
  })

  for (const p of products) {
    console.log(`\n=== ${p.name} (${p.slug}) ===`)
    console.log(p.integrations)
  }

  console.log(`\nTotal products with integrations: ${products.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
