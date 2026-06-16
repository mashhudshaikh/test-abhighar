// Homepage "Latest Blog" section. Renders the 3 most recent published posts
// in a card grid.
//
// Mount this in app/page.tsx between <FeedbackForm /> and <Footer /> —
// that matches admin's HOMEPAGE_SECTIONS config, which slots "Latest Blog"
// as hs8 (after Testimonials hs7, before Final CTA hs9).
//
// IMPORTANT: this file stays a Server Component (no "use client" directive).
// Earlier version used onClick to disable the "All articles" links, which
// trips Next 14's server-component rule against passing event handlers.
// Instead, the disabled affordances are CSS-only: pointer-events-none +
// cursor-not-allowed + visual dimming. When you wire up /blog and /blog/[slug]
// in v2, search this file for "v2:" — each marked spot needs an href change
// and the `pointer-events-none opacity-60 cursor-not-allowed` classes removed.

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
          {/* v2: change href to "/blog" and drop the pointer-events / opacity
              / cursor utilities once the index page is built. */}
          <a
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            className="hidden sm:inline-flex items-center gap-1.5 text-[#6B4F23] font-bold text-sm whitespace-nowrap pointer-events-none opacity-60 cursor-not-allowed"
          >
            All articles <span aria-hidden>&rarr;</span>
          </a>
        </div>

        {/* Card grid — 1 col mobile → 2 col sm → 3 col lg, same breakpoint
            pattern as Localities and FeaturedProjects on the homepage. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            // v2: wrap each <article> in <Link href={`/blog/${p.slug}`}> and
            // remove `cursor-default`. The card visual already matches what
            // a clickable link card should look like.
            <article
              key={p.id}
              className="group bg-white rounded-card overflow-hidden border border-navy/8 shadow-[0_2px_12px_hsl(var(--navy)/0.05)] hover:shadow-[0_8px_28px_hsl(var(--navy)/0.10)] transition-shadow cursor-default"
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
            </article>
          ))}
        </div>

        {/* Mobile "All articles" — desktop variant lives in the header
            above; below sm: that's hidden, so this gives the same
            affordance under the cards. */}
        {/* v2: change href to "/blog" and drop the disabled utilities */}
        <div className="sm:hidden mt-8 text-center">
          <a
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex items-center gap-1.5 text-[#6B4F23] font-bold text-sm pointer-events-none opacity-60 cursor-not-allowed"
          >
            See all articles <span aria-hidden>&rarr;</span>
          </a>
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