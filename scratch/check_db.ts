/* eslint-disable @typescript-eslint/no-require-imports */
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

const dbUrl =
  process.env.DATABASE_URL ??
  `file://${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;

console.log("Using DB URL:", dbUrl);

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const artisans = await prisma.artisan.findMany();
  console.log("ARTISANS IN DB:", artisans.map(a => ({ id: a.id, shopName: a.shopName, slug: a.slug, isApproved: a.isApproved, isActive: a.isActive })));
  
  const products = await prisma.product.findMany();
  console.log("PRODUCTS IN DB COUNT:", products.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
