/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

import path from "path";
import fs from "fs";
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
      process.env[key] = value; // Always override with .env.local if loaded later
    }
  }
};

loadEnv(envFile);
loadEnv(envLocalFile);

const dbUrl =
  process.env.DATABASE_URL ??
  `file://${path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")}`;

console.log("Using DB URL:", dbUrl);

const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});
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
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.serviceReview.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.serviceImage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.serviceProvider.deleteMany();
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
      description: "The Fatiss carpet is a masterpiece of Gourara's Zenete heritage. Hand-woven exclusively by the women of Tinerkouk, this thick, pure wool carpet is historically given as part of a bride's trousseau. It features intricate, ancestral geometric symbols—such as diamonds representing the evil eye's deflection, and chevrons symbolizing water and fertility in the arid Sahara. Colored strictly with natural vegetable dyes (madder root for deep red, indigo for striking blue, and local henna), this carpet is not just a floor covering, but a woven tapestry of desert survival and identity. For tourists and collectors, acquiring a genuine Fatiss supports the preservation of a dying matrilineal art form unique to the Timimoun region.",
      descriptionAr: "سجادة الفاتيس هي تحفة فنية من التراث الزناتي لمنطقة قورارة. تُنسج يدوياً حصرياً من قبل نساء تنيركوك، وتُعد هذه السجادة المصنوعة من الصوف الخالص تاريخياً جزءاً من جهاز العروس. تتميز برموز هندسية عريقة ومعقدة - كالمعينات التي تمثل درء العين الحاسدة، والخطوط المتعرجة التي ترمز للماء والخصوبة في الصحراء القاحلة. تُصبغ بدقة باستخدام أصباغ نباتية طبيعية (جذور الفوة للحصول على الأحمر الداكن، والنيلة للأزرق اللافت، والحناء المحلية). هذه السجادة ليست مجرد غطاء للأرض، بل هي نسيج يحكي قصة البقاء والهوية الصحراوية. بالنسبة للسياح وعشاق التراث، فإن اقتناء سجادة فاتيس أصلية يدعم الحفاظ على فن متوارث عبر الأجيال تنفرد به منطقة تيميمون.",
      price: 32000,
      stockQty: 3,
      material: "100% Natural Wool, Vegetable Dyes",
      dimensions: "180cm × 120cm",
      origin: "Tinerkouk, Gourara, Algeria",
      imageUrl: "/images/products/fatiss_carpet.png",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catPalm.id,
      name: "Traditional Date-Palm Tadara Plate",
      nameAr: "صحن التادارة التقليدي من سعف النخيل",
      description: "The 'Tadara' is the iconic conical covered plate of the Algerian Sahara, deeply tied to the oasis ecosystem. Crafted in Timimoun using the finest sun-dried date-palm fronds, the Tadara is woven using a tight, spiral-coiling technique passed down through generations. Traditionally used to keep homemade bread warm and protect dates and couscous from the relentless desert sand, its shape mimics the dunes of the Grand Erg Occidental. The subtle ochre and brown bands are created using natural mineral dyes. It is a highly sought-after touristic souvenir, offering a sustainable, functional piece of Saharan hospitality that adds a warm, rustic aesthetic to any modern home.",
      descriptionAr: "التادارة هي الطبق المخروطي المغطى الأيقوني للصحراء الجزائرية، والمرتبط ارتباطاً وثيقاً بنظام الواحات البيئي. تُصنع في تيميمون باستخدام أجود سعف نخيل التمر المجفف بالشمس، وتُنسج التادارة باستخدام تقنية اللف الحلزوني المحكم المتوارثة عبر الأجيال. تُستخدم تقليدياً للحفاظ على دفء الخبز المنزلي وحماية التمر والكسكس من رمال الصحراء المتطايرة، ويحاكي شكلها كثبان العرق الغربي الكبير. يتم تشكيل الأشرطة الدقيقة ذات اللون المغري والبني باستخدام أصباغ معدنية طبيعية. تُعد تذكاراً سياحياً مطلوباً بشدة، حيث تقدم قطعة مستدامة وعملية من كرم الضيافة الصحراوية تضفي لمسة ريفية دافئة على أي منزل عصري.",
      price: 4200,
      stockQty: 15,
      material: "Date-palm fronds, natural desert dyes",
      dimensions: "45cm diameter, 30cm height",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/tadara_plate.png",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catJewelry.id,
      name: "Traditional Engraved Silver Bracelet (Dara)",
      nameAr: "سوار فضي منقوش تقليدي (دارة)",
      description: "The 'Dara' is a heavy, robust silver cuff bracelet that carries immense cultural weight in Saharan societies. Historically worn by noble Tuareg and Zenete women, it serves as both a form of portable wealth and a protective talisman. Handcrafted from pure melted sterling silver in the ancient Ksar of Timimoun, it is meticulously chiseled with geometric motifs representing the four cardinal directions, desert dunes, and camel tracks. For visitors, the Dara is not merely a piece of jewelry; it is a wearable piece of history and a statement of the resilient, majestic spirit of the desert nomads.",
      descriptionAr: "السوار الفضي العريض 'الدارة' هو سوار ثقيل وصلب يحمل وزناً ثقافياً هائلاً في المجتمعات الصحراوية. كان يُلبس تاريخياً من قبل نساء الطوارق وزناتة النبيلات، ويُعتبر شكلاً من أشكال الثروة المحمولة وتميمة واقية في نفس الوقت. يُصنع يدوياً من الفضة الخالصة المذابة في قصر تيميمون العتيق، ويُحفر بدقة فائقة بزخارف هندسية تمثل الاتجاهات الأربعة الأصلية، والكثبان الرملية، ومسارات الجمال. بالنسبة للزوار، لا تُعد 'الدارة' مجرد قطعة مجوهرات؛ بل هي قطعة تاريخية يمكن ارتداؤها وتعبيراً عن الروح الصامدة والمهيبة لبدو الصحراء.",
      price: 18500,
      stockQty: 5,
      material: "925 Sterling Silver",
      dimensions: "6.5cm diameter, 4cm width",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/dara_bracelet.png",
      isFeatured: true,
    },
    {
      artisanId: artPottery.id,
      categoryId: catPottery.id,
      name: "Traditional Red Clay Water Jar (Barrad)",
      nameAr: "جرة الماء التقليدية من الطين الأحمر (براد)",
      description: "The 'Barrad' is an ancestral Saharan refrigeration technology. Hand-coiled from the distinctive porous red clay found exclusively in the Gourara basin, it allows water to slowly seep through its walls and evaporate, cooling the contents within naturally—a critical survival tool against the extreme Timimoun heat. This authentic piece is fired in traditional wood kilns and hand-painted with black organic pigments derived from crushed date pits and local minerals. The geometric motifs tell stories of ancient tribal lineages. It stands as a profound symbol of the oasis dwellers' deep connection with earth and water.",
      descriptionAr: "البراد هو تقنية تبريد صحراوية من أسلافنا. يُشكل يدوياً من الطين الأحمر المسامي المميز الذي يتواجد حصرياً في حوض قورارة، مما يسمح للماء بالتسرب ببطء عبر جدرانه والتبخر، مبرداً بذلك محتوياته بشكل طبيعي - وهو أداة بقاء حيوية ضد حرارة تيميمون الشديدة. تُحرق هذه القطعة الأصيلة في أفران خشبية تقليدية وتُطلى يدوياً بأصباغ عضوية سوداء مستخرجة من نوى التمر المسحوق والمعادن المحلية. تروي الزخارف الهندسية قصص الأنساب القبلية القديمة. ويقف البراد كرمز عميق لارتباط سكان الواحات الوثيق بالأرض والماء.",
      price: 6800,
      stockQty: 8,
      material: "Porous Gourara Clay, natural black mineral pigment",
      dimensions: "35cm height, 22cm diameter",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/barrad_jar.png",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catLeather.id,
      name: "Hand-Stitched Saharan Leather Babouches",
      nameAr: "بلغة جلدية صحراوية مخيطة يدوياً",
      description: "These Saharan babouches are the traditional footwear of the Gourara region, designed for supreme comfort and endurance in the harsh desert environment. Crafted from locally sourced camel and goat leather, the hide is naturally tanned using pomegranate rinds and acacia bark in Timimoun's historic tanneries, granting it a warm reddish-brown hue. Each pair is meticulously hand-stitched with waxed linen threads and subtly embroidered with Zenete motifs. Lightweight and breathable, they offer tourists an authentic, highly practical piece of traditional Algerian clothing.",
      descriptionAr: "هذه البلغة الصحراوية هي الحذاء التقليدي لمنطقة قورارة، صُممت لتوفير أقصى درجات الراحة والتحمل في بيئة الصحراء القاسية. تُصنع من جلد الإبل والماعز المحلي، حيث يُدبغ الجلد طبيعياً باستخدام قشور الرمان ولحاء الأكاسيا في مدابغ تيميمون التاريخية، مما يمنحها لوناً بنياً محمراً دافئاً. يُخاط كل زوج يدوياً بعناية فائقة باستخدام خيوط الكتان المشمعة ويُطرز ببراعة بزخارف زناتية. خفيفة الوزن وتسمح بمرور الهواء، لتقدم للسياح قطعة أصيلة وعملية للغاية من اللباس التقليدي الجزائري.",
      price: 4900,
      stockQty: 20,
      material: "Locally tanned goat leather, camel leather sole",
      dimensions: "Standard sizes (38-44)",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/leather_babouches.png",
      isFeatured: false,
    },
    {
      artisanId: artTigurarin.id,
      categoryId: catClothing.id,
      name: "Hand-Woven Natural Wool Chech (Turban)",
      nameAr: "شاش من الصوف الطبيعي المنسوج يدوياً",
      description: "The 'Chech' is the unmistakable emblem of the Saharan man. Woven in Timimoun from ultra-fine, hand-spun sheep's wool, this long fabric serves as critical protection against the scorching sun, blinding sandstorms, and freezing desert nights. This specific Chech features a gradient of natural earthy dyes—indigo blue fading into henna orange—reflecting the colors of the Timimoun sunset over the dunes. For a traveler, wearing an authentic, handmade wool Chech is a rite of passage into the majestic silence of the Grand Erg Occidental.",
      descriptionAr: "الشاش هو الرمز المميز للرجل الصحراوي لا تخطئه العين. يُنسج في تيميمون من صوف الغنم الناعم جداً والمغزول يدوياً، ويعمل هذا القماش الطويل كحماية أساسية ضد الشمس الحارقة، والعواصف الرملية المسببة للعمى، وليالي الصحراء المتجمدة. يتميز هذا الشاش تحديداً بتدرج من الأصباغ الترابية الطبيعية - الأزرق النيلي الذي يتلاشى إلى برتقالي الحناء - مما يعكس ألوان غروب الشمس في تيميمون فوق الكثبان الرملية. بالنسبة للمسافر، فإن ارتداء شاش من الصوف الأصلي المصنوع يدوياً هو طقس عبور نحو الصمت المهيب للعرق الغربي الكبير.",
      price: 8500,
      stockQty: 12,
      material: "100% Hand-spun sheep wool, natural vegetable dyes",
      dimensions: "250cm × 60cm",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/saharan_chech.png",
      isFeatured: false,
    },
    {
      artisanId: artWood.id,
      categoryId: catWood.id,
      name: "Carved Date-Palm Wood Bowl",
      nameAr: "وعاء منحوت من خشب نخيل التمر",
      description: "An extraordinary example of resourcefulness, this rustic bowl is hand-carved from the solid heartwood of a deceased date-palm tree. Palm wood is incredibly dense, fibrous, and notoriously difficult to work with. Artisans in Adrar and Timimoun cure the wood for months before chiseling it into functional art. The exterior is detailed with triangular carvings inspired by the jagged architecture of local 'Ksour' (fortified villages). Polished entirely with natural beeswax, it brings the rugged, resilient beauty of the oasis directly into the modern dining room.",
      descriptionAr: "مثال استثنائي على حسن استغلال الموارد، هذا الوعاء الريفي منحوت يدوياً من خشب القلب الصلب لشجرة نخيل تمر ميتة. خشب النخيل كثيف جداً وليفي، ومعروف بصعوبة العمل به. يقوم الحرفيون في أدرار وتيميمون بمعالجة الخشب لعدة أشهر قبل نحته لتحويله إلى فن عملي. يتميز الجزء الخارجي بنقوش مثلثة مستوحاة من العمارة المسننة لـ 'القصور' المحلية (القرى المحصنة). مصقول بالكامل باستخدام شمع النحل الطبيعي، ليجلب الجمال القاسي والمرن للواحة مباشرة إلى غرفة الطعام العصرية.",
      price: 5800,
      stockQty: 6,
      material: "Dry date-palm heartwood, natural beeswax finish",
      dimensions: "30cm diameter, 12cm height",
      origin: "Adrar, Algeria",
      imageUrl: "/images/products/palm_wood_bowl.png",
      isFeatured: false,
    },
    {
      artisanId: artSand.id,
      categoryId: catDecor.id,
      name: "Foggara Irrigation System Sand Collage",
      nameAr: "لوحة رملية لنظام ري الفقارة",
      description: "Sand collage is an art form entirely unique to the Algerian Sahara. This highly textured piece depicts the 'Foggara'—the ancient, ingenious underground water channels that sustain life in the Timimoun oasis. The artist uses absolutely no paint; every color you see is a different shade of natural, un-dyed sand meticulously collected from various dunes across the Gourara region (ochre, red clay, pale beige, and dark mineral brown). It is a mesmerizing, tactile souvenir that captures the literal soil and soul of the Sahara.",
      descriptionAr: "الرسم بالرمل هو شكل فني فريد تماماً في الصحراء الجزائرية. تصور هذه القطعة ذات الملمس البارز 'الفقارة' - وهي قنوات المياه الجوفية القديمة والبارعة التي تدعم الحياة في واحة تيميمون. لا يستخدم الفنان أي طلاء على الإطلاق؛ فكل لون تراه هو ظل مختلف من الرمل الطبيعي غير المصبوغ الذي تم جمعه بعناية من كثبان مختلفة عبر منطقة قورارة (المغرة، الطين الأحمر، البيج الباهت، والبني المعدني الداكن). إنها تذكار ساحر وملموس يجسد حرفياً تراب وروح الصحراء.",
      price: 12500,
      stockQty: 4,
      material: "Natural Saharan sand, adhesive, wood panel",
      dimensions: "50cm × 40cm",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/sand_collage.png",
      isFeatured: true,
    },
    {
      artisanId: artFineArts.id,
      categoryId: catDecor.id,
      name: "Red Oasis Sunset Canvas Painting",
      nameAr: "لوحة قماشية لغروب الواحة الحمراء",
      description: "Timimoun is universally celebrated as the 'Oasis Rouge' (The Red Oasis) due to its striking Sudanese-style red mud-brick architecture. This exquisite oil painting captures the exact moment the descending Saharan sun hits the Ksar, setting the ancient walls ablaze in hues of crimson, orange, and gold, contrasted against the deep green silhouettes of the sprawling palm grove. Painted by local Timimoun artists, it is a premium piece of fine art that allows tourists to carry the magical warmth and architectural splendor of Gourara back home.",
      descriptionAr: "تُعرف تيميمون عالمياً باسم 'الواحة الحمراء' بفضل هندستها المعمارية المذهلة المبنية من الطوب اللبن الأحمر على الطراز السوداني. تلتقط هذه اللوحة الزيتية الرائعة اللحظة الدقيقة التي تضرب فيها شمس الصحراء الغاربة جدران القصر، لتشعل الجدران القديمة بظلال من اللون القرمزي والبرتقالي والذهبي، في تباين مذهل مع الصور الظلية الخضراء الداكنة لغابة النخيل الممتدة. هذه اللوحة التي رسمها فنانون محليون من تيميمون، هي قطعة فنية راقية تسمح للسياح بحمل الدفء الساحر والروعة المعمارية لقورارة معهم إلى أوطانهم.",
      price: 24000,
      stockQty: 2,
      material: "Oil paint, cotton canvas, wooden frame",
      dimensions: "60cm × 80cm",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/sunset_painting.png",
      isFeatured: true,
    },
    {
      artisanId: artTinHabib.id,
      categoryId: catPalm.id,
      name: "Handwoven Palm Leaf Fan (Marwaha)",
      nameAr: "مروحة سعف النخيل المنسوجة يدوياً (مروحة)",
      description: "The 'Marwaha' is an indispensable tool during the blistering Saharan summers. Skilfully woven from fresh green and dried yellow date-palm leaves, it produces a sturdy yet flexible fan that provides a strong, cooling breeze. The edges are beautifully bound with natural ochre-dyed fibers to prevent fraying. Beyond its daily utility in Timimoun, it serves as a beautiful, rustic wall decoration for tourists, representing the deep symbiosis between the oasis inhabitants and the life-giving date palm tree.",
      descriptionAr: "تُعد 'المروحة' أداة لا غنى عنها خلال فصول الصيف الصحراوية الحارقة. تُنسج بمهارة من سعف نخيل التمر الأخضر الفتي والأصفر المجفف، لتنتج مروحة قوية ومرنة في نفس الوقت توفر نسيماً قوياً ومنعشاً. الحواف مجلدة بشكل جميل بألياف مصبوغة بالمغرة الطبيعية لمنع التآكل. وبعيداً عن فائدتها اليومية في تيميمون، فهي تُعد زينة حائط ريفية جميلة للسياح، تمثل التكافل العميق بين سكان الواحات وشجرة نخيل التمر واهبة الحياة.",
      price: 1500,
      stockQty: 40,
      material: "Date-palm leaves, natural organic dyes",
      dimensions: "40cm length (with handle)",
      origin: "Timimoun, Algeria",
      imageUrl: "/images/products/palm_leaf_fan.png",
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

  // ─── Service Providers (Hotels & Guides) ───────────────────────────────────
  const providerHash = await bcrypt.hash("provider123", 12);
  
  const hotelManager = await prisma.user.create({
    data: {
      firstName: "Ahmed",
      lastName: "Kassi",
      email: "ahmed.hotel@redoasisartisan.dz",
      passwordHash: providerHash,
      role: "HOTEL",
      phone: "+213 550 112 233",
    }
  });

  const tourGuide = await prisma.user.create({
    data: {
      firstName: "Tarik",
      lastName: "Sahraoui",
      email: "tarik.guide@redoasisartisan.dz",
      passwordHash: providerHash,
      role: "GUIDE",
      phone: "+213 770 445 566",
    }
  });

  const hotelProvider = await prisma.serviceProvider.create({
    data: {
      userId: hotelManager.id,
      businessName: "Timimoun Palace Hotel",
      slug: "timimoun-palace",
      description: "A luxury stay in the heart of Timimoun Oasis.",
      descriptionAr: "إقامة فاخرة في قلب واحة تيميمون الساحرة.",
      location: "Timimoun Center",
      contactEmail: "contact@timimounpalace.dz",
      contactPhone: "+213 550 112 233",
      isApproved: true,
      services: {
        create: [
          {
            type: "ROOM",
            name: "Royal Oasis Suite",
            nameAr: "جناح الواحة الملكي",
            slug: "royal-oasis-suite",
            description: "Experience true desert luxury with panoramic views of the palm grove.",
            descriptionAr: "جرب الفخامة الصحراوية الحقيقية مع إطلالات بانورامية على واحة النخيل.",
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
            type: "ROOM",
            name: "Traditional Kasbah Room",
            nameAr: "غرفة قصبة تقليدية",
            slug: "traditional-kasbah-room",
            description: "Authentic mud-brick architecture for a genuine Gourara experience.",
            descriptionAr: "هندسة معمارية أصيلة من الطوب اللبن لتجربة قورارة حقيقية.",
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

  const guideProvider = await prisma.serviceProvider.create({
    data: {
      userId: tourGuide.id,
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
            description: "A 2-hour guided camel ride into the dunes to watch the spectacular desert sunset.",
            descriptionAr: "جولة إرشادية لمدة ساعتين على الجمال في الكثبان الرملية لمشاهدة غروب الشمس المذهل في الصحراء.",
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
            description: "Full day 4x4 off-road adventure exploring remote oasis and ancient ruins.",
            descriptionAr: "مغامرة ليوم كامل بسيارات الدفع الرباعي لاستكشاف الواحات النائية والآثار القديمة.",
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
  console.log("✅ Tourism Services created");

  // ─── Subscription Plans ─────────────────────────────────────────────────────
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        tier: "FREE",
        name: "Free Plan",
        nameAr: "الباقة المجانية",
        price: 0,
        durationDays: 36500, // 100 years — free forever
        features: JSON.stringify(["3 services max", "Standard visibility", "Email support"]),
        isActive: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        tier: "BASIC",
        name: "Basic Plan",
        nameAr: "الباقة الأساسية",
        price: 2500,
        durationDays: 30,
        features: JSON.stringify(["Unlimited services", "Advanced search visibility", "Booking reports", "Priority support"]),
        isActive: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        tier: "PREMIUM",
        name: "Premium Plan",
        nameAr: "الباقة الاحترافية",
        price: 5000,
        durationDays: 30,
        features: JSON.stringify(["All Basic features", "Verification badge", "Advanced analytics", "Personal account manager"]),
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${plans.length} subscription plans created`);

  // Give the hotel provider a free subscription by default
  const freePlan = plans.find((p) => p.tier === "FREE")!;
  const hotelProviderRecord = await prisma.serviceProvider.findUnique({ where: { userId: hotelManager.id } });
  if (hotelProviderRecord) {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    await prisma.userSubscription.create({
      data: {
        providerId: hotelProviderRecord.id,
        planId: freePlan.id,
        endDate,
        isActive: true,
      },
    });
  }

  // ─── Sample Advertisement ────────────────────────────────────────────────────
  const adExpiry = new Date();
  adExpiry.setMonth(adExpiry.getMonth() + 3);
  await prisma.advertisement.create({
    data: {
      title: "✨ Discover Timimoun Heritage Tours",
      titleAr: "✨ اكتشف جولات تراث تيميمون",
      body: "Book a guided tour of the ancient Ksar and Foggara irrigation systems with certified local guides.",
      bodyAr: "احجز جولة إرشادية في القصر القديم وأنظمة ري الفقارة مع مرشدين محليين معتمدين.",
      linkUrl: "/en/services",
      position: "homepage",
      isActive: true,
      endsAt: adExpiry,
    },
  });
  console.log("✅ Sample advertisement created");

  // ─── Sample Booking ──────────────────────────────────────────────────────────
  // Get the first published service from the hotel provider
  const hotelProviderFull = await prisma.serviceProvider.findUnique({
    where: { userId: hotelManager.id },
    include: { services: { where: { isPublished: true }, take: 1 } },
  });
  if (hotelProviderFull && hotelProviderFull.services.length > 0) {
    const service = hotelProviderFull.services[0];
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);

    await prisma.booking.create({
      data: {
        userId: customer.id,
        serviceId: service.id,
        startDate: checkIn,
        endDate: checkOut,
        guestsCount: 2,
        totalAmount: service.price * 3,
        status: "PENDING",
        notes: "We would like a room facing the palm grove if possible.",
      },
    });
    console.log("✅ Sample booking created (PENDING — ready for provider to Accept/Reject)");
  }

  // ─── Sample Conversation & Messages ─────────────────────────────────────────
  if (hotelProviderFull) {
    const conversation = await prisma.conversation.create({
      data: {
        touristId: customer.id,
        providerId: hotelProviderFull.id,
        subject: "Question about hotel availability",
        messages: {
          create: [
            {
              senderId: customer.id,
              body: "Hello! Do you have rooms available for next week? We are a family of 4 visiting Timimoun for the first time.",
              isRead: true,
            },
            {
              senderId: hotelManager.id,
              body: "Welcome! Yes, we have availability next week. Our Royal Oasis Suite is perfect for families. Shall I hold a reservation for you?",
              isRead: false,
            },
          ],
        },
      },
    });
    console.log("✅ Sample conversation created (ID:", conversation.id, ")");
  }

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
  console.log("🏨 Hotel:    ahmed.hotel@redoasisartisan.dz / provider123");
  console.log("🐪 Guide:    tarik.guide@redoasisartisan.dz / provider123");
  console.log("─".repeat(50));
  console.log(`📦 ${products.length} products | ${categories.length} categories | ${artisans.length} artisans`);
  console.log(`💳 3 subscription plans | 1 advertisement | 1 booking | 1 conversation`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
