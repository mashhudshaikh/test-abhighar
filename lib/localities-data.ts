/* Localities + Builders data layer for the customer site.
   Same cached-fallback pattern as properties.ts. */

import { publicGet } from "./api-client";

export interface CustomerLocality {
  id: string;
  name: string;
  slug: string;
  area: string;
  description: string;
  heroImageUrl: string;
  city: { name: string; slug: string };
}

export interface CustomerBuilder {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
}

interface ApiLocality {
  id: string;
  name: string;
  slug: string;
  area: string | null;
  description: string | null;
  heroImageUrl: string | null;
  city?: { name: string; slug: string };
}

interface ApiBuilder {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
}

function adaptLocality(l: ApiLocality): CustomerLocality {
  return {
    id: l.id, name: l.name, slug: l.slug,
    area: l.area || "", description: l.description || "",
    heroImageUrl: l.heroImageUrl || "",
    city: l.city ? { name: l.city.name, slug: l.city.slug } : { name: "Pune", slug: "pune" },
  };
}

function adaptBuilder(b: ApiBuilder): CustomerBuilder {
  return {
    id: b.id, name: b.name, slug: b.slug,
    logoUrl: b.logoUrl || "", description: b.description || "",
  };
}

export async function getAllLocalities(): Promise<CustomerLocality[]> {
  try {
    const res = await publicGet<ApiLocality[]>("/localities", { revalidate: 300, tag: "localities" });
    return (res || []).map(adaptLocality);
  } catch (err) {
    console.error("[localities] Failed to fetch:", err);
    return [];
  }
}

export async function getLocalityBySlug(slug: string): Promise<CustomerLocality | null> {
  try {
    const l = await publicGet<ApiLocality>(`/localities/${slug}`, { revalidate: 300, tag: `locality-${slug}` });
    return adaptLocality(l);
  } catch (err) {
    console.error(`[localities] Failed to fetch slug "${slug}":`, err);
    return null;
  }
}

export async function getAllBuilders(): Promise<CustomerBuilder[]> {
  try {
    const res = await publicGet<ApiBuilder[]>("/builders", { revalidate: 300, tag: "builders" });
    return (res || []).map(adaptBuilder);
  } catch (err) {
    console.error("[builders] Failed to fetch:", err);
    return [];
  }
}
