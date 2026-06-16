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
  console.log("Updating room...");

  const service = await prisma.service.findUnique({
    where: { slug: "traditional-ksar-room" },
  });

  if (service) {
    // Update the service details
    await prisma.service.update({
      where: { id: service.id },
      data: {
        name: "Modern Desert Oasis Suite",
        nameAr: "جناح الواحة الصحراوي الحديث",
        description: "A breathtaking modern suite blending contemporary luxury with Saharan minimalism. Features floor-to-ceiling windows overlooking the palm grove, a private plunge pool, and state-of-the-art smart room controls.",
        descriptionAr: "جناح عصري مذهل يمزج بين الفخامة الحديثة والبساطة الصحراوية. يتميز بنوافذ ممتدة من الأرض إلى السقف تطل على واحة النخيل، مسبح خاص صغير، وأنظمة تحكم ذكية متطورة للغرفة.",
        price: 25000,
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
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000",
        isPrimary: true
      }
    });

    console.log("Room updated successfully!");
  } else {
    console.log("Room not found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
