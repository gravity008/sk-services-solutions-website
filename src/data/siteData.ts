import { ServiceItem, TestimonialItem, SectorItem } from '../types';

export const COMPANY_INFO = {
  name: 'SK Services & Solutions Ltd',
  tagline: 'Static & Dog Handling Security Services',
  phone: '+44 7830 998699',
  phoneDisplay: '+44 7830 998699',
  email: 'info@skservicesandsolutions.co.uk',
  address: '21 Elmcroft Close, Feltham, TW14 9HH',
  postcode: 'TW14 9HH',
  location: '21 Elmcroft Close, Feltham, TW14 9HH, UK',
  rating: '4.9',
  totalReviews: '150+',
  mission: 'We pride ourselves on our ability to supply a cost-effective, bespoke service to the Corporate, Private and Public sector.',
  aboutIntro: 'SK Services & Solutions Ltd is a well-established security company providing comprehensive protection solutions across the UK.',
  eliteProtection:
    'At SK Services & Solutions Ltd, we pride ourselves on delivering security services that go beyond industry standards. Our teams consist of highly trained NASDU Level 2 handlers working with BS8517-1 compliant dogs, providing a strong visible deterrent, rapid response, and reliable protection across all types of sites. Unlike many providers, all our services are managed entirely in-house, ensuring consistency, accountability, and complete confidence that your people, property, and assets are in safe hands.',
  specialisationIntro:
    'At SK Services & Solutions Ltd, we tailor our services to suit various industries and premises. Our sector-specific solutions ensure maximum effectiveness and compliance.',
  trustStatement:
    'Professional security specialists working with some of the largest companies across the UK.',
  trustSub:
    'We specialise in delivering reliable, compliant, and cost-effective security solutions with our expertly trained NASDU L2 certified handlers and BS8517-1 standard security dogs.',
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'eviction-bailiff-support-services',
    title: 'Eviction and Bailiff Support Services',
    image: '/images/Eviction-Bailiff-Support.webp',
    description:
      'Professional and compliant security support for land, property, and legal enforcement operations.',
  },
  {
    id: 'security-guards',
    title: 'Security Guards',
    image: '/images/Security-Guards.webp',
    description: 'Professional, SIA-licensed security guards providing reliable on-site protection and peace of mind.',
  },
  {
    id: 'gatehouse-security',
    title: 'Gatehouse Security',
    image: '/images/Gatehouse-Security.webp',
    description: 'Dedicated gatehouse officers controlling site access, monitoring visitors, and ensuring secure entry points.',
  },
  {
    id: 'construction-site-security-dogs',
    title: 'Construction Site Security Dogs',
    image: '/images/Construction-Site-Security-Dogs.webp',
    description: 'Trained guard dogs deterring theft, vandalism, and trespassing on construction projects of every size.',
  },
  {
    id: 'k9-security-services',
    title: 'K9 Security Services',
    image: '/images/K9-Security-Services.webp',
    description: 'Specialist K9 teams delivering tailored security solutions for businesses, properties, and private clients.',
  },
  {
    id: 'vacant-property-security',
    title: 'Vacant Property Security',
    image: '/images/Vacant-Property-Security.jpg',
    description: 'Proactive patrols safeguarding empty or disused buildings from trespassers, squatters, and damage.',
  },
];

export const SECTORS_LIST: SectorItem[] = [
  {
    id: 'construction',
    title: 'Construction Site Dog Patrol',
    description: 'Specialist dog patrols protecting construction projects from theft, vandalism, and trespassing.',
    icon: '/images/hook.png',
  },
  {
    id: 'warehouse',
    title: 'Warehouse Dog Security',
    description: 'Trained K9 teams securing warehouses, stock, and equipment with rapid detection and deterrence.',
    icon: '/images/dog.png',
  },
  {
    id: 'industrial',
    title: 'Industrial Dog Security',
    description: 'Professional dog patrols safeguarding factories, plants, and industrial estates from unauthorised access.',
    icon: '/images/factory.png',
  },
  {
    id: 'residential',
    title: 'Residential Guard Dog Service',
    description: 'Reliable guard dog protection for homes, estates, and private residences across the UK.',
    icon: '/images/guard.png',
  },
];

export const TESTIMONIALS_LIST: TestimonialItem[] = [
  {
    id: '1',
    author: 'Teresia Dua',
    quote:
      'Professional company, great advice and really competitive prices. SK Services & Solutions Ltd looked after my property of 6 acres which has a large amount of storage on it, when there was a gathering of travellers in the area. Great job, thank you.',
    image: '/images/Team-4.jpg',
  },
  {
    id: '2',
    author: 'Thomas Edwards',
    quote:
      'Brilliant company, we have been using them for a while now and we have had no issues at all. Everyone has been very professional and always work to very high standards. Would definitely recommend to other companies who are looking for a professional security provider.',
    image: '/images/Testimonial-4.jpg',
  },
  {
    id: '3',
    author: 'Anne Frankline',
    quote:
      'Always prepared to adapt to the requirements at the time, time keeping was spot on and always friendly and approachable. Will definitely use again and would highly recommend.',
    image: '/images/Testimonial-3-1.jpg',
  },
  {
    id: '4',
    author: 'Frankline',
    quote:
      'I currently sub work from SK Services & Solutions Ltd, and I can honestly say I’ve not suffered any issues with them yet. Pay is always on time, if not early, any issues are sorted immediately, the boss is a really nice, genuine guy, who has worked the profession himself for many years so knows the score.',
    image: '/images/Testimonial-1.jpg',
  },
];

export const ACCREDITATION_LOGOS = [
  { id: '1', src: '/images/i1-1.webp', alt: 'Accreditation 1' },
  { id: '2', src: '/images/i2-1.webp', alt: 'Accreditation 2' },
  { id: '3', src: '/images/i3-1.webp', alt: 'Accreditation 3' },
  { id: '4', src: '/images/i5-1.webp', alt: 'Accreditation 4' },
  { id: '5', src: '/images/i6-1.webp', alt: 'Accreditation 5' },
];

export const SERVICE_OPTIONS = [
  'Eviction and Bailiff Support Services',
  'Security Guards',
  'Gatehouse Security',
  'Construction Site Security Dogs',
  'K9 Security Services',
  'Vacant Property Security',
  'Dog Patrol Services',
  '24/7 Security Dog Services',
  'K9 Night Patrol Services',
  'K9 Security Dogs and Dog Handlers',
  'Other',
];
