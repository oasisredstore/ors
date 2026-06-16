const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Updating broken images...");
  
  // Update services
  await prisma.serviceImage.updateMany({
    where: { url: { contains: "1549480017-d76466a4b8e8" } },
    data: { url: "/images/timimoun/timimoun_oasis_sunset.webp" }
  });
  
  await prisma.serviceImage.updateMany({
    where: { url: { contains: "1582719471384-894fbbaff0f0" } },
    data: { url: "/images/timimoun/timimoun_ksar_architecture.webp" }
  });

  // Update products
  await prisma.productImage.updateMany({
    where: { url: { contains: "1606760227091" } },
    data: { url: "/images/products/fatiss_carpet.png" }
  });
  
  await prisma.productImage.updateMany({
    where: { url: { contains: "1544816155105" } },
    data: { url: "/images/products/barrad_jar.png" }
  });
  
  await prisma.productImage.updateMany({
    where: { url: { contains: "1513519245088" } },
    data: { url: "/images/products/sand_collage.png" }
  });

  // Update artisan
  await prisma.artisan.updateMany({
    where: { storeName: "Gourara Sand Art" },
    data: {
      profileImage: "/images/products/sand_collage.png",
      coverImage: "/images/timimoun/timimoun_oasis_sunset.webp"
    }
  });

  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
