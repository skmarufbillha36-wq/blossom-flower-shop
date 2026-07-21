import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Clean existing data ───────────────────────────────
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // ─── Categories ────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Roses', slug: 'roses', description: 'Classic roses in various colors' },
    }),
    prisma.category.create({
      data: { name: 'Tulips', slug: 'tulips', description: 'Fresh spring tulips' },
    }),
    prisma.category.create({
      data: { name: 'Sunflowers', slug: 'sunflowers', description: 'Bright and cheerful sunflowers' },
    }),
    prisma.category.create({
      data: { name: 'Bouquets', slug: 'bouquets', description: 'Mixed floral arrangements' },
    }),
    prisma.category.create({
      data: { name: 'Orchids', slug: 'orchids', description: 'Elegant exotic orchids' },
    }),
    prisma.category.create({
      data: { name: 'Lilies', slug: 'lilies', description: 'Fragrant and beautiful lilies' },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  const [roses, tulips, sunflowers, bouquets, orchids, lilies] = categories;

  // ─── Products ──────────────────────────────────────────
  const products = await Promise.all([
    // Roses
    prisma.product.create({
      data: {
        name: 'Classic Red Roses',
        slug: 'classic-red-roses',
        description: 'A timeless bouquet of 12 premium red roses. Perfect for expressing love and affection.',
        price: 49.99,
        stock: 50,
        isFeatured: true,
        isAvailable: true,
        categoryId: roses.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pink Rose Garden',
        slug: 'pink-rose-garden',
        description: 'Soft pink roses arranged with baby\'s breath for a romantic touch.',
        price: 44.99,
        stock: 35,
        isFeatured: true,
        isAvailable: true,
        categoryId: roses.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'White Rose Elegance',
        slug: 'white-rose-elegance',
        description: 'Pure white roses symbolizing purity and new beginnings. Ideal for weddings.',
        price: 54.99,
        stock: 25,
        isFeatured: false,
        isAvailable: true,
        categoryId: roses.id,
      },
    }),
    // Tulips
    prisma.product.create({
      data: {
        name: 'Spring Tulip Burst',
        slug: 'spring-tulip-burst',
        description: 'A vibrant mix of red, yellow, and purple tulips celebrating the arrival of spring.',
        price: 34.99,
        stock: 40,
        isFeatured: true,
        isAvailable: true,
        categoryId: tulips.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Purple Tulip Dream',
        slug: 'purple-tulip-dream',
        description: 'Elegant purple tulips that bring royalty and grace to any space.',
        price: 39.99,
        stock: 30,
        isFeatured: false,
        isAvailable: true,
        categoryId: tulips.id,
      },
    }),
    // Sunflowers
    prisma.product.create({
      data: {
        name: 'Sunny Day Bouquet',
        slug: 'sunny-day-bouquet',
        description: 'Bright sunflowers that bring warmth and happiness into any room.',
        price: 29.99,
        stock: 60,
        isFeatured: true,
        isAvailable: true,
        categoryId: sunflowers.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Giant Sunflower Collection',
        slug: 'giant-sunflower-collection',
        description: 'Extra large sunflowers, a bold statement for special occasions.',
        price: 42.99,
        stock: 20,
        isFeatured: false,
        isAvailable: true,
        categoryId: sunflowers.id,
      },
    }),
    // Bouquets
    prisma.product.create({
      data: {
        name: 'Garden Mix Delight',
        slug: 'garden-mix-delight',
        description: 'A lush mix of seasonal flowers handpicked by our expert florists.',
        price: 59.99,
        stock: 15,
        isFeatured: true,
        isAvailable: true,
        categoryId: bouquets.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Romance Forever Bundle',
        slug: 'romance-forever-bundle',
        description: 'Roses, lilies, and orchids combined in a premium romantic arrangement.',
        price: 89.99,
        stock: 10,
        isFeatured: true,
        isAvailable: true,
        categoryId: bouquets.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Birthday Celebration',
        slug: 'birthday-celebration',
        description: 'Colorful blooms to make any birthday unforgettable.',
        price: 49.99,
        stock: 25,
        isFeatured: false,
        isAvailable: true,
        categoryId: bouquets.id,
      },
    }),
    // Orchids
    prisma.product.create({
      data: {
        name: 'Purple Phalaenopsis',
        slug: 'purple-phalaenopsis',
        description: 'Stunning purple moth orchid in a premium pot. A lasting gift.',
        price: 74.99,
        stock: 12,
        isFeatured: true,
        isAvailable: true,
        categoryId: orchids.id,
      },
    }),
    // Lilies
    prisma.product.create({
      data: {
        name: 'White Stargazer Lilies',
        slug: 'white-stargazer-lilies',
        description: 'Fragrant white stargazer lilies — elegant and unforgettable.',
        price: 44.99,
        stock: 28,
        isFeatured: false,
        isAvailable: true,
        categoryId: lilies.id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // ─── Users ─────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123456', 12);
  const customerHash = await bcrypt.hash('customer123', 12);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@flowershop.com',
      passwordHash,
      phone: '+90 555 000 0001',
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Jane Customer',
      email: 'customer@example.com',
      passwordHash: customerHash,
      phone: '+90 555 000 0002',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Created 2 users (1 admin, 1 customer)');

  // ─── Sample Order ──────────────────────────────────────
  await prisma.order.create({
    data: {
      userId: customerUser.id,
      status: 'CONFIRMED',
      totalPrice: 94.98,
      notes: 'Please include a greeting card',
      items: {
        create: [
          { productId: products[0].id, quantity: 1, unitPrice: 49.99 },
          { productId: products[5].id, quantity: 1, unitPrice: 29.99 },
        ],
      },
      delivery: {
        create: {
          address: '123 Flower Street, Apt 4B',
          city: 'Ankara',
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          notes: 'Ring the doorbell twice',
        },
      },
    },
  });

  console.log('✅ Created 1 sample order');

  console.log('\n🎉 Seed completed successfully!');
  console.log('─────────────────────────────────────');
  console.log('📧 Admin login:    admin@flowershop.com / admin123456');
  console.log('📧 Customer login: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
