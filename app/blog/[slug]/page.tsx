// app/blog/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────
// Individual blog-post page. Linked from /blog index and from
// latest-blog.tsx on the homepage.
//
// REVISED — the previous version used `post.content` + dangerouslySetInnerHTML,
// which assumed HTML. The actual BlogPost type has a `body` field
// containing **markdown** (per lib/blog.ts seed posts). Rendering markdown
// as raw HTML would print "## Heading" as literal text on the page.
//
// Rather than pull in react-markdown (extra dependency, extra bundle),
// this page ships a small inline parser that handles exactly the
// markdown features the seed content uses:
//   - ## Heading       → <h2>
//   - ### Subheading   → <h3>
//   - **bold**         → <strong>
//   - Lines starting with "- "  → <ul><li>
//   - Blank-line-separated paragraphs → <p>
//
// If/when the content authoring expands to use richer markdown (links,
// images, code blocks, blockquotes, tables), swap to react-markdown:
//   npm i react-markdown
// then replace <MarkdownBody body={post.body} /> with
//   <ReactMarkdown className="prose ...">{post.body}</ReactMarkdown>
// ─────────────────────────────────────────────────────────────────────
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPublishedPosts, type BlogPost } from "@/lib/blog";

// Generates static pages at build time for every published post — Next
// will pre-render them so they're fast. Remove if you'd rather render
// on-demand.
export function generateStaticParams() {
  return getAllPublishedPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Article — Abhi Ghar" };
  return {
    title: `${post.title} — Abhi Ghar`,
    description: post.excerpt ?? "An insight from Abhi Ghar's senior advisors.",
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "",
      images: post.heroImage ? [post.heroImage] : [],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Author initials — trim handles the seed data quirk where "Sarika "
  // has a trailing space; the split-on-whitespace + filter ensures we
  // don't emit "undefined" as part of the initials.
  const authorInitials = post.author
    ? post.author
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  // Related posts: same category, excluding self, capped at 3.
  const related = getAllPublishedPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">
          <div className="max-w-[760px] mx-auto">

            <nav className="meta text-slate mb-6">
              <Link href="/" className="hover:text-gold-hover">Home</Link>
              <span className="mx-2 text-steel">/</span>
              <Link href="/blog" className="hover:text-gold-hover">Insights</Link>
              <span className="mx-2 text-steel">/</span>
              <span className="text-navy font-semibold line-clamp-1">{post.title}</span>
            </nav>

            <article>
              {/* Article header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {post.category && (
                    <span className="inline-block px-2.5 py-1 rounded-pill bg-gold/10 text-gold-hover text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                  <span className="text-[12px] text-slate tnum">{formatDate(post.publishedAt)}</span>
                </div>
                <h1
                  className="font-display font-semibold text-navy leading-[1.1] tracking-tight"
                  style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
                >
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="body-base text-slate mt-4 text-[17px] leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                {post.author && (
                  <div className="flex items-center gap-3 mt-6 pb-6 border-b border-navy/10">
                    <div className="w-10 h-10 rounded-full bg-gold text-white grid place-items-center font-bold text-[12px] shrink-0">
                      {authorInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans font-semibold text-[14px] text-navy">{post.author.trim()}</div>
                      <div className="meta text-slate">Senior Advisor</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hero image */}
              {post.heroImage && (
                <div className="aspect-[16/9] rounded-card overflow-hidden mb-10 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Body — rendered through our small inline markdown parser */}
              <MarkdownBody body={post.body} />
            </article>

            {/* Closing CTA */}
            <div className="mt-14 lg:mt-16 card-base p-7 lg:p-8 bg-navy text-ivory rounded-card text-center">
              <div className="sec-eyebrow text-gold mb-2">Talk to us</div>
              <h2 className="font-display font-semibold text-ivory text-[22px] lg:text-[26px] tracking-tight leading-tight mb-3">
                Question about what you just read?
              </h2>
              <p className="body-base text-ivory/75 mb-5 max-w-[480px] mx-auto">
                Our senior advisors are a 15-minute call away. No pitches, no pressure.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-gold text-white font-sans font-semibold text-[14px] shadow-cta hover:bg-gold-hover transition-colors"
              >
                Schedule a call <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            {/* Back to blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 mt-10 text-gold-hover font-sans font-semibold text-[14px] hover:text-navy transition-colors"
            >
              <span aria-hidden>&larr;</span> All articles
            </Link>

          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-16 lg:mt-20 pt-12 border-t border-navy/10 max-w-[1080px] mx-auto">
              <div className="sec-eyebrow mb-3">More from this category</div>
              <h2 className="h2-section text-navy mb-8">Related reading.</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group bg-white rounded-card overflow-hidden border border-navy/8 shadow-[0_2px_12px_hsl(var(--navy)/0.05)] hover:shadow-[0_8px_28px_hsl(var(--navy)/0.10)] transition-shadow block"
                  >
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.heroImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-sans font-bold text-navy text-[16px] leading-snug tracking-tight line-clamp-2 group-hover:text-gold-hover transition-colors">
                        {r.title}
                      </h3>
                      <div className="text-[11.5px] text-slate/70 mt-3 tnum">{formatDate(r.publishedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Minimal markdown renderer
// Handles only the features used in the v1 seed content:
//   ## h2
//   ### h3
//   - bullet list
//   **bold** inline
//   blank-line-separated paragraphs
// Renders as proper React elements (no dangerouslySetInnerHTML, so no
// XSS surface and Tailwind classes apply cleanly).
// ─────────────────────────────────────────────────────────────────────

function MarkdownBody({ body }: { body: BlogPost["body"] }) {
  // Split into blocks on blank lines. Filter empties so trailing newlines
  // don't produce empty <p> tags.
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="markdown-body">
      {blocks.map((block, i) => {
        // H2
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display font-semibold text-navy text-[24px] sm:text-[28px] tracking-tight leading-tight mt-10 mb-4 first:mt-0">
              {renderInline(block.slice(3))}
            </h2>
          );
        }
        // H3
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="font-sans font-bold text-navy text-[18px] sm:text-[19px] tracking-tight leading-snug mt-7 mb-2.5">
              {renderInline(block.slice(4))}
            </h3>
          );
        }
        // Bullet list — block is a list if every line starts with "- "
        const lines = block.split("\n");
        if (lines.every((line) => line.trim().startsWith("- "))) {
          const items = lines.map((line) => line.replace(/^\s*-\s+/, ""));
          return (
            <ul key={i} className="list-disc pl-6 mb-5 space-y-2 text-slate leading-relaxed">
              {items.map((item, j) => (
                <li key={j} className="text-[15.5px] sm:text-[16px]">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        // Default: paragraph. Collapse any single line breaks within the
        // paragraph (markdown convention treats them as soft wraps).
        const collapsed = block.replace(/\s*\n\s*/g, " ");
        return (
          <p
            key={i}
            className="body-base text-slate leading-relaxed mb-5 text-[15.5px] sm:text-[16px]"
          >
            {renderInline(collapsed)}
          </p>
        );
      })}
    </div>
  );
}

// Inline renderer — handles **bold** spans inside any text block.
// Splits on the bold token and emits <strong> for matched segments,
// plain strings for the rest. React handles text safely (no escaping
// needed), so this is XSS-safe by construction.
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Local date formatter — same as latest-blog.tsx, intentionally manual
// so server and client renders agree byte-for-byte.
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}