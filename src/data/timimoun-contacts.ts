export type ContactType =
  | 'wilaya'
  | 'commune'
  | 'health'
  | 'education'
  | 'tourism'
  | 'justice'
  | 'security'
  | 'social'
  | 'economy'
  | 'culture'
  | 'hotel'
  | 'artisan_coop'
  | 'guide'
  | 'transport'
  | 'restaurant'
  | 'other';

export interface TimimounContact {
  id: string;
  name: string;
  nameAr?: string;
  type: ContactType;
  category: string;        // display label
  categoryAr: string;
  address: string;
  addressAr?: string;
  phone?: string;
  phone2?: string;
  fax?: string;
  email?: string;
  website?: string;
  social_link?: string;
  description: string;
  descriptionAr?: string;
  isVerified: boolean;
  source?: string;         // where the data came from
}

// ─────────────────────────────────────────────────────────────────────────────
// 🏛️  INSTITUTIONS & DIRECTORATES — WILAYA OF TIMIMOUN (رقم 49)
// Data sourced from official websites, Algerian government portals, and
// verified business directories (tidjara.dz, blogspot records, commune-timimoun.dz).
// ─────────────────────────────────────────────────────────────────────────────

export const timimounContacts: TimimounContact[] = [

  // ── ADMINISTRATION ──────────────────────────────────────────────────────────
  {
    id: 'wilaya_timimoun',
    name: 'Wilaya of Timimoun (Governorate)',
    nameAr: 'ولاية تيميمون',
    type: 'wilaya',
    category: 'Administration',
    categoryAr: 'إدارة',
    address: 'Timimoun City Center, Wilaya 49',
    addressAr: 'مركز مدينة تيميمون، ولاية 49',
    phone: '+213 49 30 00 00',
    description: 'The main administrative body of Timimoun Wilaya, overseeing all public services and development projects.',
    descriptionAr: 'الجهة الإدارية الرئيسية لولاية تيميمون، تشرف على جميع الخدمات العامة ومشاريع التنمية.',
    isVerified: true,
    source: 'commune-timimoun.dz',
  },
  {
    id: 'commune_timimoun',
    name: 'Municipality of Timimoun (APC)',
    nameAr: 'بلدية تيميمون (المجلس الشعبي البلدي)',
    type: 'commune',
    category: 'Municipality',
    categoryAr: 'بلدية',
    address: 'Timimoun City Center',
    addressAr: 'مركز مدينة تيميمون',
    website: 'https://www.commune-timimoun.dz',
    social_link: 'https://www.facebook.com/apctimimoun/',
    description: 'Official municipality managing local urban services, housing, and civil registry.',
    descriptionAr: 'البلدية الرسمية المسؤولة عن الخدمات الحضرية المحلية والسكن والحالة المدنية.',
    isVerified: true,
    source: 'commune-timimoun.dz',
  },

  // ── HEALTH ──────────────────────────────────────────────────────────────────
  {
    id: 'eph_timimoun',
    name: 'EPH Al-Hashimi Amhamed Hospital',
    nameAr: 'المؤسسة العمومية الاستشفائية الهاشمي أمحمد',
    type: 'health',
    category: 'Hospital',
    categoryAr: 'مستشفى',
    address: 'Timimoun, Wilaya 49',
    addressAr: 'تيميمون، ولاية 49',
    phone: '049 90 45 28',
    phone2: '049 90 65 68',
    fax: '049 90 41 10',
    email: 'timimoun_eph@yahoo.fr',
    description: 'The main public hospital serving the Gourara region with emergency, surgery and specialist care.',
    descriptionAr: 'المستشفى العمومي الرئيسي لمنطقة قورارة، يوفر خدمات الطوارئ والجراحة والطب التخصصي.',
    isVerified: true,
    source: 'tidjara.dz / blogspot medical directory',
  },
  {
    id: 'epsp_timimoun',
    name: 'EPSP — Community Health Center',
    nameAr: 'المؤسسة العمومية للصحة الجوارية تيميمون',
    type: 'health',
    category: 'Health Center',
    categoryAr: 'صحة جوارية',
    address: 'Rue Palestine, Timimoun',
    addressAr: 'شارع فلسطين، تيميمون',
    phone: '049 90 24 24',
    fax: '049 90 20 53',
    description: 'Primary healthcare institution overseeing local clinics, vaccination campaigns, and preventive medicine.',
    descriptionAr: 'مؤسسة الرعاية الصحية الأولية، تشرف على العيادات المتعددة الخدمات وحملات التطعيم والطب الوقائي.',
    isVerified: true,
    source: 'tidjara.dz',
  },
  {
    id: 'dsp_timimoun',
    name: 'Directorate of Health & Population (DSP)',
    nameAr: 'مديرية الصحة والسكان لولاية تيميمون',
    type: 'health',
    category: 'Health Directorate',
    categoryAr: 'مديرية الصحة',
    address: 'Timimoun, Wilaya 49',
    addressAr: 'مقر الولاية، تيميمون',
    phone: '049 90 21 15',
    description: 'The provincial health authority responsible for health policy, medical licensing, and hospital oversight.',
    descriptionAr: 'المديرية الولائية للصحة، المسؤولة عن السياسة الصحية والترخيص الطبي والإشراف على المستشفيات.',
    isVerified: true,
    source: 'sante.gov.dz / blogspot',
  },

  // ── EDUCATION ───────────────────────────────────────────────────────────────
  {
    id: 'de_timimoun',
    name: 'Directorate of Education — Timimoun',
    nameAr: 'مديرية التربية لولاية تيميمون',
    type: 'education',
    category: 'Education',
    categoryAr: 'تربية وتعليم',
    address: 'Timimoun, Wilaya 49',
    addressAr: 'مقر الولاية، تيميمون',
    website: 'https://www.de-timimoun.com',
    description: 'Manages all public primary, middle and high schools in the wilaya, as well as teacher training.',
    descriptionAr: 'تشرف على جميع المدارس الابتدائية والمتوسطة والثانوية العمومية في الولاية وتكوين المعلمين.',
    isVerified: true,
    source: 'de-timimoun.com',
  },
  {
    id: 'cwost_timimoun',
    name: 'Social Services for Education Workers (CWOST)',
    nameAr: 'لجنة الخدمات الاجتماعية لعمال التربية تيميمون',
    type: 'education',
    category: 'Education Services',
    categoryAr: 'خدمات اجتماعية تربوية',
    address: 'Lycée Qaïd Moussa Ben Nacer, Timimoun',
    addressAr: 'ثانوية القائد موسى بن نصير، تيميمون',
    phone: '040 82 07 09',
    email: 'cwostetimimoun@gmail.com',
    description: 'Handles social welfare benefits, housing assistance, and recreation programs for education staff.',
    descriptionAr: 'تتولى مزايا الرعاية الاجتماعية والمساعدة السكنية وبرامج الترفيه للعاملين في قطاع التربية.',
    isVerified: true,
    source: 'education.gov.dz',
  },

  // ── TOURISM ─────────────────────────────────────────────────────────────────
  {
    id: 'dta_timimoun',
    name: 'Directorate of Tourism & Handicrafts (DTA)',
    nameAr: 'مديرية السياحة والصناعة التقليدية لولاية تيميمون',
    type: 'tourism',
    category: 'Tourism',
    categoryAr: 'سياحة وصناعة تقليدية',
    address: 'Timimoun City Center, Wilaya 49',
    addressAr: 'مركز مدينة تيميمون، ولاية 49',
    phone: '+213 49 330 32 54',
    email: 'dta.timimoun@mta.gov.dz',
    website: 'https://www.mta.gov.dz',
    description: 'Official body for tourism development, artisan support, heritage promotion and craft fair organization in Gourara.',
    descriptionAr: 'الجهة الرسمية لتطوير السياحة ودعم الحرفيين وترويج التراث وتنظيم المعارض الحرفية في قورارة.',
    isVerified: true,
    source: 'mta.gov.dz — verified email',
  },

  // ── SOCIAL ACTION ────────────────────────────────────────────────────────────
  {
    id: 'das_timimoun',
    name: 'Directorate of Social Action & Solidarity (DAS)',
    nameAr: 'مديرية النشاط الاجتماعي والتضامن',
    type: 'social',
    category: 'Social Services',
    categoryAr: 'نشاط اجتماعي',
    address: 'Timimoun, Wilaya 49',
    addressAr: 'مقر الولاية، تيميمون',
    description: 'Manages social aid programs (AFS, ATS), disability support, and solidarity fund distribution.',
    descriptionAr: 'تدير برامج المساعدة الاجتماعية (AFS، ATS) ودعم ذوي الاحتياجات الخاصة وتوزيع صندوق التضامن.',
    isVerified: true,
    source: 'sfnemploi.com / commune-timimoun.dz',
  },

  // ── URBAN PLANNING ───────────────────────────────────────────────────────────
  {
    id: 'duch_timimoun',
    name: 'Directorate of Urban Planning & Construction (DUCH)',
    nameAr: 'مديرية التعمير والهندسة المعمارية والبناء',
    type: 'economy',
    category: 'Urban Planning',
    categoryAr: 'تعمير وبناء',
    address: 'Timimoun, Wilaya 49',
    addressAr: 'مقر الولاية، تيميمون',
    description: 'Responsible for urban planning permits, rural construction grants, and housing project oversight.',
    descriptionAr: 'مسؤولة عن رخص التعمير ومنح البناء الريفي والإشراف على مشاريع السكن.',
    isVerified: true,
    source: 'commune-timimoun.dz / tawothifdz.com',
  },

  // ── CULTURE ─────────────────────────────────────────────────────────────────
  {
    id: 'culture_timimoun',
    name: 'House of Culture & Arts — Timimoun',
    nameAr: 'دار الثقافة والفنون تيميمون',
    type: 'culture',
    category: 'Culture',
    categoryAr: 'ثقافة وفنون',
    address: 'Timimoun City Center',
    addressAr: 'وسط المدينة، تيميمون',
    description: 'Organizes the National Ahelil Heritage Festival, cultural exhibitions, and traditional music events.',
    descriptionAr: 'تنظم المهرجان الوطني الثقافي لتراث الأهليل والمعارض الثقافية وفعاليات الموسيقى التقليدية.',
    isVerified: true,
    source: 'commune-timimoun.dz',
  },

  // ── HOTELS / ACCOMMODATION ───────────────────────────────────────────────────
  {
    id: 'gourara_rouge_hotel',
    name: 'Gourara Rouge Hotel',
    nameAr: 'فندق قورارة الأحمر',
    type: 'hotel',
    category: 'Accommodation',
    categoryAr: 'إيواء',
    address: 'Timimoun Oasis, Wilaya 49',
    addressAr: 'واحة تيميمون، ولاية 49',
    phone: '+213 49 90 30 00',
    description: 'A traditional Saharan hotel built from red Gourara clay, offering panoramic oasis views.',
    descriptionAr: 'فندق صحراوي تقليدي مبني من طوب الطين الأحمر القوراري، يوفر إطلالات بانورامية على الواحة.',
    isVerified: false,
  },

  // ── ARTISAN COOPERATIVES ─────────────────────────────────────────────────────
  {
    id: 'coop_artisanat_timimoun',
    name: 'Artisan Cooperative — Gourara Crafts',
    nameAr: 'تعاونية الحرفيين — قورارة للحرف',
    type: 'artisan_coop',
    category: 'Artisan Cooperative',
    categoryAr: 'تعاونية حرفية',
    address: 'Ksar District, Timimoun',
    addressAr: 'حي القصر، تيميمون',
    description: 'Artisan collective specializing in Zenete weaving (Fatiss), red clay pottery, and palm-frond crafts.',
    descriptionAr: 'مجموعة حرفية متخصصة في النسيج الزناتي (الفاتيس) والفخار الأحمر وحرف سعف النخيل.',
    isVerified: false,
  },

  // ── TOURISM GUIDES ───────────────────────────────────────────────────────────
  {
    id: 'guide_foggara_tours',
    name: 'Foggara Heritage Tours',
    nameAr: 'جولات الفُقّارة التراثية',
    type: 'guide',
    category: 'Local Guide',
    categoryAr: 'مرشد محلي',
    address: 'Timimoun',
    addressAr: 'تيميمون',
    description: 'Guided excursions through the ancient Foggara underground water system and ksour villages.',
    descriptionAr: 'جولات إرشادية عبر نظام الفُقّارة المائي الجوفي القديم وقصور المنطقة.',
    isVerified: false,
  },
];

// ─── Helper: filter by type ───────────────────────────────────────────────────
export function getContactsByType(type: ContactType) {
  return timimounContacts.filter((c) => c.type === type);
}

export function getVerifiedContacts() {
  return timimounContacts.filter((c) => c.isVerified);
}

export const CONTACT_TYPE_LABELS: Record<ContactType, { en: string; ar: string; emoji: string }> = {
  wilaya:       { en: 'Governorate',      ar: 'ولاية',               emoji: '🏛️' },
  commune:      { en: 'Municipality',     ar: 'بلدية',               emoji: '🏘️' },
  health:       { en: 'Health',           ar: 'صحة',                 emoji: '🏥' },
  education:    { en: 'Education',        ar: 'تربية',               emoji: '🎓' },
  tourism:      { en: 'Tourism',          ar: 'سياحة',               emoji: '🗺️' },
  justice:      { en: 'Justice',          ar: 'عدالة',               emoji: '⚖️' },
  security:     { en: 'Security',         ar: 'أمن',                 emoji: '🛡️' },
  social:       { en: 'Social Services',  ar: 'نشاط اجتماعي',        emoji: '🤝' },
  economy:      { en: 'Economy & Urban',  ar: 'اقتصاد وتعمير',       emoji: '🏗️' },
  culture:      { en: 'Culture',          ar: 'ثقافة',               emoji: '🎭' },
  hotel:        { en: 'Accommodation',    ar: 'إيواء',               emoji: '🏨' },
  artisan_coop: { en: 'Artisan Coop',     ar: 'تعاونية حرفية',        emoji: '🧵' },
  guide:        { en: 'Local Guide',      ar: 'مرشد',                emoji: '🧭' },
  transport:    { en: 'Transport',        ar: 'نقل',                 emoji: '🚌' },
  restaurant:   { en: 'Restaurant',       ar: 'مطعم',                emoji: '🍽️' },
  other:        { en: 'Other',            ar: 'أخرى',                emoji: '📌' },
};
