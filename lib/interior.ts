/**
 * Phase 4.5 — Interior CMS data fetchers (server-side).
 *
 * All exported functions are async and call publicGet (server-safe).
 * Falls back gracefully to empty/defaults if API unreachable so the
 * customer site keeps rendering even if the backend is down.
 *
 * Used by server components in app/interiors/page.tsx.
 *
 * IMPORTANT: paths passed to publicGet must NOT start with /v1/public
 * because api-client.ts auto-prepends that prefix.
 */
import { publicGet } from "./api-client";

// ─── Types ────────────────────────────────────────────────────────────

export interface InteriorDesigner {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
  yearsExperience: number | null;
  specialties: string[];
  instagramUrl: string;
  featured: boolean;
  sortOrder: number;
}

export interface InteriorPackage {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  basePriceDisplay: string;
  basePrice: number | null;
  features: string[];
  targetMarket: string;
  includedServices: string[];
  heroImageUrl: string;
  gallery: { url: string; alt?: string }[];
  popular: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface InteriorPortfolioImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface InteriorPortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  propertyType: string;
  description: string;
  heroImageUrl: string;
  beforeImages: InteriorPortfolioImage[];
  afterImages: InteriorPortfolioImage[];
  galleryImages: InteriorPortfolioImage[];
  tags: string[];
  packageId: string | null;
  package: { id: string; name: string; slug: string } | null;
  designerId: string | null;
  designer: { id: string; name: string; slug: string } | null;
  completedAt: string | null;
  featured: boolean;
  sortOrder: number;
}

export interface InteriorService {
  slug: string;
  title: string;
  description: string;
  duration: string;
  from: string;
  image: string;
}

export interface InteriorCategory {
  slug: string;
  name: string;
  icon: string;
}

export interface InteriorTrustItem {
  label: string;
  value: string;
  sublabel?: string;
}

export interface InteriorUSP {
  icon: string;
  title: string;
  description: string;
}

export interface InteriorProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface InteriorFAQ {
  question: string;
  answer: string;
}

export interface InteriorPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  services: InteriorService[];
  categories: InteriorCategory[];
  trust: InteriorTrustItem[];
  aboutTitle: string;
  aboutBody: string;
  usps: InteriorUSP[];
  processSteps: InteriorProcessStep[];
  faqs: InteriorFAQ[];
  ctaTitle: string;
  ctaSubtitle: string;
  advisor: {
    name: string;
    initials: string;
    role: string;
    rating: number | null;
  };
}

// ─── Defensive fallbacks ──────────────────────────────────────────────
// Used when API is unreachable so the page still renders.

const FALLBACK_PAGE_CONTENT: InteriorPageContent = {
  heroTitle: "Beautiful interiors, thoughtfully done.",
  heroSubtitle:
    "In-house designers shaping your home around your family's daily life — not the other way around.",
  heroImageUrl: "",
  services: [],
  categories: [],
  trust: [],
  aboutTitle: "",
  aboutBody: "",
  usps: [],
  processSteps: [],
  faqs: [],
  ctaTitle: "Ready to start your home?",
  ctaSubtitle: "Free consultation. No commitment.",
  advisor: {
    name: "Sarika",
    initials: "SK",
    role: "Senior Interior Designer",
    rating: 4.9,
  },
};

// ─── Adapter helpers ──────────────────────────────────────────────────

function adaptDesigner(r: any): InteriorDesigner {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    role: r.role || "",
    bio: r.bio || "",
    photoUrl: r.photoUrl || null,
    yearsExperience: r.yearsExperience ?? null,
    specialties: Array.isArray(r.specialties) ? r.specialties : [],
    instagramUrl: r.instagramUrl || "",
    featured: !!r.featured,
    sortOrder: r.sortOrder ?? 0,
  };
}

function adaptPackage(r: any): InteriorPackage {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline || "",
    description: r.description || "",
    basePriceDisplay: r.basePriceDisplay || "",
    basePrice: r.basePrice ?? null,
    features: Array.isArray(r.features) ? r.features : [],
    targetMarket: r.targetMarket || "",
    includedServices: Array.isArray(r.includedServices) ? r.includedServices : [],
    heroImageUrl: r.heroImageUrl || "",
    gallery: Array.isArray(r.gallery) ? r.gallery : [],
    popular: !!r.popular,
    featured: !!r.featured,
    sortOrder: r.sortOrder ?? 0,
  };
}

function adaptPortfolio(r: any): InteriorPortfolioItem {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category || "",
    location: r.location || "",
    propertyType: r.propertyType || "",
    description: r.description || "",
    heroImageUrl: r.heroImageUrl || "",
    beforeImages: Array.isArray(r.beforeImages) ? r.beforeImages : [],
    afterImages: Array.isArray(r.afterImages) ? r.afterImages : [],
    galleryImages: Array.isArray(r.galleryImages) ? r.galleryImages : [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    packageId: r.packageId || null,
    package: r.package || null,
    designerId: r.designerId || null,
    designer: r.designer || null,
    completedAt: r.completedAt || null,
    featured: !!r.featured,
    sortOrder: r.sortOrder ?? 0,
  };
}

function adaptPageContent(r: any): InteriorPageContent {
  return {
    heroTitle: r.heroTitle || FALLBACK_PAGE_CONTENT.heroTitle,
    heroSubtitle: r.heroSubtitle || FALLBACK_PAGE_CONTENT.heroSubtitle,
    heroImageUrl: r.heroImageUrl || "",
    services: Array.isArray(r.services) ? r.services : [],
    categories: Array.isArray(r.categories) ? r.categories : [],
    trust: Array.isArray(r.trust) ? r.trust : [],
    aboutTitle: r.aboutTitle || "",
    aboutBody: r.aboutBody || "",
    usps: Array.isArray(r.usps) ? r.usps : [],
    processSteps: Array.isArray(r.processSteps) ? r.processSteps : [],
    faqs: Array.isArray(r.faqs) ? r.faqs : [],
    ctaTitle: r.ctaTitle || FALLBACK_PAGE_CONTENT.ctaTitle,
    ctaSubtitle: r.ctaSubtitle || FALLBACK_PAGE_CONTENT.ctaSubtitle,
    advisor: {
      name: r.advisorName || FALLBACK_PAGE_CONTENT.advisor.name,
      initials: r.advisorInitials || FALLBACK_PAGE_CONTENT.advisor.initials,
      role: r.advisorRole || FALLBACK_PAGE_CONTENT.advisor.role,
      rating: r.advisorRating ?? FALLBACK_PAGE_CONTENT.advisor.rating,
    },
  };
}

// ─── Public API ───────────────────────────────────────────────────────

export async function getInteriorDesigners(): Promise<InteriorDesigner[]> {
  try {
    const res = await publicGet<any[]>("/interior-designers");
    if (!Array.isArray(res)) return [];
    return res.map(adaptDesigner);
  } catch (err) {
    console.warn("[interior] getInteriorDesigners failed:", err);
    return [];
  }
}

export async function getInteriorPackages(): Promise<InteriorPackage[]> {
  try {
    const res = await publicGet<any[]>("/interior-packages");
    if (!Array.isArray(res)) return [];
    return res.map(adaptPackage);
  } catch (err) {
    console.warn("[interior] getInteriorPackages failed:", err);
    return [];
  }
}

export async function getInteriorPortfolio(opts: {
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
} = {}): Promise<InteriorPortfolioItem[]> {
  try {
    const qs = new URLSearchParams();
    if (opts.category) qs.append("category", opts.category);
    if (opts.featuredOnly) qs.append("featuredOnly", "true");
    if (opts.limit) qs.append("pageSize", String(opts.limit));
    const query = qs.toString() ? "?" + qs.toString() : "";
    const res = await publicGet<{ items?: any[] }>(`/interior-portfolio${query}`);
    const items = Array.isArray(res?.items) ? res.items : [];
    return items.map(adaptPortfolio);
  } catch (err) {
    console.warn("[interior] getInteriorPortfolio failed:", err);
    return [];
  }
}

export async function getInteriorPageContent(): Promise<InteriorPageContent> {
  try {
    const res = await publicGet<any>("/interior-page-content");
    if (!res) return FALLBACK_PAGE_CONTENT;
    return adaptPageContent(res);
  } catch (err) {
    console.warn("[interior] getInteriorPageContent failed:", err);
    return FALLBACK_PAGE_CONTENT;
  }
}

/**
 * Convenience: fetch all 4 resources in parallel.
 * Use in a server component to hydrate the whole /interiors page in one call.
 */
export async function getAllInteriorData() {
  const [designers, packages, portfolio, pageContent] = await Promise.all([
    getInteriorDesigners(),
    getInteriorPackages(),
    getInteriorPortfolio({ limit: 50 }),
    getInteriorPageContent(),
  ]);
  return { designers, packages, portfolio, pageContent };
}
