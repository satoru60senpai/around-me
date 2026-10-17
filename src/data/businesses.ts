/**
 * Données de démonstration Around Me — Lomé, Togo.
 * ⚠️ Fictives : les commerces, numéros, avis et prix ne représentent aucun établissement réel.
 * Ce fichier est la source unique : seed Prisma + fallback hors-ligne (APK).
 */

export type CategoryKey =
  | 'manger' | 'cafe' | 'acheter' | 'argent' | 'services'
  | 'beaute' | 'telephone' | 'reparation' | 'sante' | 'transport';

export interface Category {
  key: CategoryKey;
  label: string;
  tint: string; // fond pastel
  fg: string; // couleur icône
}

export interface Business {
  slug: string;
  name: string;
  category: CategoryKey;
  tags: string[];
  description: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  phone: string; // affichage
  phoneDial: string; // tel:+228...
  whatsapp: boolean;
  image: string;
  rating: number;
  reviews: number;
  priceHint?: string;
  priceUpdatedDays?: number;
  verified: boolean;
  openTime: string; // "08:00" (heure de Lomé, UTC+0)
  closeTime: string; // "19:00"
  daysOpen: 'mon-sat' | 'mon-sun';
  services: string[];
  payments: string[];
  distanceKm?: number;
  isOpen?: boolean;
}

export const CATEGORIES: Category[] = [
  { key: 'manger', label: 'Manger', tint: '#FFE7E1', fg: '#D65A47' },
  { key: 'cafe', label: 'Café', tint: '#F7ECE0', fg: '#8C6D4F' },
  { key: 'acheter', label: 'Acheter', tint: '#F1E6D2', fg: '#9A7B3F' },
  { key: 'argent', label: 'Argent', tint: '#E7EFE0', fg: '#5F7D4E' },
  { key: 'services', label: 'Services', tint: '#EFEAE0', fg: '#7A6A55' },
  { key: 'beaute', label: 'Beauté', tint: '#FBE4E9', fg: '#B05A6E' },
  { key: 'telephone', label: 'Téléphone', tint: '#E4EAEF', fg: '#5B7488' },
  { key: 'reparation', label: 'Réparation', tint: '#F4E1D7', fg: '#A65E42' },
  { key: 'sante', label: 'Santé', tint: '#E9F0E9', fg: '#4E7D5B' },
  { key: 'transport', label: 'Transport', tint: '#F5EBD6', fg: '#A5822F' },
];

export interface Zone { key: string; label: string; lat: number; lng: number; }

export const ZONES: Zone[] = [
  { key: 'tokoin', label: 'Tokoin', lat: 6.1750, lng: 1.2314 },
  { key: 'adidogome', label: 'Adidogomé', lat: 6.1690, lng: 1.2195 },
  { key: 'akodessewa', label: 'Akodessewa', lat: 6.1620, lng: 1.2130 },
  { key: 'agbalepedogan', label: 'Agbalépédogan', lat: 6.1890, lng: 1.2300 },
  { key: 'amoutive', label: 'Amoutivé', lat: 6.1840, lng: 1.2400 },
  { key: 'kodjoviakope', label: 'Kodjoviakopé', lat: 6.1420, lng: 1.2230 },
  { key: 'be', label: 'Bè', lat: 6.1330, lng: 1.2410 },
  { key: 'centre', label: 'Centre-ville', lat: 6.1300, lng: 1.2260 },
];

export const DEFAULT_ZONE = 'tokoin';
export const LOME_CENTER = { lat: 6.1550, lng: 1.2270 };

export const POPULAR_SEARCHES = [
  'réparation téléphone',
  'coiffeur',
  'pharmacie',
  'poisson braisé',
  'café wifi',
];

const IMG = '/images/shops';

export const BUSINESSES: Business[] = [
  {
    slug: 'telephone-service-tokoin',
    name: 'Téléphone Service Tokoin',
    category: 'reparation',
    tags: ['Réparation', 'Téléphones', 'Accessoires'],
    description:
      "Atelier de réparation téléphonique réputé du quartier Tokoin. Écrans, batteries, connecteurs de charge et débloquage tout opérateur. Devis gratuit avant intervention, pièces garanties 3 mois.",
    neighborhood: 'Tokoin',
    address: 'Avenue Nkrumah, Tokoin, Lomé',
    lat: 6.1772,
    lng: 1.2301,
    phone: '+228 90 12 34 56',
    phoneDial: '+22890123456',
    whatsapp: true,
    image: `${IMG}/phone-repair.jpg`,
    rating: 4.3,
    reviews: 28,
    priceHint: 'Réparation écran dès 8 000 F CFA',
    priceUpdatedDays: 3,
    verified: true,
    openTime: '08:00',
    closeTime: '19:00',
    daysOpen: 'mon-sat',
    services: ['Écran cassé', 'Batterie', 'Déblocage', 'Accessoires'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'repar-phone-adidogome',
    name: "Répar'Phone Adidogomé",
    category: 'reparation',
    tags: ['Réparation', 'Téléphones', 'Logiciels'],
    description:
      "Réparation rapide de smartphones et tablettes à Adidogomé. Flash, mise à jour logicielle, remplacement d'écran et de batterie pendant que vous attendez.",
    neighborhood: 'Adidogomé',
    address: "Route d'Adidogomé, face à la pharmacie, Lomé",
    lat: 6.1698,
    lng: 1.2204,
    phone: '+228 91 22 33 44',
    phoneDial: '+22891223344',
    whatsapp: true,
    image: `${IMG}/phone-repair.jpg`,
    rating: 4.1,
    reviews: 19,
    priceHint: 'Changement de batterie dès 5 000 F CFA',
    priceUpdatedDays: 5,
    verified: false,
    openTime: '08:00',
    closeTime: '18:30',
    daysOpen: 'mon-sat',
    services: ['Écran', 'Batterie', 'Logiciels', 'Chargeurs'],
    payments: ['TMoney', 'Espèces'],
  },
  {
    slug: 'electro-reparation-be',
    name: 'Électro Réparation Bè',
    category: 'reparation',
    tags: ['Électronique', 'TV', 'Décodeurs'],
    description:
      "Dépannage d'électronique au quartier Bè : téléviseurs, radios, décodeurs et petit électroménager. Diagnostic gratuit, intervention à domicile possible.",
    neighborhood: 'Bè',
    address: 'Boulevard du Mono, Bè, Lomé',
    lat: 6.1352,
    lng: 1.2389,
    phone: '+228 93 44 55 66',
    phoneDial: '+22893445566',
    whatsapp: false,
    image: `${IMG}/electronics.jpg`,
    rating: 4.0,
    reviews: 12,
    priceHint: 'Diagnostic gratuit · déplacement dès 2 000 F CFA',
    priceUpdatedDays: 7,
    verified: false,
    openTime: '09:00',
    closeTime: '20:00',
    daysOpen: 'mon-sun',
    services: ['TV & écrans', 'Décodeurs', 'Radios', 'Petit électroménager'],
    payments: ['Flooz', 'Espèces'],
  },
  {
    slug: 'cafe-du-boulevard',
    name: 'Café du Boulevard',
    category: 'cafe',
    tags: ['Café', 'Pâtisserie', 'Wifi'],
    description:
      'Terrasse ombragée au bord du boulevard : café torréfié localement, viennoiseries, jus frais et wifi rapide. Idéal pour travailler ou se retrouver entre amis.',
    neighborhood: 'Kodjoviakopé',
    address: 'Boulevard Eyadéma, Kodjoviakopé, Lomé',
    lat: 6.1412,
    lng: 1.2216,
    phone: '+228 92 33 21 10',
    phoneDial: '+22892332110',
    whatsapp: true,
    image: `${IMG}/cafe.jpg`,
    rating: 4.5,
    reviews: 41,
    priceHint: 'Café + viennoiserie dès 1 500 F CFA',
    priceUpdatedDays: 1,
    verified: true,
    openTime: '07:00',
    closeTime: '22:00',
    daysOpen: 'mon-sun',
    services: ['Wifi', 'Terrasse', 'Petit-déjeuner', 'À emporter'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'chez-afi-cuisine-togolaise',
    name: 'Chez Afi — Cuisine Togolaise',
    category: 'manger',
    tags: ['Cuisine locale', 'Grillades', 'Plats à emporter'],
    description:
      'La vraie cuisine togolaise près du marché de Tokoin : sauces arachide et gombo, attiéké, akoumé, riz gras. Plats du jour préparés matin et soir.',
    neighborhood: 'Tokoin',
    address: 'Rue 12, Tokoin Hôpital, Lomé',
    lat: 6.1802,
    lng: 1.2342,
    phone: '+228 90 55 66 77',
    phoneDial: '+22890556677',
    whatsapp: true,
    image: `${IMG}/restaurant.jpg`,
    rating: 4.6,
    reviews: 52,
    priceHint: 'Plat du jour dès 2 000 F CFA',
    priceUpdatedDays: 2,
    verified: true,
    openTime: '10:00',
    closeTime: '22:00',
    daysOpen: 'mon-sun',
    services: ['Sur place', 'À emporter', 'Plats du jour', 'Commandes'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'maquis-du-mono',
    name: 'Maquis du Mono',
    category: 'manger',
    tags: ['Maquis', 'Poisson braisé', 'Aloco'],
    description:
      "Ambiance conviviale au bord du Mono : tilapia braisé au feu de bois, alloco, piment vert et boissons fraîches jusqu'à tard le soir.",
    neighborhood: 'Bè',
    address: "Route d'Aného, Bè, Lomé",
    lat: 6.1375,
    lng: 1.2465,
    phone: '+228 91 88 77 66',
    phoneDial: '+22891887766',
    whatsapp: false,
    image: `${IMG}/fish-grill.jpg`,
    rating: 4.2,
    reviews: 24,
    priceHint: 'Poisson braisé + aloco dès 3 500 F CFA',
    priceUpdatedDays: 4,
    verified: false,
    openTime: '11:00',
    closeTime: '23:30',
    daysOpen: 'mon-sun',
    services: ['Poisson braisé', 'Aloco', 'Terrasse', 'Soirée'],
    payments: ['TMoney', 'Espèces'],
  },
  {
    slug: 'coiffure-elegance-agbalepedogan',
    name: 'Coiffure Élégance',
    category: 'beaute',
    tags: ['Coiffure', 'Tresses', 'Soins'],
    description:
      "Salon de coiffure féminine à Agbalépédogan : tresses, tissages, colorations et soins. Équipe de 4 coiffeuses, sans rendez-vous ou sur réservation WhatsApp.",
    neighborhood: 'Agbalépédogan',
    address: 'Carrefour Agbalépédogan, Lomé',
    lat: 6.1895,
    lng: 1.2312,
    phone: '+228 93 10 20 30',
    phoneDial: '+22893102030',
    whatsapp: true,
    image: `${IMG}/hair-salon.jpg`,
    rating: 4.4,
    reviews: 31,
    priceHint: 'Tresses simples dès 3 000 F CFA',
    priceUpdatedDays: 6,
    verified: true,
    openTime: '08:00',
    closeTime: '20:00',
    daysOpen: 'mon-sat',
    services: ['Tresses', 'Tissage', 'Coloration', 'Soins capillaires'],
    payments: ['TMoney', 'Espèces'],
  },
  {
    slug: 'barbier-nkrumah',
    name: 'Barbier Nkrumah',
    category: 'beaute',
    tags: ['Barbier', 'Coupe homme', 'Barbe'],
    description:
      "Salon de barbier sur l'avenue Nkrumah : dégradés, coupes classiques, taille de barbe au rasoir chaud. Rapide, soigné, musique au programme.",
    neighborhood: 'Tokoin',
    address: 'Avenue Nkrumah, Tokoin, Lomé',
    lat: 6.1760,
    lng: 1.2276,
    phone: '+228 90 44 33 22',
    phoneDial: '+22890443322',
    whatsapp: true,
    image: `${IMG}/barbershop.jpg`,
    rating: 4.3,
    reviews: 17,
    priceHint: 'Coupe + barbe dès 2 000 F CFA',
    priceUpdatedDays: 3,
    verified: false,
    openTime: '08:30',
    closeTime: '20:00',
    daysOpen: 'mon-sat',
    services: ['Dégradé', 'Coupe classique', 'Barbe', 'Enfant'],
    payments: ['Flooz', 'Espèces'],
  },
  {
    slug: 'pharmacie-du-boulevard',
    name: 'Pharmacie du Boulevard',
    category: 'sante',
    tags: ['Pharmacie', 'Conseil', 'Matériel médical'],
    description:
      'Pharmacie moderne sur le Boulevard du 13 Janvier : médicaments, matériel médical, tests rapides et conseil pharmaceutique. Équipe disponible et attentive.',
    neighborhood: 'Tokoin',
    address: 'Boulevard du 13 Janvier, Tokoin, Lomé',
    lat: 6.1748,
    lng: 1.2255,
    phone: '+228 22 21 30 40',
    phoneDial: '+22822213040',
    whatsapp: false,
    image: `${IMG}/pharmacy.jpg`,
    rating: 4.7,
    reviews: 63,
    priceHint: "Ouvert jusqu'à 22 h tous les jours",
    priceUpdatedDays: 1,
    verified: true,
    openTime: '08:00',
    closeTime: '22:00',
    daysOpen: 'mon-sun',
    services: ['Médicaments', 'Matériel médical', 'Tests rapides', 'Conseil'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'boutique-mawuli-centre',
    name: 'Boutique Mawuli',
    category: 'acheter',
    tags: ['Mode', 'Tissus', 'Accessoires'],
    description:
      'Prêt-à-porter et tissus wax près du Grand Marché : pagnes authentiques, chemises, boubous et accessoires pour toute la famille.',
    neighborhood: 'Centre-ville',
    address: 'Rue du Commerce, près du Grand Marché, Lomé',
    lat: 6.1295,
    lng: 1.2248,
    phone: '+228 92 55 44 33',
    phoneDial: '+22892554433',
    whatsapp: true,
    image: `${IMG}/boutique.jpg`,
    rating: 4.1,
    reviews: 22,
    priceHint: 'Pagne wax dès 5 000 F CFA',
    priceUpdatedDays: 8,
    verified: false,
    openTime: '08:00',
    closeTime: '19:00',
    daysOpen: 'mon-sat',
    services: ['Tissus wax', 'Prêt-à-porter', 'Accessoires', 'Retouches'],
    payments: ['TMoney', 'Espèces'],
  },
  {
    slug: 'money-plus-kodjoviakope',
    name: 'Money+ Services',
    category: 'argent',
    tags: ['Transfert', 'Mobile Money', 'Change'],
    description:
      "Agence de transfert d'argent et services mobile money à Kodjoviakopé : Western Union, Ria, Flooz, TMoney et petite monnaie.",
    neighborhood: 'Kodjoviakopé',
    address: 'Boulevard Eyadéma, Kodjoviakopé, Lomé',
    lat: 6.1428,
    lng: 1.2245,
    phone: '+228 90 77 88 99',
    phoneDial: '+22890778899',
    whatsapp: true,
    image: `${IMG}/money.jpg`,
    rating: 4.0,
    reviews: 9,
    priceHint: 'Frais de transfert dès 1 %',
    priceUpdatedDays: 10,
    verified: true,
    openTime: '08:00',
    closeTime: '18:00',
    daysOpen: 'mon-sat',
    services: ['Western Union', 'Ria', 'Flooz / TMoney', 'Change'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'zemidjan-express-amoutive',
    name: 'Zémidjan Express',
    category: 'transport',
    tags: ['Course', 'Livraison'],
    description:
      "Courses en ville et livraison de colis à Amoutivé et partout à Lomé. Motards expérimentés, disponibles dès 6 h du matin.",
    neighborhood: 'Amoutivé',
    address: 'Carrefour Amoutivé, Lomé',
    lat: 6.1832,
    lng: 1.2418,
    phone: '+228 99 11 22 33',
    phoneDial: '+22899112233',
    whatsapp: true,
    image: `${IMG}/zemidjan.jpg`,
    rating: 4.2,
    reviews: 38,
    priceHint: 'Course en ville dès 500 F CFA',
    priceUpdatedDays: 2,
    verified: false,
    openTime: '06:00',
    closeTime: '21:30',
    daysOpen: 'mon-sun',
    services: ['Course courte', 'Livraison colis', 'Abonnement mois'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
  {
    slug: 'print-center-lome',
    name: 'Print Center Lomé',
    category: 'services',
    tags: ['Imprimerie', 'Photocopie', 'Reliure'],
    description:
      "Imprimerie et cybercafé sur la route d'Amoutivé : photocopies, impressions A4/A3, reliures, affiches et cartes de visite.",
    neighborhood: 'Amoutivé',
    address: "Route d'Amoutivé, face à la station, Lomé",
    lat: 6.1850,
    lng: 1.2380,
    phone: '+228 93 66 55 44',
    phoneDial: '+22893665544',
    whatsapp: true,
    image: `${IMG}/printshop.jpg`,
    rating: 4.3,
    reviews: 14,
    priceHint: 'Photocopie dès 25 F CFA / page',
    priceUpdatedDays: 5,
    verified: true,
    openTime: '08:00',
    closeTime: '18:30',
    daysOpen: 'mon-sat',
    services: ['Photocopie', 'Impression', 'Reliure', 'Cartes de visite'],
    payments: ['Flooz', 'TMoney', 'Espèces'],
  },
];
