export const localities = [
  { slug: "hinjwadi", name: "Hinjewadi", count: 142, from: "₹65L", tag: "IT Corridor", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80" },
  { slug: "baner", name: "Baner", count: 98, from: "₹1.2 Cr", tag: "Premium Living", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80" },
  { slug: "koregaon", name: "Koregaon Park", count: 76, from: "₹2.5 Cr", tag: "Heritage Luxe", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
  { slug: "kharadi", name: "Kharadi", count: 61, from: "₹85L", tag: "Riverside Calm", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { slug: "wakad", name: "Wakad", count: 88, from: "₹70L", tag: "Family Favourite", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
  { slug: "aundh", name: "Aundh", count: 54, from: "₹1.4 Cr", tag: "Old-World Charm", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" },
] as const;

export type LocalitySlug = (typeof localities)[number]["slug"];

export const projects = [
  { slug: "lodha-belmondo", name: "Lodha Belmondo Residences", location: "Baner · Pune West", config: "3, 4 BHK", area: "1850–3200 sq.ft", possession: "Dec 2027", price: "₹2.85 Cr", badge: "New Launch", badgeAlt: false, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80" },
  { slug: "godrej-splendour", name: "Godrej Splendour Park", location: "Hinjewadi · Phase 2", config: "2, 3 BHK", area: "950–1480 sq.ft", possession: "Ready", price: "₹1.15 Cr", badge: "Trending", badgeAlt: true, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80" },
  { slug: "kolte-patil-itowers", name: "Kolte Patil iTowers", location: "Hinjewadi Phase I · Pune", config: "2, 3, 4 BHK", area: "850–1550 sq.ft", possession: "Ready Dec 2024", price: "₹1.1 Cr", badge: "Ready to Move", badgeAlt: false, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
] as const;

export const advisors = [
  { name: "Aditya Khanna", role: "Founder · Senior Advisor", exp: "16 yrs", area: "Pune Markets", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80" },
  { name: "Meera Joshi", role: "Head · West Pune", exp: "11 yrs", area: "Baner & Hinjewadi", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80" },
  { name: "Rohan Deshmukh", role: "Head · East Pune", exp: "9 yrs", area: "Kharadi & Hadapsar", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80" },
  { name: "Priya Bhandari", role: "Lead · Legal & Loans", exp: "13 yrs", area: "Documentation", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80" },
] as const;

export const testimonials = [
  { quote: "Aditya's team didn't push us into the most expensive option — they walked us through three Baner societies and explained the trade-offs honestly. We've found our home and a long-term advisor.", name: "Priya & Rohit Kulkarni", initials: "PR", meta: "Lodha Belmondo · Baner" },
  { quote: "Being a first-time buyer was overwhelming. Meera made the paperwork feel effortless and got me a rate that two banks hadn't offered me directly. Genuine professionals.", name: "Anand Sharma", initials: "AS", meta: "Godrej Splendour · Hinjewadi" },
  { quote: "We were relocating from Bangalore and didn't know Pune. Rohan curated a shortlist over a video call, then showed us only the four that mattered. Saved us weeks.", name: "Nikhil & Vandana Iyer", initials: "NV", meta: "Kolte Patil 24K · Koregaon Park" },
] as const;

export const developers = [
  { name: "Lodha", glyph: "diamond" },
  { name: "godrej", glyph: "circle-arrow", bold: true },
  { name: "Mahindra", glyph: "mm", bold: true },
  { name: "Kolte Patil", glyph: "kp-square" },
  { name: "Karanji", glyph: "k-circle" },
  { name: "Panchshil", glyph: "star", bold: true },
  { name: "Kalpataru", glyph: "waves" },
  { name: "VTP Realty", glyph: "vtp", bold: true },
] as const;

export const interiors = [
  {
    slug: "full-home",
    title: "Full Home Interiors",
    description: "End-to-end interior design from concept to handover. Personalised for how your family actually lives.",
    duration: "45–90 days",
    from: "₹1,500 /sqft",
    includes: [
      "3D visualisation & mood boards",
      "Modular furniture & loose pieces",
      "Lighting plan & electrical layout",
      "10-year warranty on woodwork",
    ],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "modular-kitchen",
    title: "Modular Kitchens",
    description: "German hardware, Indian sensibility. Built around how you cook — not catalogue showpieces.",
    duration: "30–45 days",
    from: "₹2.5 L",
    includes: [
      "Hettich / Häfele hardware",
      "Quartz or granite counters",
      "Tall units, pantry, breakfast bar",
      "Appliance pre-fit & integration",
    ],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "lifestyle-spaces",
    title: "Living Room & Wardrobes",
    description: "Targeted upgrades — that one room you've been meaning to fix, or storage that finally fits everything.",
    duration: "20–35 days",
    from: "₹85,000",
    includes: [
      "Custom wardrobes & dressing units",
      "Living room TV unit & seating",
      "Foyer & study makeovers",
      "Wallpapers, panelling, lighting",
    ],
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
  },
] as const;

export type Status = "ready" | "under-construction";

export type Property = {
  slug: string;
  name: string;
  builder: string;
  localitySlug: string;
  localityArea: string;
  status: Status;
  bhkRange: string;
  bhkOptions: number[];
  areaMin: string;
  areaRange: string;
  possessionLabel: string;
  possessionYear: number;
  priceDisplay: string;
  priceMin: number;
  priceMax: number;
  thumbnail: string;
  images: string[];
  rera: string;
  totalUnits: number;
  about: string;
  bhkConfigs: { config: string; area: string; from: string; floorPlan?: string }[];
  amenities: { title: string; desc: string; icon: string }[];
  nearby: { place: string; distance: string }[];
  advisor: { initials: string; name: string; role: string; rating: number };
  // New Info Container Fields from Screenshot 2026-05-13 at 1.06.24 AM.png
  landParcel: string;
  towers: string;
  floors: string;
  litigation: string;
  reraPossession: string;
};

const STD_GALLERY = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
];

const STD_AMENITIES = [
  { icon: "clubhouse", title: "Clubhouse", desc: "3,000 sqft · Party hall, indoor games, lounge" },
  { icon: "pool", title: "Swimming Pool", desc: "Olympic-size · Separate kids' pool" },
  { icon: "security", title: "24/7 Security", desc: "CCTV + biometric · Trained personnel" },
  { icon: "gym", title: "Gymnasium", desc: "2,500 sqft · Cardio, strength, yoga zones" },
  { icon: "play", title: "Children's Play Area", desc: "Soft surface · Age-appropriate equipment" },
  { icon: "parking", title: "Covered Parking", desc: "1.5 cars per unit · EV charging ready" },
  { icon: "power", title: "Power Backup", desc: "100% common areas · Apartment backup" },
  { icon: "garden", title: "Landscaped Garden", desc: "65% open green space · Walking trails" },
  { icon: "jog", title: "Jogging Track", desc: "800 m circuit · Soft rubber surface" },
];

const STD_NEARBY = [
  { place: "IT Park", distance: "3.5 km · 10 min" },
  { place: "Hinjwadi Metro", distance: "0.5 km · 2 min" },
  { place: "Mumbai-Pune Expressway", distance: "8 km · 12 min" },
  { place: "Symbiosis University", distance: "4 km · 10 min" },
];

const STD_ADVISOR = { initials: "RM", name: "Riya Mehta", role: "Senior Advisor", rating: 4.9 };

function P(p: Partial<Property> & Pick<Property,
  "slug" | "name" | "builder" | "localitySlug" | "localityArea" | "status"
  | "bhkRange" | "bhkOptions" | "areaMin" | "possessionLabel" | "possessionYear"
  | "priceDisplay" | "priceMin" | "priceMax" | "thumbnail" | "bhkConfigs" | "rera"
>): Property {
  return {
    images: STD_GALLERY,
    amenities: STD_AMENITIES,
    nearby: STD_NEARBY,
    advisor: STD_ADVISOR,
    totalUnits: 510,
    areaRange: "850 – 1,550 sqft",
    // New defaults based on Screenshot 2026-05-13 at 1.06.24 AM.png
    landParcel: "4.5 Acres",
    towers: "6",
    floors: "G+28",
    litigation: "No",
    reraPossession: `Dec ${p.possessionYear}`,
    about:
      `${p.name} in ${p.localityArea} — a RERA-registered development by ${p.builder} ` +
      `set across configurations of ${p.bhkRange}. Designed for modern Pune families, ` +
      `it pairs thoughtful planning with the conveniences this neighbourhood is known for.`,
    ...p,
  } as Property;
}

export const properties: Property[] = [
  P({
    slug: "kolte-patil-itowers",
    name: "Kolte Patil iTowers",
    builder: "Kolte Patil",
    localitySlug: "hinjwadi",
    localityArea: "Hinjwadi Phase I, Pune",
    status: "ready",
    bhkRange: "2, 3, 4 BHK",
    bhkOptions: [2, 3, 4],
    areaMin: "1,050 sqft min",
    areaRange: "1,050 – 2,100 sqft",
    possessionLabel: "Possession 2024",
    possessionYear: 2024,
    priceDisplay: "₹ 1.1 Cr – 2.2 Cr",
    priceMin: 110, priceMax: 220,
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    rera: "P52100123456",
    landParcel: "8 Acres",
    towers: "5",
    floors: "G+32",
    litigation: "No",
    reraPossession: "Dec 2024",
    bhkConfigs: [
      { config: "2 BHK", area: "850 sqft", from: "Starts ₹72 L" },
      { config: "3 BHK", area: "1,350 sqft", from: "Starts ₹95 L" },
      { config: "4 BHK", area: "1,550 sqft", from: "Starts ₹1.1 Cr" },
    ],
    about:
      "Kolte Patil iTowers in Hinjwadi Phase I, Pune — 5 minutes from Rajiv Gandhi Infotech Park " +
      "and 8 minutes from the upcoming Hinjwadi metro station. The 8-acre project from Kolte Patil " +
      "includes 510 RERA-registered units across 2, 3, 4 BHK configurations, with possession from " +
      "2024. Designed for IT professionals and young families, it offers a 12,000 sqft clubhouse, " +
      "swimming pool, and 65% open green space. Builder track record: 22+ completed projects in Pune.",
  }),
  P({
    slug: "mahindra-nestalgia", name: "Mahindra Nestalgia", builder: "Mahindra Lifespaces",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi, Pune", status: "under-construction",
    bhkRange: "2, 3 BHK", bhkOptions: [2, 3], areaMin: "780 sqft min",
    possessionLabel: "Possession 2027", possessionYear: 2027,
    priceDisplay: "₹ 67 L – 95 L", priceMin: 67, priceMax: 95,
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    rera: "P52100123712",
    bhkConfigs: [
      { config: "2 BHK", area: "780 sqft", from: "Starts ₹67 L" },
      { config: "3 BHK", area: "1,180 sqft", from: "Starts ₹95 L" },
    ],
  }),
  P({
    slug: "vtp-solitaire", name: "VTP Solitaire", builder: "VTP Realty",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi Phase III, Pune", status: "ready",
    bhkRange: "2, 3 BHK", bhkOptions: [2, 3], areaMin: "860 sqft min",
    possessionLabel: "Possession 2025", possessionYear: 2025,
    priceDisplay: "₹ 75 L – 1.2 Cr", priceMin: 75, priceMax: 120,
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    rera: "P52100126544",
    bhkConfigs: [
      { config: "2 BHK", area: "860 sqft", from: "Starts ₹75 L" },
      { config: "3 BHK", area: "1,240 sqft", from: "Starts ₹1.05 Cr" },
    ],
  }),
  P({
    slug: "paranjape-athashri", name: "Paranjape Athashri", builder: "Paranjape Schemes",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi, Pune", status: "ready",
    bhkRange: "2, 3 BHK", bhkOptions: [2, 3], areaMin: "980 sqft min",
    possessionLabel: "Possession 2024", possessionYear: 2024,
    priceDisplay: "₹ 90 L – 1.5 Cr", priceMin: 90, priceMax: 150,
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    rera: "P52100128990",
    bhkConfigs: [
      { config: "2 BHK", area: "980 sqft", from: "Starts ₹90 L" },
      { config: "3 BHK", area: "1,400 sqft", from: "Starts ₹1.3 Cr" },
    ],
  }),
  P({
    slug: "kumar-princetown", name: "Kumar Princetown", builder: "Kumar Properties",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi, Pune", status: "under-construction",
    bhkRange: "2, 3, 4 BHK", bhkOptions: [2, 3, 4], areaMin: "920 sqft min",
    possessionLabel: "Possession 2026", possessionYear: 2026,
    priceDisplay: "₹ 80 L – 1.6 Cr", priceMin: 80, priceMax: 160,
    thumbnail: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=80",
    rera: "P52100130011",
    bhkConfigs: [
      { config: "2 BHK", area: "920 sqft", from: "Starts ₹80 L" },
      { config: "3 BHK", area: "1,320 sqft", from: "Starts ₹1.15 Cr" },
      { config: "4 BHK", area: "1,650 sqft", from: "Starts ₹1.6 Cr" },
    ],
  }),
  P({
    slug: "rohan-upavan", name: "Rohan Upavan", builder: "Rohan Builders",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi, Pune", status: "ready",
    bhkRange: "2, 3 BHK", bhkOptions: [2, 3], areaMin: "840 sqft min",
    possessionLabel: "Possession 2025", possessionYear: 2025,
    priceDisplay: "₹ 72 L – 1.1 Cr", priceMin: 72, priceMax: 110,
    thumbnail: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
    rera: "P52100131225",
    bhkConfigs: [
      { config: "2 BHK", area: "840 sqft", from: "Starts ₹72 L" },
      { config: "3 BHK", area: "1,240 sqft", from: "Starts ₹1.05 Cr" },
    ],
  }),
  P({
    slug: "pride-purple-park-titan", name: "Pride Purple Park Titan", builder: "Pride Purple",
    localitySlug: "hinjwadi", localityArea: "Hinjwadi, Pune", status: "under-construction",
    bhkRange: "1, 2 BHK", bhkOptions: [1, 2], areaMin: "610 sqft min",
    possessionLabel: "Possession 2027", possessionYear: 2027,
    priceDisplay: "₹ 49 L – 78 L", priceMin: 49, priceMax: 78,
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    rera: "P52100132901",
    bhkConfigs: [
      { config: "1 BHK", area: "610 sqft", from: "Starts ₹49 L" },
      { config: "2 BHK", area: "880 sqft", from: "Starts ₹78 L" },
    ],
  }),
  P({
    slug: "lodha-belmondo", name: "Lodha Belmondo Residences", builder: "Lodha Group",
    localitySlug: "baner", localityArea: "Baner · Pune West", status: "under-construction",
    bhkRange: "3, 4 BHK", bhkOptions: [3, 4], areaMin: "1,850 sqft min",
    possessionLabel: "Possession Dec 2027", possessionYear: 2027,
    priceDisplay: "₹ 2.85 Cr – 4.2 Cr", priceMin: 285, priceMax: 420,
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    rera: "P52100118011",
    bhkConfigs: [
      { config: "3 BHK", area: "1,850 sqft", from: "Starts ₹2.85 Cr" },
      { config: "4 BHK", area: "3,200 sqft", from: "Starts ₹4.2 Cr" },
    ],
  }),
  P({
    slug: "godrej-splendour", name: "Godrej Splendour Park", builder: "Godrej Properties",
    localitySlug: "baner", localityArea: "Baner · Pune West", status: "ready",
    bhkRange: "2, 3 BHK", bhkOptions: [2, 3], areaMin: "950 sqft min",
    possessionLabel: "Ready to Move", possessionYear: 2024,
    priceDisplay: "₹ 1.15 Cr – 1.8 Cr", priceMin: 115, priceMax: 180,
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    rera: "P52100120033",
    bhkConfigs: [
      { config: "2 BHK", area: "950 sqft", from: "Starts ₹1.15 Cr" },
      { config: "3 BHK", area: "1,480 sqft", from: "Starts ₹1.65 Cr" },
    ],
  }),
  P({
    slug: "kolte-patil-24k-allure", name: "Kolte Patil 24K Allure", builder: "Kolte Patil",
    localitySlug: "koregaon", localityArea: "Koregaon Park · Pune East", status: "under-construction",
    bhkRange: "4, 5 BHK", bhkOptions: [4, 5], areaMin: "3,400 sqft min",
    possessionLabel: "Possession Mar 2026", possessionYear: 2026,
    priceDisplay: "₹ 4.95 Cr – 7.2 Cr", priceMin: 495, priceMax: 720,
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    rera: "P52100114501",
    bhkConfigs: [
      { config: "4 BHK", area: "3,400 sqft", from: "Starts ₹4.95 Cr" },
      { config: "5 BHK", area: "4,800 sqft", from: "Starts ₹7.2 Cr" },
    ],
  }),
];

export const interiorCategories = [
  { slug: "bedroom", name: "Bedroom", icon: "bed" },
  { slug: "wardrobes", name: "Wardrobes", icon: "wardrobe" },
  { slug: "false-ceiling", name: "False Ceiling", icon: "ceiling" },
  { slug: "bathroom", name: "Bathroom", icon: "bath" },
  { slug: "foyer", name: "Foyer & Entry", icon: "door" },
  { slug: "study", name: "Study Room", icon: "desk" },
] as const;

export const interiorTrust = [
  { title: "10 Years", sub: "Warranty on woodwork", icon: "shield" },
  { title: "45 Days", sub: "Average delivery", icon: "truck" },
  { title: "No Cost", sub: "EMI options available", icon: "rupee" },
  { title: "100% Quality", sub: "Assured by experts", icon: "check" },
] as const;

export type Builder = {
  slug: string;
  name: string;
  experience: string;
  totalProjects: number;
  happyFamilies: string;
  locations: string[];
  about: string;
  // Wordmark settings — used because external builder logos often 404
  wordmark: { text: string; tagline: string; color?: string };
};

export const builders: Builder[] = [
  {
    slug: "Lodha Group",
    name: "Lodha Group",
    experience: "45 years",
    totalProjects: 44,
    happyFamilies: "65K+",
    locations: ["Hyderabad", "Ahmedabad", "Bangalore Rural", "Bangalore Urban", "Mumbai City", "Mumbai suburban", "Pune"],
    about:
      "At Lodha, our passion is to create landmarks that meet global standards, epitomise the values of our family, and are built on a legacy of trust spanning four decades. We are guided by our vision of 'Building a Better Life' and believe that homes transform lives. A home is a springboard for the dreams and aspirations, for living a healthier and fulfilled life.",
    wordmark: { text: "LODHA", tagline: "BUILDING A BETTER LIFE" },
  },
  {
    slug: "Kolte Patil",
    name: "Kolte Patil",
    experience: "32 years",
    totalProjects: 50,
    happyFamilies: "20K+",
    locations: ["Pune", "Mumbai", "Bangalore"],
    about:
      "Kolte Patil has been a trusted name in Indian real estate since 1991, redefining quality living across Pune, Mumbai, and Bangalore. Every home is built on a foundation of architectural integrity, transparent practices, and a deep understanding of how families actually live.",
    wordmark: { text: "KOLTE PATIL", tagline: "CRAFTED FOR LIFE" },
  },
  {
    slug: "Mahindra Lifespaces",
    name: "Mahindra Lifespaces",
    experience: "30 years",
    totalProjects: 35,
    happyFamilies: "25K+",
    locations: ["Mumbai", "Pune", "Nagpur", "Chennai", "Bangalore"],
    about:
      "Mahindra Lifespaces is the real estate and infrastructure development business of the Mahindra Group, anchored in trust and a sustainable approach. Homes are built around green standards and the long-term wellbeing of residents.",
    wordmark: { text: "MAHINDRA", tagline: "LIFESPACES" },
  },
  {
    slug: "VTP Realty",
    name: "VTP Realty",
    experience: "22 years",
    totalProjects: 28,
    happyFamilies: "12K+",
    locations: ["Pune"],
    about:
      "Born and rooted in Pune, VTP Realty has shaped the city's modern residential skyline with a portfolio of design-forward, well-priced homes that consistently deliver on time.",
    wordmark: { text: "VTP", tagline: "REALTY" },
  },
  {
    slug: "Paranjape Schemes",
    name: "Paranjape Schemes",
    experience: "38 years",
    totalProjects: 200,
    happyFamilies: "55K+",
    locations: ["Pune", "Mumbai", "Bangalore"],
    about:
      "Paranjape Schemes is one of Pune's oldest and most respected developers, with a portfolio of over 200 completed projects since 1987. The hallmark: thoughtful planning, generous green spaces, and homes that age gracefully.",
    wordmark: { text: "PARANJAPE", tagline: "SCHEMES" },
  },
  {
    slug: "Kumar Properties",
    name: "Kumar Properties",
    experience: "55 years",
    totalProjects: 250,
    happyFamilies: "75K+",
    locations: ["Pune", "Mumbai", "Bangalore"],
    about:
      "Five decades of building homes for Indian families — Kumar Properties is among the most trusted real estate names in Pune, with a focus on value-driven housing in mature, well-connected neighbourhoods.",
    wordmark: { text: "KUMAR", tagline: "PROPERTIES" },
  },
  {
    slug: "Rohan Builders",
    name: "Rohan Builders",
    experience: "33 years",
    totalProjects: 60,
    happyFamilies: "15K+",
    locations: ["Pune", "Bangalore"],
    about:
      "Rohan Builders has earned a quiet reputation for engineering integrity and design clarity. Every project is built with a focus on liveability over flash — open layouts, abundant ventilation, and durable specifications.",
    wordmark: { text: "ROHAN", tagline: "BUILDERS" },
  },
  {
    slug: "Pride Purple",
    name: "Pride Purple",
    experience: "20 years",
    totalProjects: 30,
    happyFamilies: "10K+",
    locations: ["Pune"],
    about:
      "Pride Purple delivers vibrant, value-engineered homes for first-time buyers and young families across Pune's emerging neighbourhoods.",
    wordmark: { text: "PRIDE", tagline: "PURPLE" },
  },
  {
    slug: "Godrej Properties",
    name: "Godrej Properties",
    experience: "32 years",
    totalProjects: 90,
    happyFamilies: "40K+",
    locations: ["Mumbai", "Pune", "Bangalore", "Delhi NCR", "Chennai", "Kolkata", "Ahmedabad"],
    about:
      "Part of the 125-year-old Godrej Group, Godrej Properties brings the trust of a heritage industrial name to modern Indian real estate. Sustainability, innovation, and timely delivery are non-negotiable.",
    wordmark: { text: "GODREJ", tagline: "PROPERTIES" },
  },
];

export function builderBySlug(builderName: string) {
  return builders.find((b) => b.slug === builderName);
}

export function localityBySlug(slug: string) {
  return localities.find((l) => l.slug === slug);
}
export function propertiesByLocality(slug: string) {
  return properties.filter((p) => p.localitySlug === slug);
}
export function propertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug);
}
export function similarProperties(slug: string, limit = 4) {
  const me = propertyBySlug(slug);
  if (!me) return [];
  return properties
    .filter((p) => p.slug !== slug && p.localitySlug === me.localitySlug)
    .slice(0, limit);
}