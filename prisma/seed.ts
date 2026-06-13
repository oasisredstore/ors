/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

// Manual env loading to avoid dotenvx interference
const path = require("path");
const fs = require("fs");
const envFile = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
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
    if (!(key in process.env)) process.env[key] = value;
  }
}

const dbUrl =
  process.env.DATABASE_URL ??
  `file://${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;

console.log("Using DB URL:", dbUrl);

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });


function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

async function main() {
  console.log("🌱 Seeding RedOasisArtisan database with Timimoun/Gourara data...\n");

  // ─── Clear existing data ────────────────────────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.artisan.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data");

  // ─── Admin ──────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      firstName: "Platform",
      lastName: "Admin",
      email: "admin@redoasisartisan.dz",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "+213 49 30 32 54",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categoryData = [
    { name: "Pottery & Ceramics", nameAr: "الفخار والسيراميك", emoji: "🏺", desc: "Traditional Saharan clay pottery and decorative ceramics from Timimoun" },
    { name: "Textiles & Weaving", nameAr: "النسيج والحياكة", emoji: "🧵", desc: "Hand-woven fabrics, rugs, and traditional Zenete textiles from Gourara" },
    { name: "Palm Crafts", nameAr: "حرف النخيل", emoji: "🌴", desc: "Handmade baskets, mats, and decorations from date-palm leaves" },
    { name: "Jewelry & Accessories", nameAr: "المجوهرات والإكسسوارات", emoji: "💍", desc: "Traditional Tuareg and Saharan silver and copper jewelry" },
    { name: "Woodwork", nameAr: "الأعمال الخشبية", emoji: "🪵", desc: "Carved wooden decorations and furniture from local date-palm wood" },
    { name: "Traditional Clothing", nameAr: "الملابس التقليدية", emoji: "👘", desc: "Traditional Saharan robes, chechs, and ceremonial garments" },
    { name: "Home Decor", nameAr: "ديكور المنزل", emoji: "🏠", desc: "Decorative items, paintings, and sand art representing Gourara heritage" },
    { name: "Leather Goods", nameAr: "منتجات الجلد", emoji: "👜", desc: "Hand-crafted leather bags, babouches, and desert accessories" },
  ];

  const categories = await Promise.all(
    categoryData.map((cat, i) =>
      prisma.category.create({
        data: {
          name: cat.name,
          nameAr: cat.nameAr,
          slug: slugify(cat.name),
          description: cat.desc,
          imageUrl: cat.emoji,
          sortOrder: i,
          isActive: true,
        },
      })
    )
  );
  console.log(`✅ ${categories.length} categories created`);

  // ─── Artisans ───────────────────────────────────────────────────────────────
  const artisanData = [
    {
      firstName: "Nour El Houda",
      lastName: "Kadiri",
      email: "norelhouda@redoasisartisan.dz",
      shopName: "Atelier Tigurarin (ورشة تيغورارين)",
      slug: "atelier-tigurarin",
      specialization: "Zenete Weaving & Natural Dyeing (النسيج الزناتي والصباغة النباتية)",
      location: "Timimoun, Gourara, Algeria",
      bio: "Nour El Houda Kadiri is a master weaver and the director of Atelier Tigurarin in Timimoun. Founded in 2006 under the ADEAFA association, the workshop specializes in preserving the ancient Zenete weaving heritage of the Gourara region. Nour El Houda has spent decades reviving 100% natural wool textiles, using traditional vertical looms and dyes extracted from local Saharan plants like henna, madder, and indigo.",
      bioAr: "نور الهدى قادري هي رئيسة ورشة تيغورارين في تيميمون. تأسست الورشة عام 2006 تحت رعاية جمعية ADEAFA، وتتخصص في الحفاظ على تراث النسيج الزناتي القديم لمنطقة قورارة. كرست نور الهدى عقوداً لإحياء المنسوجات الصوفية الطبيعية 100%، باستخدام الأنوال العمودية التقليدية والأصباغ المستخرجة من النباتات الصحراوية المحلية مثل الحناء والفوة والنيلة.",
      whatsapp: "+213697744200",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    },
    {
      firstName: "Zohra",
      lastName: "Moulay Lakhdar",
      email: "zohra@redoasisartisan.dz",
      shopName: "Gourara Pottery Art (فن فخار قورارة)",
      slug: "gourara-pottery-art",
      specialization: "Traditional Painted Pottery (الفخار التقليدي المرسوم)",
      location: "Timimoun, Gourara, Algeria",
      bio: "Zohra Moulay Lakhdar is a self-taught pottery artist based in Timimoun, Gourara. She is highly celebrated for decorating traditional clay pottery with ancestral Berber and Saharan geometric motifs. Her work often illustrates local landmarks, such as the marabouts, the Sudan gate, and oasis scenes (palms, camel caravans, and foggara irrigation systems), showcasing the cultural heritage of the desert.",
      bioAr: "زهرة مولاي لخضر هي فنانة فخار عصامية تقيم في تيميمون بقورارة. تشتهر بزخرفة الفخار الطيني التقليدي بالزخارف الهندسية الأمازيغية والصحراوية الموروثة. يصور عملها غالباً معالم محلية، مثل الأضرحة وبوابة السودان ومشاهد الواحات (النخيل وقوافل الجمال وأنظمة ري الفقارة)، مما يعرض التراث الثقافي للصحراء.",
      whatsapp: "+21349303254",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=800&auto=format&fit=crop",
    },
    {
      firstName: "Mohamed",
      lastName: "Bahidi",
      email: "mohamed@redoasisartisan.dz",
      shopName: "Saharan Palm Woodcraft (حرف خشب النخيل الصحراوي)",
      slug: "saharan-palm-woodcraft",
      specialization: "Palm Wood Carving (النحت على خشب النخيل)",
      location: "Adrar, Gourara, Algeria",
      bio: "Mohamed Bahidi is an acclaimed wood carver from the Adrar-Gourara region. He specializes in transforming the fibrous, dense wood of dry date palms into beautiful, functional home decor and utensils. His craft is highly demanding, requiring custom tools to shape the irregular palm wood, and his designs are heavily inspired by Saharan architecture and oasis patterns.",
      bioAr: "محمد باهيدي هو نحات خشب مشهور من منطقة أدرار وقورارة. يتخصص في تحويل الخشب الليفي والكثيف لأشجار نخيل التمر الجافة إلى قطع ديكور منزلي وأواني جميلة وعملية. تتطلب حرفته مهارة عالية وأدوات مخصصة لتشكيل خشب النخيل غير المنتظم، وتستوحي تصميماته بشكل كبير من الهندسة المعمارية الصحراوية وأنماط الواحات.",
      whatsapp: "+213661234567",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    },
    {
      firstName: "Abdelati",
      lastName: "Achar",
      email: "abdelati@redoasisartisan.dz",
      shopName: "Gourara Sand Art (فن الرمل قورارة)",
      slug: "gourara-sand-art",
      specialization: "Saharan Sand Collage (الرسم بالرمل الصحراوي)",
      location: "Timimoun, Gourara, Algeria",
      bio: "Abdelati Achar is a pioneer of saharan sand painting (sand collage) in Timimoun. Born in 1953, he uses natural sands of varying shades (ochre, red, beige, white) collected from the Gourara dunes to create detailed textured paintings. His artwork depicts local life, including the traditional foggara irrigation channels, caravans, and ancient ksours, bringing the desert landscape to life.",
      bioAr: "عبد العاطي عشار هو رائد الرسم بالرمل الصحراوي في تيميمون. ولد عام 1953، ويستخدم الرمال الطبيعية ذات الظلال المختلفة (الخرب، الأحمر، البيج، الأبيض) التي يجمعها من كثبان قورارة لإنشاء لوحات محددة الملمس. يصور عمله الفني الحياة المحلية، بما في ذلك قنوات ري الفقارة التقليدية، القوافل، والقصور القديمة، مما يحيي المناظر الطبيعية للصحراء.",
      whatsapp: "+21349303254",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?q=80&w=800&auto=format&fit=crop",
    },
    {
      firstName: "Abderrahmane",
      lastName: "Zahar",
      email: "abderrahmane@redoasisartisan.dz",
      shopName: "Saharan Fine Arts (الفنون الجميلة الصحراوية)",
      slug: "saharan-fine-arts",
      specialization: "Saharo-Berber Paintings (اللوحات الصحراوية الأمازيغية)",
      location: "Timimoun, Gourara, Algeria",
      bio: "Abderrahmane Zahar, born in 1970 in Timimoun, is a graduate of the School of Fine Arts of Mostaganem. He is a prominent painter and art teacher in Timimoun, whose paintings capture the vibrant spirit, architecture, and folklore of the Gourara. His oil and acrylic paintings showcase the unique red mud architecture of ksours and scenes from local cultural festivals.",
      bioAr: "عبد الرحمن زهار، ولد عام 1970 في تيميمون، وهو خريج مدرسة الفنون الجميلة بمستغانم. هو رسام بارز ومعلم رسم في تيميمون، تلتقط لوحاته الروح النابضة بالحياة والمعمار والفولكلور لمنطقة قورارة. تعرض لوحاته الزيتية والأكريليك العمارة الطينية الحمراء الفريدة للقصور ومشاهد من المهرجانات الثقافية المحلية.",
      whatsapp: "+21349303254",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    },
    {
      firstName: "Fatima",
      lastName: "Bensenouci",
      email: "fatima.b@redoasisartisan.dz",
      shopName: "Tin Habib Artisanal Collective (مجموعة تين حبيب الحرفية)",
      slug: "tin-habib-artisanal-collective",
      specialization: "Traditional Basketry & Jewelry (السلال والمجوهرات التقليدية)",
      location: "Ksar of Timimoun, Gourara, Algeria",
      bio: "Fatima Bensenouci leads the Tin Habib Artisanal Collective, a group of female weavers and metalworkers based in the historic Ksar of Timimoun. The collective is renowned for keeping the heritage of date-palm basketry (Tadara, Tebeg) and traditional Saharan silver and copper jewelry alive. All products are handmade in their community workshop using locally sourced palm fronds and pure silver.",
      bioAr: "تقود فاطمة بن سنوسي مجموعة تين حبيب الحرفية، وهي مجموعة من الحرفيات وصانعات المعادن ومقرهن قصر تيميمون التاريخي. تشتهر المجموعة بالحفاظ على تراث صناعة السلال من سعف النخيل (تادارة، تبيق) والمجوهرات الفضية والنحاسية الصحراوية التقليدية. تصنع جميع المنتجات يدوياً في ورشتهم المجتمعية باستخدام سعف النخيل المحلي والفضة النقية.",
      whatsapp: "+213542753461",
      avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const artisanHash = await bcrypt.hash("artisan123", 12);
  const artisans = [];

  for (const data of artisanData) {
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: artisanHash,
        role: "ARTISAN",
        phone: data.whatsapp,
        artisan: {
          create: {
            shopName: data.shopName,
            slug: data.slug,
            specialization: data.specialization,
            location: data.location,
            bio: data.bio,
            bioAr: data.bioAr,
            avatarUrl: data.avatarUrl,
            coverUrl: data.coverUrl,
            whatsapp: data.whatsapp,
            email: data.email,
            isApproved: true,
            isActive: true,
          },
        },
      },
      include: { artisan: true },
    });
    artisans.push(user.artisan!);
  }
  console.log(`✅ ${artisans.length} artisans created`);

  // Get categories for product association
  const catPottery = categories.find((c) => c.slug === "pottery-ceramics")!;
  const catTextiles = categories.find((c) => c.slug === "textiles-weaving")!;
  const catPalm = categories.find((c) => c.slug === "palm-crafts")!;
  const catJewelry = categories.find((c) => c.slug === "jewelry-accessories")!;
  const catWood = categories.find((c) => c.slug === "woodwork")!;
  const catClothing = categories.find((c) => c.slug === "traditional-clothing")!;
  const catDecor = categories.find((c) => c.slug === "home-decor")!;
  const catLeather = categories.find((c) => c.slug === "leather-goods")!;

  // Map artisans by slug for easy lookups
  const artTigurarin = artisans.find((a) => a.slug === "atelier-tigurarin")!;
  const artPottery = artisans.find((a) => a.slug === "gourara-pottery-art")!;
  const artWood = artisans.find((a) => a.slug === "saharan-palm-woodcraft")!;
  const artSand = artisans.find((a) => a.slug === "gourara-sand-art")!;
  const artFineArts = artisans.find((a) => a.slug === "saharan-fine-arts")!;
  const artTinHabib = artisans.find((a) => a.slug === "tin-habib-artisanal-collective")!;

  // ─── Products ───────────────────────────────────────────────────────────────
  const productData = [
    {
      artisanId: artTigurarin.id,
      categoryId: catTextiles.id,
      name: "Fatiss Carpet of Tinerkouk (Tegemilt)",
      nameAr: "السجادة الفاتيس من تنيركوك (تاجميلت)",
      description: "This authentic Fatiss carpet is hand-woven by the weavers of the Gourara region, following ancient Zenete patterns. It features beautiful geometric symbols (diamonds, chevrons, and Berber crosses) representing protection and fertility. Made from 100% natural wool, it is colored using vegetable dyes extracted from local plants such as henna (orange), madder root (deep red), and indigo (deep blue). Each carpet represents weeks of meticulous hand-weaving on a traditional vertical loom.",
      descriptionAr: "هذه السجادة الفاتيس الأصيلة منسوجة يدوياً من قبل نساجات منطقة قورارة، باتباع أنماط زناتية قديمة. تتميز برموز هندسية جميلة (معينات، شارات، وصلبان أمازيغية) تمثل الحماية والخصوبة. مصنوعة من الصوف الطبيعي 100%، وملونة باستخدام أصباغ نباتية مستخرجة من النباتات المحلية مثل الحناء (البرتقالي)، وجذور الفوة (الأحمر الداكن)، والنيلة (الأزرق الداكن). تمثل كل سجادة أسابيع من النسيج اليدوي الدقيق على نول عمودي تقليدي.",
      price: 32000,
      stockQty: 3,
      material: "100% Natural Wool, Vegetable Dyes",
      dimensions: "180cm × 120cm",
      origin: "Tinerkouk, Gourara, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catPalm.id,
      name: "Traditional Date-Palm Tadara Plate",
      nameAr: "صحن التادارة التقليدي من سعف النخيل",
      description: "The Tadara is a traditional, conical covered container crafted from dried date palm fronds. Widely used in the Gourara oases, it serves both a functional purpose (keeping food warm and protecting it from desert sand) and an aesthetic one. The fibers are dyed with natural desert pigments and hand-braided using a tight spiral technique. It represents the age-old connection between the oasis ecosystem and local Saharan household crafts.",
      descriptionAr: "التادارة هي حاوية مخروطية مغطاة تقليدية مصنوعة من سعف نخيل التمر المجفف. تستخدم على نطاق واسع في واحات قورارة، وتخدم غرضاً وظيفياً (حفظ الطعام دافئاً وحمايته من رمال الصحراء) وجمالياً في نفس الوقت. الألياف مصبوغة بأصباغ صحراوية طبيعية ومضفرة يدوياً باستخدام تقنية لولبية ضيقة. إنها تمثل العلاقة الأزلية بين نظام الواحات البيئي والحرف المنزلية الصحراوية المحلية.",
      price: 4200,
      stockQty: 15,
      material: "Date-palm fronds, natural desert dyes",
      dimensions: "45cm diameter, 30cm height",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1590736969955-71cb54857544?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catJewelry.id,
      name: "Traditional Engraved Silver Bracelet (Dara)",
      nameAr: "سوار فضي منقوش تقليدي (دارة)",
      description: "This heavy silver cuff bracelet, known locally as Dara, is hand-engraved with geometric Berber motifs. Crafted in pure sterling silver by the metalworkers of the Tin Habib Collective, it features traditional Saharan patterns of protection and heritage. Each piece is shaped, hammered, and meticulously carved by hand, embodying the timeless spirit of Saharan silversmithing.",
      descriptionAr: "هذا السوار الفضي العريض الثقيل، المعروف محلياً باسم دارة، منقوش يدوياً بزخارف هندسية أمازيغية. تمت صناعته من الفضة الخالصة بواسطة حرفيي مجموعة تين حبيب، ويتميز بالأنماط الصحراوية التقليدية للحماية والتراث. يتم تشكيل كل قطعة ومطرقتها ونحتها بدقة يدوياً، مما يجسد الروح الأبدية لصياغة الفضة الصحراوية.",
      price: 18500,
      stockQty: 5,
      material: "925 Sterling Silver",
      dimensions: "6.5cm diameter, 4cm width",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artPottery.id,
      categoryId: catPottery.id,
      name: "Traditional Red Clay Water Jar (Barrad)",
      nameAr: "جرة الماء التقليدية من الطين الأحمر (براد)",
      description: "A traditional water container made of porous red Gourara clay. The natural properties of the clay allow water to evaporate slightly through the walls, cooling the water inside naturally — a vital technology for desert survival. It is hand-built using the coil technique without a potter's wheel, sun-dried, and wood-fired. Zohra Moulay Lakhdar hand-paints it with organic black pigments representing desert symbols and ancient rock carvings.",
      descriptionAr: "وعاء ماء تقليدي مصنوع من طين قورارة الأحمر المسامي. تسمح الخصائص الطبيعية للطين بتبخر الماء قليلاً عبر الجدران، مما يبرد الماء بداخله بشكل طبيعي - وهي تقنية حيوية للبقاء في الصحراء. يتم بناؤه يدوياً باستخدام تقنية الحبال بدون عجلة فخار، ويجفف في الشمس ويخبز بالخشب. تقوم زهرة مولاي لخضر برسمه يدوياً بأصباغ سوداء عضوية تمثل الرموز الصحراوية والنقوش الصخرية القديمة.",
      price: 6800,
      stockQty: 8,
      material: "Porous Gourara Clay, natural black mineral pigment",
      dimensions: "35cm height, 22cm diameter",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catLeather.id,
      name: "Hand-Stitched Saharan Leather Babouches",
      nameAr: "بلغة جلدية صحراوية مخيطة يدوياً",
      description: "Traditional Saharan babouches (slippers) handcrafted from locally tanned goat and camel leather. The leather is treated using natural pomegranate rind and acacia bark, yielding a soft and durable finish. Hand-stitched with waxed linen thread and decorated with subtle Saharan geometric patterns, these slippers combine comfort, durability, and traditional desert style.",
      descriptionAr: "بلغة صحراوية تقليدية (خف) مصنوعة يدوياً من جلد الماعز والجمال المدبوغ محلياً. يتم معالجة الجلد باستخدام قشر الرمان الطبيعي ولحاء الأكاسيا، مما يعطي ملمساً ناعماً ومتيناً. مخيطة يدوياً بخيط الكتان المشمع ومزينة بأنماط هندسية صحراوية خفيفة، تجمع هذه الأخفاف بين الراحة والمتانة والأسلوب الصحراوي التقليدي.",
      price: 4900,
      stockQty: 20,
      material: "Locally tanned goat leather, camel leather sole",
      dimensions: "Standard sizes (38-44)",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
      isFeatured: false,
    },
    {
      artisanId: artTigurarin.id,
      categoryId: catClothing.id,
      name: "Hand-Woven Natural Wool Chech (Turban)",
      nameAr: "شاش من الصوف الطبيعي المنسوج يدوياً",
      description: "This traditional Saharan chech (turban/shawl) is hand-woven by the artisans of Atelier Tigurarin. Made from ultra-fine, hand-spun sheep wool, it offers excellent insulation against both desert heat and winter cold. The textile is dyed using natural henna and wild indigo, producing unique earth-tone gradients. It is an essential item for desert travelers and a symbol of Saharan identity.",
      descriptionAr: "هذا الشاش الصحراوي التقليدي (عمامة / شال) منسوج يدوياً من قبل حرفيات ورشة تيغورارين. مصنوع من صوف الغنم الناعم للغاية والمغزول يدوياً، ويوفر عزلًا ممتازاً ضد حرارة الصحراء وبرد الشتاء. النسيج مصبوغ بالحناء الطبيعية والنيلة البرية، مما ينتج تدرجات ألوان ترابية فريدة. إنه عنصر أساسي لرحالة الصحراء ورمز للهوية الصحراوية.",
      price: 8500,
      stockQty: 12,
      material: "100% Hand-spun sheep wool, natural vegetable dyes",
      dimensions: "250cm × 60cm",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=600&auto=format&fit=crop",
      isFeatured: false,
    },
    {
      artisanId: artWood.id,
      categoryId: catWood.id,
      name: "Carved Date-Palm Wood Bowl",
      nameAr: "وعاء منحوت من خشب نخيل التمر",
      description: "This rustic decorative bowl is hand-carved from the heartwood of dry date palm trees. Mohamed Bahidi meticulously cures and shapes the fibrous palm wood to reveal its beautiful, contrasting dark and light grain patterns. The exterior features hand-chiselled geometric patterns inspired by the traditional layout of the Gourara ksours. Finished with natural beeswax to protect the wood and highlight its texture.",
      descriptionAr: "هذا الوعاء الزخرفي الريفي منحوت يدوياً من خشب قلب أشجار نخيل التمر الجافة. يقوم محمد باهيدي بمعالجة وتشكيل خشب النخيل الليفي بدقة للكشف عن أنماط حبيباته الخشبية الداكنة والفاتحة المتباينة الجميلة. يتميز الجزء الخارجي بأنماط هندسية منحوتة يدوياً مستوحاة من التخطيط التقليدي لقصور قورارة. مدهون بشمع النحل الطبيعي لحماية الخشب وإبراز ملمسه.",
      price: 5800,
      stockQty: 6,
      material: "Dry date-palm heartwood, natural beeswax finish",
      dimensions: "30cm diameter, 12cm height",
      origin: "Adrar, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop",
      isFeatured: false,
    },
    {
      artisanId: artSand.id,
      categoryId: catDecor.id,
      name: "Foggara Irrigation System Sand Collage",
      nameAr: "لوحة رملية لنظام ري الفقارة",
      description: "An authentic sand collage painting created by master artist Abdelati Achar. The artwork depicts the ingenious traditional foggara irrigation system of the Timimoun oasis. It is made entirely with natural, untreated sands of various colors (beige, gold, red, dark brown) collected from different desert dunes of the Gourara. The sand is fixed on a wooden panel, creating a textured relief that captures the warmth of the Sahara.",
      descriptionAr: "لوحة رملية أصيلة أبدعها الفنان الماهر عبد العاطي عشار. يصور العمل الفني نظام ري الفقارة التقليدي البارع لواحة تيميمون. وهي مصنوعة بالكامل من الرمال الطبيعية غير المعالجة بألوان مختلفة (البيج، الذهبي، الأحمر، البني الداكن) التي تم جمعها من كثبان رملية مختلفة في قورارة. يتم تثبيت الرمل على لوح خشبي، مما يخلق تضاريس ملموسة تلتقط دفء الصحراء.",
      price: 12500,
      stockQty: 4,
      material: "Natural Saharan sand, adhesive, wood panel",
      dimensions: "50cm × 40cm",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artFineArts.id,
      categoryId: catDecor.id,
      name: "Red Oasis Sunset Canvas Painting",
      nameAr: "لوحة قماشية لغروب الواحة الحمراء",
      description: "An oil painting on canvas by Timimoun artist Abderrahmane Zahar. This piece captures the sunset glowing over the red clay architecture of the Timimoun ksar, reflecting the famous 'Oasis Rouge' aesthetics. The painting blends traditional Saharan hues with a modern expressionist touch, highlighting the dramatic shadows and warm light of the desert dusk.",
      descriptionAr: "لوحة زيتية على قماش بريشة فنان تيميمون عبد الرحمن زهار. تلتقط هذه القطعة توهج غروب الشمس فوق العمارة الطينية الحمراء لقصر تيميمون، مما يعكس جماليات 'الواحة الحمراء' الشهيرة. تمزج اللوحة بين التدرجات الصحراوية التقليدية ولمسة تعبيرية حديثة، مما يبرز الظلال الدرامية والضوء الدافئ لغسق الصحراء.",
      price: 24000,
      stockQty: 2,
      material: "Oil paint, cotton canvas, wooden frame",
      dimensions: "60cm × 80cm",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catPalm.id,
      name: "Handwoven Palm Leaf Fan (Marwaha)",
      nameAr: "مروحة سعف النخيل المنسوجة يدوياً (مروحة)",
      description: "A traditional desert hand fan woven from young, flexible date-palm leaves. Crafted by the women of the Tin Habib Collective, it is used for cooling and as a decorative wall hanging. It features natural ochre borders and intricate braiding, making it both a highly functional hot-season utility and a beautiful example of Saharan folk art.",
      descriptionAr: "مروحة يدوية صحراوية تقليدية منسوجة من سعف نخيل التمر الفتي والمرن. صنعتها نساء مجموعة تين حبيب، وتستخدم للتبريد وكتعليق حائط زخرفي. تتميز بحواف طبيعية ذات لون مغرة وضفائر معقدة، مما يجعلها أداة عملية لموسم الحر ومثالاً جميلاً للفن الشعبي الصحراوي.",
      price: 1500,
      stockQty: 40,
      material: "Date-palm leaves, natural organic dyes",
      dimensions: "40cm length (with handle)",
      origin: "Timimoun, Algeria",
      imageUrl: "https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=600&auto=format&fit=crop",
      isFeatured: false,
    },
  ];

  const products = [];
  for (const productItem of productData) {
    const { imageUrl, ...rest } = productItem;
    const product = await prisma.product.create({
      data: {
        ...rest,
        slug: slugify(productItem.name),
        isPublished: true,
        images: {
          create: [
            {
              url: imageUrl,
              altText: productItem.name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });
    products.push(product);
  }
  console.log(`✅ ${products.length} products created`);

  // ─── Customer ───────────────────────────────────────────────────────────────
  const customerHash = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.create({
    data: {
      firstName: "Youcef",
      lastName: "Hadid",
      email: "customer@redoasisartisan.dz",
      passwordHash: customerHash,
      role: "CUSTOMER",
      phone: "+213 661 234 567",
      addresses: {
        create: {
          fullName: "Youcef Hadid",
          phone: "+213 661 234 567",
          wilaya: "Adrar",
          city: "Timimoun",
          street: "Igasten Deldoul",
          postalCode: "01001",
          isDefault: true,
        },
      },
    },
    include: { addresses: true },
  });
  console.log("✅ Customer created:", customer.email);

  // ─── Sample Order ────────────────────────────────────────────────────────────
  const sampleOrder = await prisma.order.create({
    data: {
      userId: customer.id,
      addressId: customer.addresses[0].id,
      status: "DELIVERED",
      totalAmount: products[0].price * 1 + products[1].price * 2,
      notes: "Please deliver carefully to Igasten, Timimoun.",
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: products[0].price,
            subtotal: products[0].price,
          },
          {
            productId: products[1].id,
            quantity: 2,
            unitPrice: products[1].price,
            subtotal: products[1].price * 2,
          },
        ],
      },
      payment: {
        create: {
          method: "CASH_ON_DELIVERY",
          status: "PAID",
        },
      },
    },
  });

  // ─── Reviews ────────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: products[0].id,
        rating: 5,
        comment: "Absolutely breathtaking Zenete design! The natural dyes give it a gorgeous warm glow that feels authentic and premium.",
        isVisible: true,
      },
      {
        userId: customer.id,
        productId: products[1].id,
        rating: 5,
        comment: "Beautiful hand-braided Tadara! Perfect for serving traditional bread and looks wonderful in my dining room.",
        isVisible: true,
      },
    ],
  });

  console.log("✅ Sample order and reviews created");

  console.log("\n" + "═".repeat(50));
  console.log("🎉 Seeding complete!\n");
  console.log("📋 Verified Accounts:");
  console.log("─".repeat(50));
  console.log("👑 Admin:    admin@redoasisartisan.dz / admin123");
  console.log("🏺 Artisan:  norelhouda@redoasisartisan.dz / artisan123");
  console.log("🏺 Artisan:  zohra@redoasisartisan.dz / artisan123");
  console.log("🏺 Artisan:  mohammed@redoasisartisan.dz / artisan123");
  console.log("🏺 Artisan:  abdelati@redoasisartisan.dz / artisan123");
  console.log("🏺 Artisan:  abderrahmane@redoasisartisan.dz / artisan123");
  console.log("🏺 Artisan:  fatima.b@redoasisartisan.dz / artisan123");
  console.log("🛒 Customer: customer@redoasisartisan.dz / customer123");
  console.log("─".repeat(50));
  console.log(`📦 ${products.length} products, ${categories.length} categories, ${artisans.length} artisans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
