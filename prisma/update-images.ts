/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to update product images with real Timimoun/Saharan artisan photos from Unsplash
 * Run: npx tsx prisma/update-images.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const path = require("path");
const fs = require("fs");
const envFile = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const dbUrl = process.env.DATABASE_URL ?? `file:///E:/RedOasisArtisan/prisma/dev.db`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

// Real Timimoun/Saharan artisan product images — verified Unsplash photo IDs
const PRODUCT_IMAGES: Record<string, string[]> = {
  // Saharan Water Jar (Guerbha) — pottery/ceramic
  "saharan-water-jar-guerbha": [
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop",
  ],
  // Decorative Terracotta Bowl Set — ceramic bowls
  "decorative-terracotta-bowl-set": [
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop",
  ],
  // Traditional Tagine Pot — moroccan/algerian cooking
  "traditional-tagine-pot": [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
  ],
  // Hand-Woven Saharan Blanket — textile/weaving
  "hand-woven-saharan-blanket": [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=800&auto=format&fit=crop",
  ],
  // Traditional Saharan Prayer Rug — rug/carpet
  "traditional-saharan-prayer-rug": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=800&auto=format&fit=crop",
  ],
  // Artisan Palm Leaf Basket Set — baskets
  "artisan-palm-leaf-basket-set": [
    "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&auto=format&fit=crop",
  ],
  // Saharan Palm Fan (Marwaha) — handmade fan
  "saharan-palm-fan-marwaha": [
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&auto=format&fit=crop",
  ],
  // Tuareg Cross Pendant (Teneghelt) — silver jewelry
  "tuareg-cross-pendant-teneghelt": [
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576016770956-debb63d92058?w=800&auto=format&fit=crop",
  ],
  // Saharan Silver Bracelet — silver bracelet
  "saharan-silver-bracelet": [
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800&auto=format&fit=crop",
  ],
  // Saharan Oil Lamp (Qandil) — decorative lamp
  "saharan-oil-lamp-qandil": [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop",
  ],
};

async function main() {
  console.log("🖼️  Updating product images with verified Timimoun artisan photos...\n");

  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true },
  });

  let updated = 0;

  for (const product of products) {
    const images = PRODUCT_IMAGES[product.slug];
    if (!images || images.length === 0) {
      console.log(`⚠️  No images defined for: "${product.slug}"`);
      continue;
    }

    await prisma.productImage.deleteMany({ where: { productId: product.id } });

    await prisma.productImage.createMany({
      data: images.map((url, idx) => ({
        productId: product.id,
        url,
        isPrimary: idx === 0,
        sortOrder: idx,
        altText: product.name,
      })),
    });

    console.log(`✅ ${product.name}`);
    updated++;
  }

  console.log(`\n🎉 Updated ${updated}/${products.length} products!`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
