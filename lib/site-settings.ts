// lib/site-settings.ts
// Server-side site settings fetcher. Cached for 1 hour by Next.js
// fetch cache to avoid hammering the API on every page render.
//
// Used by Footer, WhatsAppFloat, and AdvisorCard (for default advisor
// fallback when a property has no advisor of its own configured).

import { publicGet } from "./api-client";

export interface SiteSettings {
  primaryPhone: string;
  secondaryPhone: string;
  whatsappFooter: string;
  whatsappFloating: string;
  email: string;
  hours: string;
  address: string;
  mapEmbedUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  defaultAdvisorName: string;
  defaultAdvisorInitials: string;
  defaultAdvisorRole: string;
  defaultAdvisorRating: number;
  siteName: string;
  tagline: string;
  reraId: string;
}

const FALLBACK: SiteSettings = {
  primaryPhone: "9730302843",
  secondaryPhone: "9890122755",
  whatsappFooter: "9730302843",
  whatsappFloating: "9890122755",
  email: "contact@abhighar.com",
  hours: "Mon – Sun · 10 AM – 8 PM",
  address: "Pune, Maharashtra, India",
  mapEmbedUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  defaultAdvisorName: "Sarika Karkhanis",
  defaultAdvisorInitials: "SK",
  defaultAdvisorRole: "Senior Advisor",
  defaultAdvisorRating: 4.8,
  siteName: "Abhi Ghar",
  tagline: "Curated residential real estate across Pune's most considered localities.",
  reraId: "A031262401068",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await publicGet<Partial<SiteSettings>>("/site-settings");
    if (!res) return FALLBACK;
    // Merge response over fallback so any unfilled field stays sane
    return {
      ...FALLBACK,
      ...Object.fromEntries(
        Object.entries(res).filter(([_, v]) => v !== null && v !== undefined && v !== "")
      ),
    } as SiteSettings;
  } catch {
    return FALLBACK;
  }
}
