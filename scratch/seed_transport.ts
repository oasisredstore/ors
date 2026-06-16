const path = require("path");
const fs = require("fs");
const envFile = path.resolve(process.cwd(), ".env");
const envLocalFile = path.resolve(process.cwd(), ".env.local");

const loadEnv = (file: string) => {
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
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
      process.env[key] = value;
    }
  }
};

loadEnv(envFile);
loadEnv(envLocalFile);

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL ?? `file:///${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Transport to DB:", dbUrl);

  const provider1 = await prisma.serviceProvider.findUnique({
    where: { slug: "sahara-adventures" }
  });
  
  const provider2 = await prisma.serviceProvider.findUnique({
    where: { slug: "timimoun-palace" }
  });

  if (!provider1 || !provider2) {
    console.error("Providers not found!");
    return;
  }

  const transports = [
    {
      providerId: provider1.id,
      type: "TRANSPORT" as const,
      name: "VIP 4x4 Desert Transfer",
      nameAr: "نقل سياحي VIP رباعي الدفع",
      slug: "vip-4x4-desert-transfer",
      description: "Toyota Land Cruiser 4x4 in excellent condition. Full AC, perfect for inter-ksour transfers and off-road dune driving.",
      descriptionAr: "سيارة تويوتا لاندكروزر رباعية الدفع بحالة ممتازة. مكيفة بالكامل (Full AC)، مثالية للتنقل بين القصور الرملية والقيادة في الكثبان.",
      price: 8000,
      capacity: 6,
      isPublished: true,
      image: "/images/services/transport_4x4_vip.png"
    },
    {
      providerId: provider2.id,
      type: "TRANSPORT" as const,
      name: "Tourist Minibus for Groups",
      nameAr: "حافلة سياحية صغيرة للمجموعات",
      slug: "tourist-minibus-groups",
      description: "Mercedes Sprinter Minibus with comfortable seating and panoramic windows. Fully air-conditioned, ideal for inter-city travel.",
      descriptionAr: "حافلة مرسيدس سبرينتر بمقاعد مريحة ونوافذ بانورامية واسعة. مكيفة بالكامل، مثالية للنقل بين البلديات والمجموعات السياحية.",
      price: 15000,
      capacity: 15,
      isPublished: true,
      image: "/images/services/transport_minibus.png"
    },
    {
      providerId: provider1.id,
      type: "TRANSPORT" as const,
      name: "Oasis Tuk-Tuk / Buggy Ride",
      nameAr: "توك توك الواحة السياحي",
      slug: "oasis-tuktuk-ride",
      description: "Open-air tourist Tuk-Tuk/Buggy. No AC (natural oasis breeze). Perfect for exploring narrow paths inside the Ksar and palm grove.",
      descriptionAr: "توك توك أو باغي سياحي مفتوح في الهواء الطلق (بدون تكييف للاستمتاع بنسيم الواحة). مثالي للمسارات الضيقة داخل القصر القديم وغابة النخيل.",
      price: 1500,
      capacity: 3,
      isPublished: true,
      image: "/images/services/transport_tuktuk.png"
    },
    {
      providerId: provider2.id,
      type: "TRANSPORT" as const,
      name: "Airport VIP Shuttle",
      nameAr: "نقل مكوكي فاخر من وإلى المطار",
      slug: "airport-vip-shuttle",
      description: "Hyundai H1 minivan. Fully air-conditioned with spacious luggage area. Reliable transfer service from Timimoun Airport to hotels.",
      descriptionAr: "حافلة صغيرة فاخرة (Hyundai H1). مكيفة بالكامل مع مساحة واسعة للأمتعة. خدمة استقبال وتوديع موثوقة من مطار تيميمون إلى الفنادق.",
      price: 2500,
      capacity: 7,
      isPublished: true,
      image: "/images/services/transport_shuttle.png"
    }
  ];

  for (const tr of transports) {
    const existing = await prisma.service.findUnique({ where: { slug: tr.slug } });
    if (!existing) {
      await prisma.service.create({
        data: {
          providerId: tr.providerId,
          type: tr.type,
          name: tr.name,
          nameAr: tr.nameAr,
          slug: tr.slug,
          description: tr.description,
          descriptionAr: tr.descriptionAr,
          price: tr.price,
          capacity: tr.capacity,
          isPublished: tr.isPublished,
          images: {
            create: [
              { url: tr.image, isPrimary: true }
            ]
          }
        }
      });
      console.log(`Created transport service: ${tr.name}`);
    } else {
      console.log(`Transport service already exists: ${tr.name}`);
    }
  }

  console.log("Successfully seeded transport services!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
