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
  console.log("Updating tent...");

  const service = await prisma.service.findUnique({
    where: { slug: "royal-desert-tent" },
  });

  if (service) {
    // Update the service details
    await prisma.service.update({
      where: { id: service.id },
      data: {
        name: "Eco-Chic Desert Dome",
        nameAr: "القبة الصحراوية البيئية الحديثة",
        description: "A futuristic and eco-friendly glamping dome set against the majestic Tinerkouk dunes. Features an astrodome skylight for stargazing from bed, minimalist contemporary furnishings, and a private solar-heated jacuzzi.",
        descriptionAr: "قبة تخييم بيئية حديثة بتصميم مستقبلي (Glamping) وسط كثبان تينركوك المهيبة. تتميز بسقف زجاجي بانورامي لمشاهدة النجوم من السرير، وأثاث معاصر بتصميم بسيط (Minimalist)، بالإضافة إلى جاكوزي خاص يعمل بالطاقة الشمسية.",
        price: 32000,
        capacity: 2,
      }
    });

    // Update the image
    await prisma.serviceImage.deleteMany({
      where: { serviceId: service.id }
    });

    await prisma.serviceImage.create({
      data: {
        serviceId: service.id,
        // Using an image of a glamping dome / modern tent aesthetic
        url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1000",
        isPrimary: true
      }
    });

    console.log("Tent updated successfully!");
  } else {
    console.log("Tent not found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
