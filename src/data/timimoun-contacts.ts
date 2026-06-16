export type ContactType = 'hotel' | 'artisan_coop' | 'institution' | 'guide' | 'transport' | 'restaurant' | 'other';

export interface TimimounContact {
  id: string;
  name: string;
  nameAr?: string;
  type: ContactType;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  social_link?: string;
  description: string;
  descriptionAr?: string;
  isVerified: boolean;
}

export const timimounContacts: TimimounContact[] = [
  {
    id: 'dtat',
    name: 'Directorate of Tourism and Handicrafts',
    nameAr: 'مديرية السياحة والصناعة التقليدية',
    type: 'institution',
    address: 'City Center, Timimoun',
    phone: '+213 49 39 00 00',
    description: 'Official tourism information for the Gourara region.',
    descriptionAr: 'معلومات سياحية رسمية عن منطقة قورارة.',
    isVerified: true
  },
  {
    id: 'gourara_lodge',
    name: 'Gourara Lodge',
    nameAr: 'نزل قورارة',
    type: 'hotel',
    address: 'Timimoun Oasis',
    website: 'https://example.com/gourara-lodge',
    description: 'Traditional earthen guesthouse in the heart of the palm grove.',
    descriptionAr: 'دار ضيافة تقليدية مبنية بالطوب وسط واحة النخيل.',
    isVerified: true
  },
  {
    id: 'coop_rouge_oasis',
    name: 'Red Oasis Cooperative (Weaving & Pottery)',
    nameAr: 'تعاونية الواحة الحمراء (نسيج وفخار)',
    type: 'artisan_coop',
    address: 'Ksar District, Timimoun',
    phone: '+213 600 12 34 56',
    description: 'A group of artisans specialized in traditional weaving and Zenete pottery.',
    descriptionAr: 'مجموعة من الحرفيين المتخصصين في النسيج التقليدي والفخار الزناتي.',
    isVerified: true
  },
  {
    id: 'guide_sahara_aventure',
    name: 'Sahara Adventure Guide (Mr. Ahmed)',
    nameAr: 'مرشد مغامرات الصحراء (السيد أحمد)',
    type: 'guide',
    address: 'Timimoun',
    phone: '+213 500 98 76 54',
    description: 'Expert guide for excursions in the Grand Erg Occidental and visiting the Foggaras.',
    descriptionAr: 'مرشد خبير في رحلات العرق الغربي وزيارة الفقارات.',
    isVerified: true
  }
];
