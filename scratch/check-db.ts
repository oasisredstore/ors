import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbUrl = `file:///${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function run() {
  const products = await prisma.product.findMany({ include: { images: true, category: true, artisan: true } });
  const missingImages = [];
  const wrongImages = [];
  const duplicates = [];
  const mismatched = [];
  const total = products.length;

  const slugs = new Set();

  for (const p of products) {
    if (p.images.length === 0) {
      missingImages.push({ id: p.id, name: p.name });
    } else {
      for (const img of p.images) {
        if (!img.url.startsWith('/') && !img.url.startsWith('http')) {
           wrongImages.push({ id: p.id, name: p.name, url: img.url });
        }
      }
    }

    if (slugs.has(p.slug)) {
      duplicates.push({ id: p.id, slug: p.slug });
    }
    slugs.add(p.slug);

    if (!p.category) {
      mismatched.push({ id: p.id, name: p.name, issue: 'No Category' });
    }
    if (!p.artisan) {
      mismatched.push({ id: p.id, name: p.name, issue: 'No Artisan' });
    }
  }
  console.log(JSON.stringify({ total, missingImages, wrongImages, duplicates, mismatched }, null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
