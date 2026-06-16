// Homepage "Latest Blog" section. Renders the 3 most recent published posts
// in a card grid.
//
// Mount this in app/page.tsx between <FeedbackForm /> and <Footer /> —
// that matches admin's HOMEPAGE_SECTIONS config, which slots "Latest Blog"
// as hs8 (after Testimonials hs7, before Final CTA hs9).
//
// ACTIVATED in this version: previously all three "All articles" affordances
// were disabled-style placeholders (pointer-events-none, opacity-60) with
// `// v2:` markers explaining the fallback. Now that /blog and /blog/[slug]
// exist as real pages, the three links — desktop top-right, mobile bottom,
// and per-card — point at them directly via next/Link.

import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";

export default function LatestBlog() {
  const posts = getLatestPosts(3);

  // Hide the section entirely if no published posts exist yet. Keeps the
  // homepage from showing an empty shell before content lands.
  if (posts.length === 0) return null;

  return (
    <section className="bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="container-x">

        {/* Section header — matches the visual pattern of Localities,
            FeaturedProjects, Testimonials etc: eyebrow, h2 with italic
            accent word, body subtitle, optional "see all" link on the right. */}
        <div className="flex items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="eyebrow text-[#6B4F23] mb-3">Insights</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy leading-[1.1] tracking-tight">
              From our <em className="font-display not-italic text-gold">desk</em>.
            </h2>
            <p className="body-base text-slate mt-3 max-w-lg">
              Buying tips, market notes, and locality observations — written by the senior advisors who actually walk these neighbourhoods.
            </p>
          </div>
          {/* ACTIVATED: was the disabled-style placeholder for the previous
              v2 marker. Now points at the real /blog index. Using next/Link
              for client-side navigation. */}
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#6B4F23] font-bold text-sm whitespace-nowrap hover:text-navy transition-colors"
          >
            All articles <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        {/* Card grid — 1 col mobile → 2 col sm → 3 col lg, same breakpoint
            pattern as Localities and FeaturedProjects on the homepage. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            // ACTIVATED: each card is now a Link to /blog/[slug]. The
            // previous <article cursor-default> became a Link wrapper —
            // same visual, now actually navigates on click.
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group bg-white rounded-card overflow-hidden border border-navy/8 shadow-[0_2px_12px_hsl(var(--navy)/0.05)] hover:shadow-[0_8px_28px_hsl(var(--navy)/0.10)] transition-shadow block"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                {/* Plain <img> rather than next/image so the component is
                    drop-in regardless of whether the page using it is a
                    Server Component. Swap for next/image if you want
                    Next's automatic optimization later. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.heroImage}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-1 rounded-pill bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-navy">
                    {p.category}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="font-sans font-bold text-navy text-[17px] sm:text-[18px] leading-snug tracking-tight line-clamp-2 group-hover:text-gold-hover transition-colors">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="text-[13px] sm:text-[13.5px] text-slate leading-relaxed mt-2.5 line-clamp-3">
                    {p.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-navy/8">
                  <div className="text-[11.5px] text-slate/70 tabular-nums">
                    {formatDate(p.publishedAt)}
                  </div>
                  {p.author && (
                    <div className="text-[11.5px] font-semibold text-navy/70">
                      {p.author}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "All articles" — desktop variant lives in the header
            above; below sm: that's hidden, so this gives the same
            affordance under the cards. */}
        {/* ACTIVATED: same flip from disabled-style → real Link as above */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[#6B4F23] font-bold text-sm hover:text-navy transition-colors"
          >
            See all articles <span aria-hidden>&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

// Local date formatter — en-IN style ("12 Jun 2026"). Done manually rather
// than via Intl.DateTimeFormat so server and client renders agree exactly
// (Intl can format differently across Node versions / browsers).
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}