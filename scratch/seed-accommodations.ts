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
  console.log("Seeding accommodations...");

  // Let's create users for the providers if they don't exist
  const createProviderUser = async (email: string, firstName: string, lastName: string) => {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          role: "HOTEL",
          passwordHash: "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        }
      });
    }
    return user;
  };

  const u1 = await createProviderUser("ksar@redoasis.com", "Ksar", "Ennakhil");
  const u2 = await createProviderUser("sunset@redoasis.com", "Desert", "Sunset");
  const u3 = await createProviderUser("camp@redoasis.com", "Tinerkouk", "Camp");

  // Create ServiceProviders
  const p1 = await prisma.serviceProvider.upsert({
    where: { slug: "ksar-ennakhil" },
    update: {},
    create: {
      userId: u1.id,
      businessName: "Ksar Ennakhil Guest House",
      slug: "ksar-ennakhil",
      description: "A beautiful traditional red clay guest house in the oasis of Timimoun, featuring the distinct Sudanese-Saharan style with geometric mud-brick patterns.",
      descriptionAr: "دار ضيافة تقليدية مبنية بالطين الأحمر الجميل في واحة تيميمون، تتميز بالطراز المعماري السوداني الصحراوي والنقوش الهندسية الفريدة.",
      location: "Ouled Said",
      contactEmail: "contact@ksarennakhil.dz",
      contactPhone: "+213 555 123 456",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=KE&backgroundColor=c8965a",
      isApproved: true,
      isActive: true,
    }
  });

  const p2 = await prisma.serviceProvider.upsert({
    where: { slug: "desert-sunset-hotel" },
    update: {},
    create: {
      userId: u2.id,
      businessName: "Desert Sunset Hotel",
      slug: "desert-sunset-hotel",
      description: "A luxurious hotel with traditional Saharan touches, overlooking the red sand dunes of Timimoun.",
      descriptionAr: "فندق فخم بلمسات صحراوية تقليدية، يطل على الكثبان الرملية الحمراء الساحرة لتيميمون.",
      location: "Timimoun",
      contactEmail: "booking@desertsunset.dz",
      contactPhone: "+213 666 987 654",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DS&backgroundColor=d97706",
      isApproved: true,
      isActive: true,
    }
  });

  const p3 = await prisma.serviceProvider.upsert({
    where: { slug: "tinerkouk-golden-camp" },
    update: {},
    create: {
      userId: u3.id,
      businessName: "Tinerkouk Golden Camp",
      slug: "tinerkouk-golden-camp",
      description: "A luxury desert glamping camp nestled in the massive red sand dunes of Tinerkouk near Timimoun.",
      descriptionAr: "مخيم صحراوي فخم (Glamping) يقع وسط الكثبان الرملية الحمراء الشاسعة في تينركوك بالقرب من تيميمون.",
      location: "Tinerkouk",
      contactEmail: "camp@tinerkouk.dz",
      contactPhone: "+213 777 333 222",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=b45309",
      isApproved: true,
      isActive: true,
    }
  });

  // Create Services
  await prisma.service.upsert({
    where: { slug: "traditional-ksar-room" },
    update: {},
    create: {
      providerId: p1.id,
      type: "ROOM",
      name: "Traditional Ksar Room",
      nameAr: "غرفة تقليدية بقصر النخيل",
      slug: "traditional-ksar-room",
      description: "Experience authentic Saharan living in our traditional red-clay rooms. Includes breakfast and oasis views.",
      descriptionAr: "عش تجربة الحياة الصحراوية الأصيلة في غرفنا المبنية بالطين الأحمر. يشمل فطور الصباح وإطلالة على الواحة.",
      price: 8500,
      capacity: 3, // Beds
      isPublished: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        ]
      }
    }
  });

  await prisma.service.upsert({
    where: { slug: "luxury-dune-suite" },
    update: {},
    create: {
      providerId: p2.id,
      type: "ROOM",
      name: "Luxury Dune Suite",
      nameAr: "جناح الكثبان الفاخر",
      slug: "luxury-dune-suite",
      description: "Spacious suite with modern amenities, traditional decor, and a private balcony overlooking the dunes.",
      descriptionAr: "جناح واسع مزود بوسائل الراحة الحديثة والديكور التقليدي، مع شرفة خاصة تطل على الكثبان الرملية.",
      price: 15000,
      capacity: 2, // Beds
      isPublished: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        ]
      }
    }
  });

  await prisma.service.upsert({
    where: { slug: "royal-desert-tent" },
    update: {},
    create: {
      providerId: p3.id,
      type: "TENT",
      name: "Royal Desert Tent",
      nameAr: "خيمة صحراوية ملكية",
      slug: "royal-desert-tent",
      description: "A premium tent under the stars with comfortable beds, private bathroom facilities, and traditional campfire dinners.",
      descriptionAr: "خيمة فخمة تحت النجوم بأسرة مريحة، ومرافق حمام خاصة، وعشاء تقليدي حول نار المخيم.",
      price: 12000,
      capacity: 4, // Beds
      isPublished: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", isPrimary: true },
        ]
      }
    }
  });

  console.log("Successfully seeded accommodations!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
