# RedOasisArtisan: Master's Degree Documentation Pack

This document contains the complete bilingual documentation pack for the **RedOasisArtisan** platform, tailored for an Algerian university "mémoire de fin d'étude". It is structured with clear headings to allow easy mapping to Microsoft Word styles (Heading 1, Heading 2, etc.).

---

## 1. Executive Summary (EN)

RedOasisArtisan is an innovative digital marketplace dedicated to the valorization, structuring, and promotion of the rich artisanal heritage of the Timimoun and Gourara region in Algeria. Born from the intersection of cultural preservation and digital transformation, this startup addresses the critical challenge of artisan invisibility in the modern digital economy. By providing a dedicated platform tailored to the unique socio-economic landscape of the oasis, RedOasisArtisan bridges the gap between traditional craftsmen and a global audience of buyers, tourists, and institutional partners.

The platform offers a comprehensive solution by empowering artisans with professional digital identities. It enables them to seamlessly generate structured resumes, document their ancestral skills, and showcase their crafts—such as Zenete weaving, traditional pottery, and sand art—in a high-quality online marketplace. This digital integration not only democratizes market access for rural SMEs but also ensures fair trade and economic sustainability for the local population.

Ultimately, RedOasisArtisan's value proposition lies in its dual approach: preserving intangible cultural heritage while driving economic professionalization. By digitizing the artisan ecosystem, the platform catalyzes local economic growth, fosters sustainable tourism, and positions the Gourara region as a digitally accessible hub of authentic Algerian craftsmanship.

---

## 2. الملخص التنفيذي (AR)

تعد منصة "RedOasisArtisan" سوقاً رقمياً مبتكراً مكرساً لتثمين وهيكلة وترويج التراث الحرفي الغني لمنطقة تيميمون وقورارة في الجزائر. وُلدت هذه الشركة الناشئة من تقاطع الحفاظ على الثقافة والتحول الرقمي، وهي تعالج التحدي الحاسم المتمثل في تهميش الحرفيين وعدم بروزهم في الاقتصاد الرقمي الحديث. من خلال توفير منصة مخصصة تتناسب مع المشهد الاجتماعي والاقتصادي الفريد للواحة، تسد المنصة الفجوة بين الحرفيين التقليديين وجمهور عالمي من المشترين والسياح والشركاء المؤسسيين.

تقدم المنصة حلاً شاملاً من خلال تمكين الحرفيين من بناء هويات رقمية احترافية. فهي تتيح لهم إنشاء سير ذاتية مهيكلة بسلاسة، وتوثيق مهاراتهم المتوارثة، وعرض منتجاتهم الحرفية - مثل النسيج الزناتي والفخار التقليدي وفن الرمل - في سوق إلكتروني عالي الجودة. إن هذا الاندماج الرقمي لا يضفي الطابع الديمقراطي على الوصول إلى الأسواق للمؤسسات الصغيرة والمتوسطة الريفية فحسب، بل يضمن أيضاً التجارة العادلة والاستدامة الاقتصادية للسكان المحليين.

في نهاية المطاف، يكمن عرض القيمة لمنصة "RedOasisArtisan" في نهجها المزدوج: الحفاظ على التراث الثقافي غير المادي مع دفع عجلة الاحتراف الاقتصادي. من خلال رقمنة النظام البيئي الحرفي، تعمل المنصة كمحفز للنمو الاقتصادي المحلي، وتعزز السياحة المستدامة، وتضع منطقة قورارة كمركز متاح رقمياً للحرف اليدوية الجزائرية الأصيلة.

---

## 3. Application Overview (EN)

### System Architecture
RedOasisArtisan is built on a modern, high-performance web architecture. The core application leverages the **Next.js 16** framework (App Router, Turbopack) combined with React, ensuring fast Server-Side Rendering (SSR) and optimal SEO visibility for artisan products. The backend database is managed via **Prisma ORM** connected to an edge-ready **SQLite/LibSQL** database, providing robust and scalable data management. The user interface is crafted using **Tailwind CSS**, delivering a responsive, culturally-themed, and bilingual (English/Arabic) experience powered by `next-intl`.

### Main Modules and Features
- **Admin Backoffice:** A centralized command center used by platform administrators to manage the ecosystem. 
  - *Purpose:* Monitor platform quality and validate content.
  - *Key Actions:* View KPIs, approve/reject artisan profiles, moderate products, and manage marketplace categories.
  - *Benefits:* Ensures only authentic and high-quality crafts are presented to the public, maintaining trust.
- **Artisan Dashboard:** A private workspace for artisans.
  - *Purpose:* Allow artisans to manage their professional profiles and catalogs.
  - *Key Actions:* Generate professional resumes, edit biographical stories, and manage product listings (photos, descriptions, stock, prices).
  - *Benefits:* Professionalizes the artisan's digital presence without requiring advanced technical skills.
- **Public Marketplace:** The customer-facing digital catalog.
  - *Purpose:* Allow visitors to discover and purchase authentic oasis crafts.
  - *Key Actions:* Search and filter products by category/location, view detailed product pages, and explore artisan stories.
  - *Benefits:* Connects local crafts to a global market, providing visibility and sales opportunities.
- **Wishlist & Favorites:** A user engagement module.
  - *Purpose:* Allow users to bookmark interesting products.
  - *Key Actions:* Add/remove items to a persistent wishlist.
  - *Benefits:* Facilitates future purchases and product comparisons.
- **Authentication & User Management:** The security backbone.
  - *Purpose:* Manage secure, role-based access.
  - *Key Actions:* Signup, login, and profile management for Admins, Artisans, and Buyers.
  - *Benefits:* Protects user data and ensures specialized routing based on user roles.

### Typical User Journey
A new artisan from Timimoun registers on the platform and accesses their private dashboard. They fill out their biographical information and automatically generate a professional resume detailing their skills. Next, they upload their traditional crafts with high-quality images and pricing. A platform administrator reviews and approves the artisan's profile. A tourist visiting the public marketplace filters for "traditional pottery", discovers the artisan's products, reads their cultural story, adds the item to their wishlist, and ultimately initiates a contact request to purchase the craft.

---

## 4. نظرة عامة على التطبيق (AR)

### بنية النظام
تم بناء منصة "RedOasisArtisan" على بنية ويب حديثة وعالية الأداء. يعتمد التطبيق الأساسي على إطار عمل **Next.js 16** مع React، مما يضمن تصيير الخادم السريع (SSR) والرؤية المثلى لمحركات البحث (SEO) للمنتجات الحرفية. تدار قاعدة البيانات الخلفية عبر **Prisma ORM** متصلة بقاعدة بيانات **SQLite/LibSQL**، مما يوفر إدارة بيانات قوية وقابلة للتطوير. تم تصميم واجهة المستخدم باستخدام **Tailwind CSS**، لتقديم تجربة متجاوبة ذات طابع ثقافي، وثنائية اللغة (الإنجليزية/العربية).

### الوحدات والميزات الرئيسية
- **لوحة تحكم الإدارة (Admin Backoffice):** مركز قيادة مركزي يستخدمه مسؤولو المنصة.
  - *الهدف:* مراقبة جودة المنصة والتحقق من صحة المحتوى.
  - *الإجراءات الرئيسية:* عرض مؤشرات الأداء، الموافقة/الرفض لملفات الحرفيين، الإشراف على المنتجات، وإدارة فئات السوق.
  - *الفوائد:* يضمن عرض الحرف الأصيلة وعالية الجودة فقط للجمهور، مما يحافظ على الثقة.
- **لوحة معلومات الحرفي (Artisan Dashboard):** مساحة عمل خاصة للحرفيين.
  - *الهدف:* السماح للحرفيين بإدارة ملفاتهم المهنية وكتالوجاتهم.
  - *الإجراءات الرئيسية:* إنشاء سير ذاتية احترافية، تحرير القصص الذاتية، وإدارة المنتجات (الصور، الوصف، المخزون، الأسعار).
  - *الفوائد:* يضفي طابعاً احترافياً على الوجود الرقمي للحرفي دون الحاجة إلى مهارات تقنية متقدمة.
- **السوق العام (Public Marketplace):** الكتالوج الرقمي الموجه للعملاء.
  - *الهدف:* السماح للزوار باكتشاف وشراء الحرف الواحية الأصيلة.
  - *الإجراءات الرئيسية:* البحث وتصفية المنتجات، عرض صفحات المنتجات التفصيلية، واستكشاف قصص الحرفيين.
  - *الفوائد:* يربط الحرف المحلية بالسوق العالمية، مما يوفر الرؤية وفرص المبيعات.
- **قائمة الرغبات والمفضلات (Wishlist):** وحدة تفاعل المستخدم.
  - *الهدف:* السماح للمستخدمين بحفظ المنتجات المثيرة للاهتمام.
  - *الإجراءات الرئيسية:* إضافة/إزالة العناصر إلى قائمة رغبات مستمرة.
  - *الفوائد:* يسهل عمليات الشراء المستقبلية ومقارنة المنتجات.
- **المصادقة وإدارة المستخدمين:** العمود الفقري للأمان.
  - *الهدف:* إدارة الوصول الآمن القائم على الأدوار.
  - *الإجراءات الرئيسية:* التسجيل، تسجيل الدخول، وإدارة الملفات الشخصية.
  - *الفوائد:* يحمي بيانات المستخدمين ويضمن توجيههم المتخصص بناءً على أدوارهم.

### رحلة المستخدم النموذجية
يسجل حرفي جديد من تيميمون في المنصة ويصل إلى لوحة التحكم الخاصة به. يقوم بملء معلوماته البيوغرافية وإنشاء سيرة ذاتية احترافية توضح مهاراته. بعد ذلك، يقوم برفع منتجاته التقليدية مع صور عالية الجودة وتسعيرها. يقوم مسؤول المنصة بمراجعة ملف الحرفي والموافقة عليه. لاحقاً، يقوم سائح يزور السوق العام بتصفية البحث للوصول إلى "الفخار التقليدي"، فيكتشف منتجات الحرفي، ويقرأ قصته الثقافية، ويضيف العنصر إلى قائمة الرغبات الخاصة به، وفي النهاية يبدأ طلب اتصال لشراء الحرفة.

---

## 5. Functional Specification (EN)

### Functional Requirements
- The system **must** support Role-Based Access Control (RBAC), strictly separating Admins, Artisans, and Customers.
- The system **must** provide a fully bilingual user interface (English and Arabic) with automatic Right-to-Left (RTL) layout support.
- The system **must** allow artisans to securely register, update personal information, and automatically generate a structured professional resume.
- The system **must** enable artisans to perform complete CRUD (Create, Read, Update, Delete) operations on their product catalog, including secure image uploads.
- The system **must** allow administrators to review, approve, suspend, or reject artisan profiles and moderate published products.
- The system **must** feature a public marketplace with advanced search and filtering capabilities by category, location, and price.
- The system **must** allow customers to add or remove products to a persistent, session-based wishlist.

### Main Entities and Data Architecture
- **User:** Manages authentication credentials, access role (`ADMIN`, `ARTISAN`, `CUSTOMER`), contact information, and active status.
- **Artisan Profile:** Linked via a one-to-one relationship to the User entity. Stores the shop name, cultural biography, specialization, geographic location (e.g., Timimoun, Adrar), years of experience, and structured resume data.
- **Product:** Linked to an Artisan and a Category. Contains the product title, multi-language descriptions, price (DZD), stock quantity, dimensions, materials, and associated image URLs.
- **Category:** Defines hierarchical craft types (e.g., Pottery, Weaving, Sand Art) used for catalog filtering.
- **Wishlist:** Tracks customer intent by linking a User entity to multiple Product entities.

---

## 6. المواصفات الوظيفية (AR)

### المتطلبات الوظيفية
- **يجب** أن يدعم النظام التحكم في الوصول القائم على الأدوار (RBAC)، مع الفصل الصارم بين المسؤولين والحرفيين والعملاء.
- **يجب** أن يوفر النظام واجهة مستخدم ثنائية اللغة بالكامل (الإنجليزية والعربية) مع دعم تلقائي لتخطيط اليمين إلى اليسار (RTL).
- **يجب** أن يسمح النظام للحرفيين بالتسجيل الآمن، وتحديث المعلومات الشخصية، والإنشاء التلقائي لسيرة ذاتية مهنية مهيكلة.
- **يجب** أن يُمكّن النظام الحرفيين من إجراء عمليات إدارة البيانات الكاملة (إنشاء، قراءة، تحديث، حذف) على كتالوج منتجاتهم، بما في ذلك رفع الصور بأمان.
- **يجب** أن يسمح النظام للمسؤولين بمراجعة أو الموافقة أو تعليق أو رفض ملفات الحرفيين والإشراف على المنتجات المنشورة.
- **يجب** أن يتميز النظام بسوق عام مع قدرات بحث وتصفية متقدمة حسب الفئة والموقع والسعر.
- **يجب** أن يسمح النظام للعملاء بإضافة أو إزالة المنتجات إلى قائمة رغبات مستمرة تعتمد على جلسة المستخدم.

### الكيانات الرئيسية وهيكلية البيانات
- **المستخدم (User):** يدير بيانات المصادقة، دور الوصول (مسؤول، حرفي، عميل)، معلومات الاتصال، وحالة النشاط.
- **الملف الشخصي للحرفي (Artisan Profile):** مرتبط بعلاقة رأس برأس مع كيان المستخدم. يخزن اسم المتجر، السيرة الثقافية، التخصص، الموقع الجغرافي (مثل تيميمون، أدرار)، سنوات الخبرة، وبيانات السيرة الذاتية المهيكلة.
- **المنتج (Product):** مرتبط بحرفي وفئة. يحتوي على عنوان المنتج، أوصاف متعددة اللغات، السعر (بالدينار الجزائري)، كمية المخزون، الأبعاد، المواد، وعناوين الصور المرتبطة.
- **الفئة (Category):** تحدد الأنواع الهرمية للحرف (مثل الفخار، النسيج، فن الرمل) المستخدمة لتصفية الكتالوج.
- **قائمة الرغبات (Wishlist):** تتتبع نوايا العميل من خلال ربط كيان المستخدم بكيانات منتجات متعددة.

---

## 7. User Guide with Screens and Captions (EN)

### 7.1 Admin Dashboard Screen
- **UI Description:** The main homepage for administrators. It features a top navigation bar, a side menu for modules, and a central grid displaying key performance indicators (KPIs) such as total artisans, active products, and pending approvals.
- **How to use this page:** Administrators log into this interface to get a bird's-eye view of the platform. They can click on the KPI cards to navigate directly to the validation queues for new artisans or reported products.
- **Suggested Caption:** *Figure 1: The Administrator Dashboard displaying global platform statistics and KPI metrics.*

### 7.2 Artisan Profile & Resume Editor
- **UI Description:** A comprehensive form interface featuring specialized tabs or sections for personal information, cultural biography, main craft category, skills, and experience. It includes text areas for storytelling and a live preview of the generated resume.
- **How to use this page:** Artisans use this screen to build their professional identity. They fill out their history and specialized skills in the input fields, which the system automatically compiles into a standardized, exportable resume format.
- **Suggested Caption:** *Figure 2: The Artisan Profile Editor and automated Resume Generator interface.*

### 7.3 Artisan Product Management Screen
- **UI Description:** A tabular dashboard page listing all products owned by the artisan. Columns display the product photo, title, category, price, and publication status. It includes a prominent "Add New Product" button and action menus for editing or deleting.
- **How to use this page:** Artisans use this catalog manager to keep their inventory updated. By clicking "Add New Product", they can open a form to upload images, set prices, and write descriptions for new crafts.
- **Suggested Caption:** *Figure 3: The Artisan Product Management dashboard showing the inventory list.*

### 7.4 Public Marketplace Listing Page
- **UI Description:** A visually rich grid or list layout displaying product cards. Each card shows a high-quality image, title, artisan name, price, and category. A filtering and sorting sidebar/header is located at the top or side.
- **How to use this page:** Visitors use the filters to narrow down crafts by category or region. Clicking on a product card navigates the user to the detailed view, while the heart icon adds the item to their wishlist.
- **Suggested Caption:** *Figure 4: The Public Marketplace listing page featuring advanced search and category filters.*

### 7.5 Product Detail Page
- **UI Description:** A focused view highlighting a large product gallery. It includes a detailed textual description, specifications (materials, dimensions), pricing, and a dedicated side panel showcasing the artisan's profile. Call-to-action (CTA) buttons are available for adding to wishlist or contacting the artisan.
- **How to use this page:** Buyers review the detailed specifications of the craft and read about the artisan who made it. They can interact with the CTA buttons to save the item or proceed with an inquiry/purchase.
- **Suggested Caption:** *Figure 5: Detailed product view displaying craft specifications and artisan information.*

### 7.6 Wishlist Page
- **UI Description:** A personalized list displaying products and artisans saved by the user. Each row features a thumbnail, title, artisan name, and an action button to either view details or remove the item from the list.
- **How to use this page:** Users visit this page to compare the items they have bookmarked over time. They can directly access product details to finalize a purchase or clean up their list by removing items.
- **Suggested Caption:** *Figure 6: The Customer Wishlist page showing saved favorite crafts and artisan profiles.*

---

## 8. دليل المستخدم مع الشاشات والتعليقات التوضيحية (AR)

### 8.1 شاشة لوحة تحكم الإدارة (Admin Dashboard Screen)
- **وصف واجهة المستخدم:** الصفحة الرئيسية للمسؤولين. تتميز بشريط تنقل علوي، وقائمة جانبية للوحدات، وشبكة مركزية تعرض مؤشرات الأداء الرئيسية (KPIs) مثل إجمالي الحرفيين، والمنتجات النشطة، والطلبات المعلقة.
- **كيفية استخدام هذه الصفحة:** يقوم المسؤولون بتسجيل الدخول إلى هذه الواجهة للحصول على نظرة شاملة للمنصة. يمكنهم النقر على بطاقات المؤشرات للانتقال مباشرة إلى طوابير التحقق للحرفيين الجدد أو المنتجات المبلغ عنها.
- **التعليق المقترح:** *الشكل 1: لوحة تحكم المسؤول تعرض إحصاءات المنصة العالمية ومؤشرات الأداء.*

### 8.2 محرر ملف الحرفي والسيرة الذاتية (Artisan Profile & Resume Editor)
- **وصف واجهة المستخدم:** واجهة نموذج شاملة تحتوي على أقسام مخصصة للمعلومات الشخصية، والسيرة الثقافية، والفئة الحرفية الرئيسية، والمهارات، والخبرة. تتضمن مناطق نصية لسرد القصص ومعاينة حية للسيرة الذاتية المُنشأة.
- **كيفية استخدام هذه الصفحة:** يستخدم الحرفيون هذه الشاشة لبناء هويتهم المهنية. يقومون بملء تاريخهم ومهاراتهم المتخصصة في حقول الإدخال، والتي يقوم النظام تلقائياً بتجميعها في تنسيق سيرة ذاتية موحد وقابل للتصدير.
- **التعليق المقترح:** *الشكل 2: واجهة محرر ملف الحرفي ومولد السيرة الذاتية الآلي.*

### 8.3 شاشة إدارة منتجات الحرفي (Artisan Product Management Screen)
- **وصف واجهة المستخدم:** صفحة لوحة معلومات جدولية تسرد جميع المنتجات المملوكة للحرفي. تعرض الأعمدة صورة المنتج، والعنوان، والفئة، والسعر، وحالة النشر. تتضمن زراً بارزاً "إضافة منتج جديد" وقوائم إجراءات للتحرير أو الحذف.
- **كيفية استخدام هذه الصفحة:** يستخدم الحرفيون مدير الكتالوج هذا لتحديث مخزونهم. من خلال النقر على "إضافة منتج جديد"، يمكنهم فتح نموذج لرفع الصور، وتحديد الأسعار، وكتابة أوصاف للحرف الجديدة.
- **التعليق المقترح:** *الشكل 3: لوحة إدارة منتجات الحرفي تعرض قائمة المخزون.*

### 8.4 صفحة قائمة السوق العام (Public Marketplace Listing Page)
- **وصف واجهة المستخدم:** تخطيط شبكي أو قائمة غني بصرياً يعرض بطاقات المنتجات. تُظهر كل بطاقة صورة عالية الجودة، وعنواناً، واسم الحرفي، والسعر، والفئة. يوجد شريط جانبي/علوي للتصفية والفرز.
- **كيفية استخدام هذه الصفحة:** يستخدم الزوار الفلاتر لتضييق نطاق الحرف حسب الفئة أو المنطقة. يؤدي النقر على بطاقة المنتج إلى انتقال المستخدم إلى العرض التفصيلي، بينما يضيف رمز القلب العنصر إلى قائمة الرغبات الخاصة بهم.
- **التعليق المقترح:** *الشكل 4: صفحة قائمة السوق العام التي تتميز ببحث متقدم وفلاتر الفئات.*

### 8.5 صفحة تفاصيل المنتج (Product Detail Page)
- **وصف واجهة المستخدم:** عرض مُركز يسلط الضوء على معرض صور كبير للمنتج. يتضمن وصفاً نصياً مفصلاً، ومواصفات (المواد، الأبعاد)، والتسعير، ولوحة جانبية مخصصة تعرض ملف الحرفي. تتوفر أزرار اتخاذ إجراء (CTA) للإضافة إلى قائمة الرغبات أو الاتصال بالحرفي.
- **كيفية استخدام هذه الصفحة:** يراجع المشترون المواصفات التفصيلية للحرفة ويقرؤون عن الحرفي الذي صنعها. يمكنهم التفاعل مع الأزرار لحفظ العنصر أو المضي قدماً في الاستفسار/الشراء.
- **التعليق المقترح:** *الشكل 5: عرض مفصل للمنتج يوضح مواصفات الحرفة ومعلومات الحرفي.*

### 8.6 صفحة قائمة الرغبات (Wishlist Page)
- **وصف واجهة المستخدم:** قائمة مخصصة تعرض المنتجات والحرفيين الذين حفظهم المستخدم. تتميز كل صف بصورة مصغرة، وعنوان، واسم الحرفي، وزر إجراء لعرض التفاصيل أو إزالة العنصر من القائمة.
- **كيفية استخدام هذه الصفحة:** يزور المستخدمون هذه الصفحة لمقارنة العناصر التي قاموا بحفظها بمرور الوقت. يمكنهم الوصول مباشرة إلى تفاصيل المنتج لإتمام عملية الشراء أو تنظيف قائمتهم عن طريق إزالة العناصر.
- **التعليق المقترح:** *الشكل 6: صفحة قائمة رغبات العميل تعرض الحرف المفضلة المحفوظة وملفات الحرفيين.*

---

## 9. Proposed DOCX Table of Contents (EN)

**1. Introduction**
*Description:* Introduces the general context of the thesis, the socio-economic importance of the artisan heritage in the Timimoun and Gourara region, the problematic of digital invisibility, and the main objectives of the RedOasisArtisan platform.

**2. Context and Problem Statement (State of the Art)**
*Description:* Analyzes the current state of artisan commerce in Algerian oases, identifies the barriers to professionalization, and studies existing digital solutions, justifying the need for a tailored platform.

**3. Requirements Analysis and Specifications**
*Description:* Details the functional and non-functional requirements of the system, identifying the key actors (Admin, Artisan, Buyer) and documenting the use cases through unified modeling language (UML) logic.

**4. System Architecture and Design**
*Description:* Explains the technical choices (Next.js, Prisma, Tailwind), the database schema (Entity-Relationship diagrams), and the global architecture of the RedOasisArtisan platform.

**5. Implementation and Technical Details**
*Description:* Showcases the development phase, highlighting key code structures, security implementation (authentication), and the creation of the automated resume generator algorithm.

**6. User Guide and Platform Walkthrough**
*Description:* A practical, step-by-step visual guide of the application's user interface, detailing how each actor interacts with the platform's modules using annotated screenshots.

**7. Evaluation and Conclusion**
*Description:* Summarizes the achievements of the project, evaluates the platform's impact on artisan professionalization, discusses technical limitations, and proposes future perspectives for expansion.

---

## 10. فهرس المحتويات المقترح لملف وورد (AR)

**1. مقدمة (Introduction)**
*الوصف:* يعرض السياق العام للمذكرة، والأهمية الاجتماعية والاقتصادية للتراث الحرفي في منطقة تيميمون وقورارة، وإشكالية التهميش الرقمي، والأهداف الرئيسية لمنصة RedOasisArtisan.

**2. السياق وبيان المشكلة / دراسة الحالة (Context and Problem Statement)**
*الوصف:* يحلل الوضع الحالي للتجارة الحرفية في الواحات الجزائرية، ويحدد عوائق الاحتراف، ويدرس الحلول الرقمية الحالية، مبرراً الحاجة إلى منصة مخصصة.

**3. تحليل المتطلبات والمواصفات (Requirements Analysis and Specifications)**
*الوصف:* يفصل المتطلبات الوظيفية وغير الوظيفية للنظام، ويحدد الجهات الفاعلة الرئيسية (مسؤول، حرفي، مشتري) ويوثق حالات الاستخدام عبر منطق لغة النمذجة الموحدة (UML).

**4. بنية النظام والتصميم (System Architecture and Design)**
*الوصف:* يشرح الخيارات التقنية (Next.js، Prisma، Tailwind)، ومخطط قاعدة البيانات (مخططات الكيان والعلاقة)، والبنية العالمية لمنصة RedOasisArtisan.

**5. التنفيذ والتفاصيل التقنية (Implementation and Technical Details)**
*الوصف:* يعرض مرحلة التطوير، ويسلط الضوء على الهياكل البرمجية الرئيسية، وتنفيذ الأمان (المصادقة)، وإنشاء خوارزمية مولد السيرة الذاتية الآلي.

**6. دليل المستخدم وجولة في المنصة (User Guide and Platform Walkthrough)**
*الوصف:* دليل بصري عملي ومفصل خطوة بخطوة لواجهة مستخدم التطبيق، يوضح كيفية تفاعل كل فاعل مع وحدات المنصة باستخدام لقطات شاشة مشروحة.

**7. التقييم والخاتمة (Evaluation and Conclusion)**
*الوصف:* يلخص إنجازات المشروع، ويقيم تأثير المنصة على الاحتراف الحرفي، ويناقش القيود التقنية، ويقترح آفاقاً مستقبلية للتوسع.
