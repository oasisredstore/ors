process.env.DATABASE_URL = "libsql://redoasis-db-redoasisstore.aws-us-east-1.turso.io";
process.env.TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODEzODA5OTIsImlkIjoiMDE5ZWMwZmItODQwMS03MGJkLTlkNWQtNGIwYjkwYzUxY2YzIiwicmlkIjoiYjMxYTVhMGYtOWEyNC00YzhiLWEwN2EtYjY1MGQxMmVmZWRlIn0.TUomsb3HZm3sUWElWnPq_HLFujFUfaycItEXSQrMQ592DeasH3ArEx9W2SVAUnqiOV1aIZhp1lLX--3L0PgEAw";

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding services using Prisma...");

  const user1 = await prisma.user.create({
    data: {
      email: "hotel" + Date.now() + "@example.com",
      passwordHash: "hash",
      firstName: "Hotel",
      lastName: "Manager",
      role: "HOTEL"
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: "guide" + Date.now() + "@example.com",
      passwordHash: "hash",
      firstName: "Desert",
      lastName: "Guide",
      role: "GUIDE"
    }
  });

  // Create a Hotel Provider
  await prisma.serviceProvider.upsert({
    where: { slug: "timimoun-palace" },
    update: { userId: user1.id },
    create: {
      userId: user1.id,
      businessName: "Timimoun Palace Hotel",
      slug: "timimoun-palace",
      description: "A luxury stay in the heart of Timimoun Oasis.",
      descriptionAr: "إقامة فاخرة في قلب واحة تيميمون الساحرة.",
      location: "Timimoun Center",
      isApproved: true,
      services: {
        create: [
          {
            type: "ROOM",
            name: "Royal Oasis Suite",
            nameAr: "جناح الواحة الملكي",
            slug: "royal-oasis-suite",
            price: 15000,
            capacity: 2,
            isPublished: true,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1542314831-c6a4d140b648?q=80&w=1600", isPrimary: true }
              ]
            }
          },
          {
            type: "GUEST_HOUSE",
            name: "Traditional Kasbah Room",
            nameAr: "غرفة قصبة تقليدية",
            slug: "traditional-kasbah-room",
            price: 8000,
            capacity: 3,
            isPublished: true,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600", isPrimary: true }
              ]
            }
          }
        ]
      }
    }
  });

  // Create a Tour Guide Provider
  await prisma.serviceProvider.upsert({
    where: { slug: "sahara-adventures" },
    update: { userId: user2.id },
    create: {
      userId: user2.id,
      businessName: "Sahara Adventures",
      slug: "sahara-adventures",
      description: "Experience the magic of the Grand Erg Occidental.",
      descriptionAr: "اكتشف سحر العرق الغربي الكبير مع مرشدين محليين.",
      location: "Timimoun Desert",
      isApproved: true,
      services: {
        create: [
          {
            type: "TOUR",
            name: "Sunset Camel Trek",
            nameAr: "جولة غروب الشمس على الجمال",
            slug: "sunset-camel-trek",
            price: 3000,
            capacity: 10,
            isPublished: true,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1549480017-d76466a4b8e8?q=80&w=1600", isPrimary: true }
              ]
            }
          },
          {
            type: "TOUR",
            name: "4x4 Oasis Expedition",
            nameAr: "رحلة سفاري بالسيارات الرباعية",
            slug: "4x4-oasis-expedition",
            price: 12000,
            capacity: 4,
            isPublished: true,
            images: {
              create: [
                { url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1600", isPrimary: true }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Services seeded successfully via Prisma!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
