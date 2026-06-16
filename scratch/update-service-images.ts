/**
 * Run: npx tsx scratch/update-service-images.ts
 * Updates seeded service images to culturally accurate Saharan desert photos.
 */
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

// Curated Saharan-relevant images from Unsplash (verified accessible)
const SERVICE_IMAGES: Record<string, string> = {
  "royal-oasis-suite":
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600",   // luxury desert hotel interior
  "traditional-kasbah-room":
    "https://images.unsplash.com/photo-1529290130-4ca3753253ae?q=80&w=1600",   // moroccan riad / kasbah style room
  "sunset-camel-trek":
    "https://images.unsplash.com/photo-1553899501-8db84f81d77f?q=80&w=1600",  // camel caravan in sahara
  "4x4-oasis-expedition":
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?q=80&w=1600", // 4x4 in sand dunes
};

async function main() {
  console.log("🖼️  Updating service images...");
  for (const [slug, url] of Object.entries(SERVICE_IMAGES)) {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) {
      console.log(`⚠️  Service not found: ${slug}`);
      continue;
    }
    await prisma.serviceImage.updateMany({
      where: { serviceId: service.id, isPrimary: true },
      data: { url },
    });
    console.log(`✅ Updated: ${slug}`);
  }
  console.log("\n🎉 Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
