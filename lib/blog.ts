// Blog data, types, and helpers for the AbhiGhar customer site.
//
// Kept in its own file (separate from lib/data.ts) so when a real backend
// lands, only this file becomes async — the existing data.ts stays
// synchronous and unchanged.
//
// v1 scope:
//   - Types + seed posts + read helpers
//   - Consumed by components/latest-blog.tsx on the homepage
//
// Not in v1 (deliberately):
//   - /blog index page
//   - /blog/[slug] detail page
//   - Tags, SEO meta, related posts
//
// The helpers below are already shaped so future blog pages can consume
// them without refactoring this file.

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  excerpt?: string;
  body: string; // Markdown
  publishedAt: string; // ISO date string
  status: BlogStatus;
  author?: string;
};

// Seed posts — three Pune real-estate buying-tip articles. Once a backend
// is wired up this array becomes a fetch; for now the homepage strip reads
// straight from here.
//
// Schema mirrors what the admin BlogEditor writes, so a future
// admin → DB → customer flow only needs to swap the source, not the shape.
export const blogPosts: readonly BlogPost[] = [
  {
    id: "BP001",
    slug: "rera-checklist-before-booking-pune",
    title: "Your RERA Checklist Before Booking Any Pune Project",
    category: "Buying Tips",
    heroImage:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Five non-negotiable RERA checks every Pune buyer should run before paying a booking amount.",
    body:
      "## Why RERA matters more than ever\n\n" +
      "Maharashtra's RERA portal has been live since 2017, but most Pune buyers still don't open it before paying a booking amount. That's a costly habit. Here's the five-minute checklist we run on every project before recommending it to clients.\n\n" +
      "### 1. Verify the registration number\n\n" +
      "Every published project should show its MAHARERA registration on hoardings, brochures, and the project's own site. Cross-check that number on **maharera.maharashtra.gov.in**. If the search returns nothing, walk away.\n\n" +
      "### 2. Read the declared possession date\n\n" +
      "Builders often quote optimistic dates in sales meetings. The RERA portal carries the *declared* possession date — the one the builder is legally on the hook for. A two-year gap between sales-pitch date and RERA date is a yellow flag.\n\n" +
      "### 3. Open the litigation section\n\n" +
      "The portal lists complaints filed against each project. One or two consumer complaints over many years isn't unusual. A pattern of delay-related complaints in the last 12 months is.\n\n" +
      "### 4. Check the bank approval list\n\n" +
      "Approved banks are listed for each project. If only one bank shows up, your home loan options will be restricted. Three or more is healthier.\n\n" +
      "### 5. Cross-check the Form 3 (CA certificate)\n\n" +
      "The Form 3 lists how much of the buyer money has actually been spent on construction. If 60% of the project amount has been collected but only 20% of construction is complete, you've spotted a red flag before signing anything.\n\n" +
      "A clean RERA profile isn't a guarantee. But projects with shaky RERA filings are almost always trouble — and the check costs nothing.",
    // Hand-picked ISO dates rather than `Date.now() - X days`. Using a
    // dynamic Date.now would cause hydration mismatches (server renders
    // one date, client renders another). Fixed dates keep server and
    // client output identical.
    publishedAt: "2026-06-11T09:00:00.000Z",
    status: "published",
    author: "Sarika ",
  },
  {
    id: "BP002",
    slug: "carpet-vs-built-up-vs-super-built-up",
    title: "Carpet vs Built-Up vs Super Built-Up: What You Actually Pay For",
    category: "Buying Tips",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "The same 1,200 sqft can mean three different things. Here's what each measurement covers — and how it affects your final price.",
    body:
      "## Three numbers, three meanings\n\n" +
      "Walk into any Pune project and you'll hear three different area figures for the same flat. Understanding which one you're being quoted on is the difference between a fair deal and a 20% overpay.\n\n" +
      "### Carpet area\n\n" +
      "The space you can actually walk on inside the flat — wall-to-wall floor area, excluding the thickness of internal walls. This is what RERA mandates be disclosed since 2017.\n\n" +
      "For a 2 BHK in Hinjewadi the carpet area typically runs **640–780 sqft**.\n\n" +
      "### Built-up area\n\n" +
      "Carpet area **plus** the thickness of the flat's walls and the area of balconies. Roughly 10–15% larger than the carpet number.\n\n" +
      "### Super built-up area (saleable area)\n\n" +
      "Built-up area **plus** the flat's share of common areas — lobbies, lifts, staircases, gym, clubhouse, security room, even the swimming pool deck. Usually 25–40% larger than the carpet number.\n\n" +
      "### What it means for your rate per sqft\n\n" +
      "A builder advertising ₹8,500/sqft on super built-up is effectively charging ₹12,000+/sqft on carpet. The total cost of the flat doesn't change — but understanding the conversion helps you compare projects honestly.\n\n" +
      "Ask for the carpet area in writing. The agreement will list it anyway. Use it as your basis for comparison, not the marketing number.",
    publishedAt: "2026-06-03T09:00:00.000Z",
    status: "published",
    author: "Kedar Naik",
  },
  {
    id: "BP003",
    slug: "stamp-duty-registration-pune-2026",
    title: "Stamp Duty and Registration in Pune: What's Changed in 2026",
    category: "Legal & RERA",
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Maharashtra revised its stamp duty schedule earlier this year. Here's what Pune buyers need to budget for.",
    body:
      "## The current rates\n\n" +
      "For residential properties in Pune Municipal Corporation limits:\n\n" +
      "- **Stamp duty:** 6% of the higher of agreement value or ready-reckoner value\n" +
      "- **Registration fee:** 1% of the same, capped at ₹30,000\n" +
      "- **Metro cess:** 1% (this is the one that changed in 2025)\n\n" +
      "For a ₹1 crore flat, expect to set aside roughly **₹8 lakh** for these charges combined.\n\n" +
      "### The 1% concession for women buyers\n\n" +
      "If the flat is registered in a woman's name (sole or first-named joint owner), stamp duty drops to 5%. That's a ₹1 lakh saving on a ₹1 crore purchase. Worth structuring the registration around.\n\n" +
      "### What's *not* changed\n\n" +
      "Despite headlines suggesting otherwise, there's been no actual reduction in stamp duty for first-time buyers in 2026. Any sales pitch claiming \"first-time buyer benefit\" should be backed by a specific government notification — ask to see it.\n\n" +
      "### Timing your registration\n\n" +
      "Stamp duty rates have historically reduced during the COVID period (briefly down to 2% in 2020-21). The current 6% has been stable since April 2022. Don't wait for a rate cut that may not come — but if you're buying in March, registering before April 1st sidesteps any new financial-year revisions.",
    publishedAt: "2026-05-20T09:00:00.000Z",
    status: "published",
    author: "Sarika ",
  },
] as const;

// Returns all published posts, newest first. Drafts are filtered out so
// they don't leak onto the customer site.
export function getAllPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => p.status === "published")
    .slice()
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

// Convenience for the homepage strip — the 3 (or N) latest published posts.
export function getLatestPosts(limit = 3): BlogPost[] {
  return getAllPublishedPosts().slice(0, limit);
}

// Used by future /blog/[slug] detail page. Returns undefined for missing
// or draft slugs so the caller can render a 404.
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug && p.status === "published");
}