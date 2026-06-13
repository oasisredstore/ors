import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

const brainDir = "C:\\Users\\2H\\.gemini\\antigravity\\brain\\59823fd0-2b54-4165-8e51-c4dd181abbab";
const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbUrl = `file:///${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const mapping = {
  "fatiss_carpet": "Fatiss Carpet of Tinerkouk",
  "tadara_plate": "Traditional Date-Palm Tadara Plate",
  "silver_bracelet": "Traditional Engraved Silver Bracelet (Dara)",
  "clay_jar": "Traditional Red Clay Water Jar (Barrad)",
  "leather_babouches": "Hand-Stitched Saharan Leather Babouches",
  "wool_chech": "Hand-Woven Natural Wool Chech (Turban)",
  "wood_bowl": "Carved Date-Palm Wood Bowl",
  "sand_collage": "Foggara Irrigation System Sand Collage",
  "sunset_painting": "Red Oasis Sunset Canvas Painting",
  "palm_fan": "Handwoven Palm Leaf Fan (Marwaha)"
};

async function run() {
  const files = fs.readdirSync(brainDir).filter(f => f.endsWith(".png"));

  for (const [prefix, productName] of Object.entries(mapping)) {
    const file = files.find(f => f.startsWith(prefix));
    if (file) {
      const srcPath = path.join(brainDir, file);
      const destName = file.split('_').slice(0, -1).join('_') + '.png'; // removes timestamp
      const destPath = path.join(uploadsDir, destName);
      
      fs.copyFileSync(srcPath, destPath);
      const dbUrlPath = `/uploads/products/${destName}`;
      
      // Update DB
      const product = await prisma.product.findFirst({ where: { name: { contains: productName } } });
      if (product) {
        await prisma.productImage.deleteMany({ where: { productId: product.id } });
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: dbUrlPath,
            isPrimary: true,
            sortOrder: 0
          }
        });
        console.log(`Updated ${productName} -> ${dbUrlPath}`);
      } else {
         console.log(`Could not find product for: ${productName}`);
      }
    } else {
       console.log(`Could not find artifact image for: ${prefix}`);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
