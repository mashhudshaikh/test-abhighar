// app/blog/page.tsx
// ─────────────────────────────────────────────────────────────────────
// "All articles" link from latest-blog.tsx and footer (when added) now
// points here. Replaces the previously-disabled v1 fallback.
//
// Data: uses getAllPublishedPosts() from @/lib/blog. Same shape per post
// as latest-blog.tsx uses: id, slug, title, excerpt, category, heroImage,
// publishedAt, author.
//
// Server Component (no "use client"). Posts are read at request time
// from blog.ts. If your admin/CMS is async, change this to async +
// await getAllPublishedPosts().
// ─────────────────────────────────────────────────────────────────────
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { getAllPublishedPosts } from "@/lib/blog";

export const metadata = {
  title: "Insights — Abhi Ghar",
  description: "Buying tips, market notes, and locality observations from Pune's senior real-estate advisors.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPublishedPosts();

  // Group by category for the chip filter row at the top. We render a
  // simple unique-category list — interactive filtering can be added
  // later as a client component if needed.
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">

          {/* Header block */}
          <div className="mb-10 lg:mb-14 max-w-[820px]">
            <nav className="meta text-slate mb-4">
              <Link href="/" className="hover:text-gold-hover">Home</Link>
              <span className="mx-2 text-steel">/</span>
              <span className="text-navy font-semibold">Insights</span>
            </nav>
            <div className="sec-eyebrow mb-3">Insights</div>
            <h1
              className="font-display font-semibold text-navy leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
            >
              From our <em className="text-gold italic">desk.</em>
            </h1>
            <p className="body-base text-slate mt-4 max-w-[680px]">
              Buying tips, market notes, and locality observations &mdash; written by the senior advisors who actually walk these neighbourhoods. No SEO filler, no recycled industry takes.
            </p>
          </div>

          {/* Category chips — visual affordance for now; non-interactive.
              When filtering is desired, hoist this into a client component
              and pipe selection into a useMemo over `posts`. */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 lg:mb-10 pb-6 border-b border-navy/10">
              <span className="px-4 py-2 rounded-pill bg-navy text-white text-[13px] font-sans font-semibold">
                All ({posts.length})
              </span>
              {categories.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                return (
                  <span
                    key={cat}
                    className="px-4 py-2 rounded-pill bg-white border border-navy/15 text-navy text-[13px] font-sans font-semibold"
                  >
                    {cat} ({count})
                  </span>
                );
              })}
            </div>
          )}

          {/* Posts grid or empty state */}
          {posts.length === 0 ? (
            <div className="card-base p-10 lg:p-14 text-center max-w-[520px] mx-auto">
              <div className="font-sans font-bold text-[18px] text-navy mb-2 tracking-tight">No articles published yet</div>
              <p className="body-base text-slate mb-5">
                We&apos;re writing. Check back soon, or get in touch in the meantime &mdash; we love a good real-estate conversation.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] shadow-cta hover:bg-gold-hover transition-colors"
              >
                Talk to an advisor <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-white rounded-card overflow-hidden border border-navy/8 shadow-[0_2px_12px_hsl(var(--navy)/0.05)] hover:shadow-[0_8px_28px_hsl(var(--navy)/0.10)] transition-shadow block"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                    {/* Plain <img> for the same reason latest-blog uses it —
                        works in either server or client component and saves
                        Next from optimizing every post hero. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.heroImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    {p.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2.5 py-1 rounded-pill bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-navy">
                          {p.category}
                        </span>
                      </div>
                    )}
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
                      <div className="text-[11.5px] text-slate/70 tnum">
                        {formatDate(p.publishedAt)}
                      </div>
                      {p.author && (
                        <div className="text-[11.5px] font-semibold text-navy/70 truncate ml-3">
                          {p.author}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

// Local date formatter — same as latest-blog.tsx, intentionally manual so
// server and client renders agree byte-for-byte (Intl.DateTimeFormat can
// differ across Node versions / browsers).
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}