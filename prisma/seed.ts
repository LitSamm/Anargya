import { PrismaClient } from '@prisma/client';
import { INITIAL_PRODUCTS } from '../src/data/mockData';

const prisma = new PrismaClient();

async function main() {
  for (const product of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        description: product.description,
        imageUrl: product.image,
        badge: product.badge,
        sizes: product.sizes?.join(','),
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        inStock: product.inStock,
      },
      update: {},
    });
  }
  console.log(`Seeded ${INITIAL_PRODUCTS.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
