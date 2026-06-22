/* Properties data layer for the customer site.

   Pattern (decision-b: cached fallback):
   1. Fetch from API (server component, Next.js fetch cache)
   2. If API fails, return empty array (build never breaks)
   3. Pages handle empty state gracefully

   Field names match the existing customer-site `Property` type from
   `lib/data.ts` so consumers don't need refactoring.
*/

import { publicGet } from "./api-client";
import type { Property } from "./data";

/* Raw API shape (what the public/properties endpoint returns). */
interface ApiPropertyImage {
  id: string; url: string; altText: string | null; category: string | null; sortOrder: number;
}
interface ApiProperty {
  id: string;
  slug: string;
  name: string;
  locality?: { name: string; slug: string; area: string | null };
  builder?: { name: string; slug: string; logoUrl: string | null };
  type: string;
  status: string;
  possessionStatus: string;
  possessionYear: number | null;
  possessionLabel: string | null;
  bhkRange: string | null;
  bhkOptions: number[];
  areaMin: string | null;
  areaRange: string | null;
  priceDisplay: string | null;
  priceMin: number | null;
  priceMax: number | null;
  totalUnits: number | null;
  landParcel: string | null;
  towers: string | null;
  floors: string | null;
  rera: string | null;
  litigation: string | null;
  reraPossession: string | null;
  about: string | null;
  thumbnail: string | null;
  bhkConfigs: Array<{ config: string; area?: string; from?: string; floorPlan?: string }>;
  amenities: Array<{ title: string; desc?: string; icon?: string }>;
  nearby: Array<{ place: string; distance?: string }>;
  advisor: { initials?: string; name?: string; role?: string; rating?: number };
  featured: boolean;
  images: ApiPropertyImage[];
}

interface ApiListResponse { items: ApiProperty[]; total: number; page: number; pageSize: number; }

function adaptToCustomer(p: ApiProperty): Property {
  // Defensive image handling to keep the customer site rendering even when
  // a property has no gallery yet:
  // 1. Pull URL list from gallery
  // 2. If empty, fall back to [thumbnail]
  // 3. If still empty (no thumbnail), fall back to [default image]
  // This guarantees images[0] is always a valid string so any hero/carousel
  // component on the existing site won't crash on undefined.
  const galleryUrls = (p.images || []).map((i) => i.url).filter(Boolean);
  const DEFAULT_IMG = "/floor-plans/default.jpg";
  const finalThumbnail = p.thumbnail || DEFAULT_IMG;
  const finalImages = galleryUrls.length > 0 ? galleryUrls : [finalThumbnail];

  return {
    slug: p.slug,
    name: p.name,
    builder: p.builder?.name || "",
    localitySlug: p.locality?.slug || "",
    localityArea: p.locality?.area || "",
    status: (p.possessionStatus === "ready_to_move" ? "Ready" :
             p.possessionStatus === "nearing_possession" ? "Nearing Possession" :
             p.possessionStatus === "new_launch" ? "New Launching" :
             "Under Construction") as Property["status"],
    bhkRange: p.bhkRange || "",
    bhkOptions: p.bhkOptions || [],
    areaMin: p.areaMin || "",
    areaRange: p.areaRange || "",
    possessionLabel: p.possessionLabel || "",
    possessionYear: p.possessionYear || new Date().getFullYear() + 2,
    priceDisplay: p.priceDisplay || "",
    priceMin: p.priceMin ?? 0,
    priceMax: p.priceMax ?? 0,
    thumbnail: finalThumbnail,
    images: finalImages,
    rera: p.rera || "",
    totalUnits: p.totalUnits ?? 0,
    about: p.about || "",
    bhkConfigs: (p.bhkConfigs || []).map((c) => ({
      config: c.config,
      area: c.area || "",
      from: c.from || "",
      // floorPlan can legitimately be undefined — existing site handles that
      floorPlan: c.floorPlan,
    })),
    amenities: (p.amenities || []).map((a) => ({
      title: a.title, desc: a.desc || "", icon: a.icon || "amenity",
    })),
    nearby: (p.nearby || []).map((n) => ({
      place: n.place, distance: n.distance || "",
    })),
    advisor: {
      initials: p.advisor?.initials || "AB",
      name: p.advisor?.name || "Advisor",
      role: p.advisor?.role || "Advisor",
      rating: p.advisor?.rating || 4.5,
    },
    landParcel: p.landParcel || "",
    towers: p.towers || "",
    floors: p.floors || "",
    litigation: p.litigation || "",
    reraPossession: p.reraPossession || "",
  };
}

/* List all published properties. Cached for 60s by default.
   Returns empty array if API unreachable. */
export async function getAllProperties(): Promise<Property[]> {
  try {
    const res = await publicGet<ApiListResponse>("/properties?pageSize=200", {
      revalidate: 60,
      tag: "properties",
    });
    return (res.items || []).map(adaptToCustomer);
  } catch (err) {
    console.error("[properties] Failed to fetch list:", err);
    return [];
  }
}

/* Single property by slug. Cached for 60s. Throws notFound() handling
   to the caller (return null and let the page render a 404). */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const p = await publicGet<ApiProperty>(`/properties/${slug}`, {
      revalidate: 60,
      tag: `property-${slug}`,
    });
    return adaptToCustomer(p);
  } catch (err) {
    console.error(`[properties] Failed to fetch slug "${slug}":`, err);
    return null;
  }
}

/* Featured properties — for homepage strip. */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await publicGet<ApiListResponse>("/properties?featured=true&pageSize=12", {
      revalidate: 60,
      tag: "featured-properties",
    });
    return (res.items || []).map(adaptToCustomer);
  } catch (err) {
    console.error("[properties] Failed to fetch featured:", err);
    return [];
  }
}

/* Properties in a given locality slug. */
export async function getPropertiesByLocality(localitySlug: string): Promise<Property[]> {
  try {
    const res = await publicGet<ApiListResponse>(`/properties?localitySlug=${encodeURIComponent(localitySlug)}&pageSize=100`, {
      revalidate: 60,
      tag: `properties-locality-${localitySlug}`,
    });
    return (res.items || []).map(adaptToCustomer);
  } catch (err) {
    console.error(`[properties] Failed to fetch locality "${localitySlug}":`, err);
    return [];
  }
}
