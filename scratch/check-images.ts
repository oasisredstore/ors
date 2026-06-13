import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

const dbUrl = `file:///${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function run() {
  const products = await prisma.product.findMany({ include: { images: true } });
  
  for (const p of products) {
    for (const img of p.images) {
      // Check if image exists in filesystem
      let exists = false;
      let checkPath = '';
      if (img.url.startsWith('/')) {
        checkPath = path.join(process.cwd(), 'public', img.url);
        exists = fs.existsSync(checkPath);
      } else {
        exists = true; // assume external http is fine for now, or check if we have https urls
      }
      console.log(`Product: ${p.name} (${p.id}) -> Image: ${img.url} -> Exists: ${exists}`);
    }
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
