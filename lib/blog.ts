// lib/blog.ts
// Server-side blog fetchers — used by app/blog/* pages.
//
// Same cached-fallback pattern as lib/properties.ts: if the API is
// unreachable the build still succeeds with previously-fetched data.

import { publicGet } from "./api-client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  heroImageUrl: string;
  author: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  viewCount: number;
  publishedAt: string | null;
  status?: string;
}

interface ApiBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  heroImageUrl: string | null;
  author: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  viewCount: number;
  publishedAt: string | null;
  status?: string;
}

function adapt(p: ApiBlogPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    body: p.body || "",
    heroImageUrl: p.heroImageUrl || "",
    author: p.author || "Abhi Ghar Team",
    tags: p.tags || [],
    featured: !!p.featured,
    readingTime: p.readingTime || 3,
    viewCount: p.viewCount || 0,
    publishedAt: p.publishedAt,
    status: p.status,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await publicGet<ApiBlogPost[]>("/blog");
  if (!Array.isArray(res)) return [];
  return res.map(adapt);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await publicGet<ApiBlogPost>(`/blog/${encodeURIComponent(slug)}`);
    return res ? adapt(res) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  const res = await publicGet<ApiBlogPost[]>(`/blog?featuredOnly=true&limit=${limit}`);
  if (!Array.isArray(res)) return [];
  return res.map(adapt);
}

// ─── Backwards-compatible aliases ──────────────────────────────────
// The existing customer site code (components/latest-blog.tsx, 
// app/blog/page.tsx) was written when blog data was hardcoded in
// lib/data.ts with these function names. Aliasing here so those
// existing components keep working without code changes.
//
// getLatestPosts(n) — returns N most recent published posts
// getAllPublishedPosts() — returns all published posts (sorted newest first)

export async function getLatestPosts(limit: number = 3): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  return all.slice(0, limit);
}

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  return getAllBlogPosts();
}
