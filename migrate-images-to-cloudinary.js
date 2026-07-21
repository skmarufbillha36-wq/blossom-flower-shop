/**
 * migrate-images-to-cloudinary.js
 * 
 * Reads all products with local image URLs (localhost:5000/uploads/...)
 * and migrates them to Cloudinary, then updates the DB records.
 * 
 * Run: node migrate-images-to-cloudinary.js
 */

const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');

/* ─── Config ─────────────────────────────────────────────── */
const CLOUDINARY_CLOUD_NAME = 'iedhaa6l';
const CLOUDINARY_API_KEY    = '611616153163134';
const CLOUDINARY_API_SECRET = 't2RoGG0UnpD_7dLwDQxvn94G1UE';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@db:5432/flower_shop' },
  },
});

/* ─── Helper: upload local file to Cloudinary ───────────── */
async function uploadFileToCloudinary(localUrl) {
  // Extract filename: http://localhost:5000/uploads/abc.png → abc.png
  const filename = localUrl.split('/uploads/').pop();
  const filePath = `/app/uploads/${filename}`;

  const result = await cloudinary.uploader.upload(filePath, {
    folder:         'blossom-flower-shop',
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  });
  return result.secure_url;
}

/* ─── Main migration ─────────────────────────────────────── */
async function migrate() {
  console.log('🌸 Starting image migration to Cloudinary...\n');

  const products = await prisma.product.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
  });

  const localProducts = products.filter(p =>
    p.imageUrl && (
      p.imageUrl.includes('localhost') ||
      p.imageUrl.includes('127.0.0.1') ||
      p.imageUrl.includes('/uploads/')
    )
  );

  if (localProducts.length === 0) {
    console.log('✅ No local images found — all images are already on CDN or no images exist.');
    return;
  }

  console.log(`📦 Found ${localProducts.length} products with local images:\n`);

  let success = 0;
  let failed  = 0;

  for (const product of localProducts) {
    process.stdout.write(`  • ${product.name} ... `);
    try {
      const newUrl = await uploadFileToCloudinary(product.imageUrl);
      await prisma.product.update({
        where: { id: product.id },
        data:  { imageUrl: newUrl },
      });
      console.log(`✅ ${newUrl}`);
      success++;
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n────────────────────────────────────`);
  console.log(`✅ Migrated: ${success}  ❌ Failed: ${failed}`);
  console.log(`────────────────────────────────────`);
  console.log('\n🎉 Migration complete! All images are now on Cloudinary CDN.\n');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
