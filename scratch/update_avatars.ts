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
  console.log("Updating Avatars in DB:", dbUrl);

  await prisma.artisan.updateMany({
    where: { slug: "gourara-pottery-art" },
    data: { avatarUrl: "/images/avatars/zohra.png" }
  });
  
  await prisma.artisan.updateMany({
    where: { slug: "atelier-tigurarin" },
    data: { avatarUrl: "/images/avatars/nour.png" }
  });
  
  await prisma.serviceProvider.updateMany({
    where: { slug: "sahara-adventures" },
    data: { avatarUrl: "/images/avatars/ahmed.png" }
  });

  // For the hotel, maybe we just set a default building icon or something, or leave it empty so it shows a fallback. Let's set a hotel icon if we want.
  await prisma.serviceProvider.updateMany({
    where: { slug: "timimoun-palace" },
    data: { avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TimimounPalace&backgroundColor=d97706" }
  });

  console.log("Successfully updated avatars!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
