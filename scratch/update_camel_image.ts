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

console.log("UPDATE SCRIPT DB URL:", dbUrl);

async function main() {
  console.log("Updating Traditional Kasbah Room image...");
  
  const service = await prisma.service.findUnique({
    where: { slug: "traditional-kasbah-room" },
    include: { images: true }
  });

  if (!service) {
    console.log("Service not found!");
    return;
  }

  if (service.images.length > 0) {
    await prisma.serviceImage.update({
      where: { id: service.images[0].id },
      data: { url: "/images/services/traditional_kasbah_room.png" }
    });
  } else {
    await prisma.serviceImage.create({
      data: {
        serviceId: service.id,
        url: "/images/services/traditional_kasbah_room.png",
        isPrimary: true
      }
    });
  }

  const allServices = await prisma.service.findMany({ select: { slug: true } });
  console.log("All services in DB:", allServices);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
