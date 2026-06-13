import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbUrl = `file:///${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function run() {
  const products = await prisma.product.findMany({ include: { category: true } });
  
  for (const p of products) {
    console.log(`- ${p.name} | Price: ${p.price} | Category: ${p.category?.name}`);
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
