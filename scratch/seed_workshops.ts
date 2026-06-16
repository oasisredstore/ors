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
  console.log("Seeding Workshops to DB:", dbUrl);

  // Find the Sahara Adventures provider
  const provider = await prisma.serviceProvider.findUnique({
    where: { slug: "sahara-adventures" }
  });

  if (!provider) {
    console.error("Provider Sahara Adventures not found!");
    return;
  }

  const workshops = [
    {
      type: "WORKSHOP" as const,
      name: "Ahellil Chants & Dance Experience",
      nameAr: "تجربة رقص وأهازيج أهليل",
      slug: "ahellil-dance-experience",
      description: "Join a local Zenete troupe around a fire in the oasis to learn the hypnotic Ahellil chants and poetry, a UNESCO Intangible Cultural Heritage.",
      descriptionAr: "سهرة موسيقية روحانية حول النار في الواحة، تتيح للسياح الانضمام إلى فرقة زناتية محلية لتعلم أداء 'أهليل قورارة' المصنف ضمن التراث العالمي لليونسكو.",
      price: 2500,
      capacity: 20,
      isPublished: true,
      image: "/images/services/ahellil_dance.png"
    },
    {
      type: "WORKSHOP" as const,
      name: "Saharan Pottery Workshop",
      nameAr: "ورشة الفخار الصحراوي التقليدي",
      slug: "saharan-pottery-workshop",
      description: "A hands-on session to learn how to mold and paint traditional red clay pottery with local artisans in the Ksar.",
      descriptionAr: "جلسة عملية لتعلم تشكيل الطين الأحمر المميز لمنطقة تيميمون وصنع أواني فخارية وزخرفتها بالرموز الأمازيغية مع الحرفيين.",
      price: 4000,
      capacity: 8,
      isPublished: true,
      image: "/images/services/saharan_pottery_workshop.png"
    },
    {
      type: "WORKSHOP" as const,
      name: "Foggara Farming & Date Harvest",
      nameAr: "تجربة نظام ري الفقارة وجني التمور",
      slug: "foggara-farming-experience",
      description: "A practical tour in the palm grove to learn how to maintain the ancient Foggara water channels and participate in the date harvest.",
      descriptionAr: "جولة تطبيقية في غابة النخيل لتعلم كيفية صيانة قنوات المياه الجوفية (الفقارة) والمشاركة في طقوس جني التمور مع فلاحي الواحة.",
      price: 3500,
      capacity: 12,
      isPublished: true,
      image: "/images/services/foggara_farming.png"
    },
    {
      type: "WORKSHOP" as const,
      name: "Zenete Weaving & Natural Dyeing",
      nameAr: "ورشة النسيج الزناتي والصباغة الطبيعية",
      slug: "zenete-weaving-workshop",
      description: "An immersive experience learning to use the vertical loom and dye sheep's wool with natural colors (henna, madder) to make Fatiss carpets.",
      descriptionAr: "تجربة غامرة لتعلم استخدام النول العمودي وصباغة صوف الغنم بالألوان الطبيعية (الحناء، الفوة، النيلة) لصنع سجاد الفاتيس.",
      price: 5000,
      capacity: 5,
      isPublished: true,
      image: "/images/services/zenete_weaving_workshop.png"
    }
  ];

  for (const ws of workshops) {
    const existing = await prisma.service.findUnique({ where: { slug: ws.slug } });
    if (!existing) {
      await prisma.service.create({
        data: {
          providerId: provider.id,
          type: ws.type,
          name: ws.name,
          nameAr: ws.nameAr,
          slug: ws.slug,
          description: ws.description,
          descriptionAr: ws.descriptionAr,
          price: ws.price,
          capacity: ws.capacity,
          isPublished: ws.isPublished,
          images: {
            create: [
              { url: ws.image, isPrimary: true }
            ]
          }
        }
      });
      console.log(`Created workshop: ${ws.name}`);
    } else {
      console.log(`Workshop already exists: ${ws.name}`);
    }
  }

  console.log("Successfully seeded workshops!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
