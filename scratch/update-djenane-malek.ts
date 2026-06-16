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
  console.log("Updating to Djenane Malek...");

  const provider = await prisma.serviceProvider.findUnique({
    where: { slug: "tinerkouk-golden-camp" },
  });

  if (provider) {
    await prisma.serviceProvider.update({
      where: { id: provider.id },
      data: {
        businessName: "Djenane Malek - إقامة جنان مالك",
        slug: "djenane-malek",
        description: "Gîte Djenane Malek is a traditional guest house located in the Bouhdi area of Timimoun, offering an authentic Sahara desert experience with views over the palm grove and traditional Khaima setups.",
        descriptionAr: "إقامة جنان مالك هي دار ضيافة تقليدية عريقة تقع في حي بودي بتيميمون. توفر تجربة صحراوية أصيلة مع إطلالات ساحرة على واحة النخيل، وخيم تقليدية (خيمة)، وخدمات ضيافة زناتية ممتازة.",
        location: "Bouhdi, Timimoun",
        contactPhone: "+213 49 90 00 00", // placeholder
        contactEmail: "contact@djenanemalek.dz",
      }
    });

    const service = await prisma.service.findUnique({
      where: { slug: "royal-desert-tent" },
    });

    if (service) {
      await prisma.service.update({
        where: { id: service.id },
        data: {
          name: "Traditional Khaima & Guest Room",
          nameAr: "غرفة ضيافة وخيمة تقليدية",
          slug: "djenane-malek-room",
          description: "Experience authentic Timimoun hospitality in our traditional guest rooms and Khaima tents, featuring air conditioning, Wi-Fi, and beautiful views of the Palmeraie.",
          descriptionAr: "عش كرم الضيافة التيميمونية الأصيلة في غرفنا التقليدية والخيم الصحراوية (الخيمة). مجهزة بمكيف هواء، إنترنت، وإطلالات بانورامية على واحة النخيل العريقة.",
          price: 6500,
          capacity: 2,
          type: "ROOM",
        }
      });

      await prisma.serviceImage.deleteMany({
        where: { serviceId: service.id }
      });

      // Saharan traditional architecture image
      await prisma.serviceImage.create({
        data: {
          serviceId: service.id,
          url: "https://images.unsplash.com/photo-1542314831-c6a4d14effea?auto=format&fit=crop&q=80&w=1000",
          isPrimary: true
        }
      });
      console.log("Updated service Djenane Malek Room!");
    }
  }

  console.log("Djenane Malek update complete.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
