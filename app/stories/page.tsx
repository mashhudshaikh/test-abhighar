// app/stories/page.tsx
// ─────────────────────────────────────────────────────────────────────
// "Read all stories" link on the homepage Testimonials section now points
// here. Replaces the previously-disabled v1 fallback.
//
// Data: iterates `testimonials` from @/lib/data. Larger card layout than
// the homepage Testimonials section — quotes get more breathing room and
// the page is dedicated to reading them through.
//
// Closing CTA invites the visitor to submit their own story (links to the
// contact form for now — when there's a dedicated /submit-story endpoint
// or admin route, update the href).
// ─────────────────────────────────────────────────────────────────────
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { testimonials } from "@/lib/data";
import Reveal from "@/components/ui/reveal";

export const metadata = {
  title: "Customer Stories — Abhi Ghar",
  description: "200+ Pune families have trusted Abhi Ghar with their most important decision. Read their stories.",
};

export default function StoriesPage() {
  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">

          {/* Header block */}
          <div className="mb-12 lg:mb-16 max-w-[820px]">
            <nav className="meta text-slate mb-4">
              <Link href="/" className="hover:text-gold-hover">Home</Link>
              <span className="mx-2 text-steel">/</span>
              <span className="text-navy font-semibold">Stories</span>
            </nav>
            <div className="sec-eyebrow mb-3">Happy Families</div>
            <h1
              className="font-display font-semibold text-navy leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
            >
              Homes <em className="text-gold italic">found.</em> Lives changed.
            </h1>
            <p className="body-base text-slate mt-4 max-w-[680px]">
              200+ families have trusted us with the most important decision of their lives. Here are some of their stories &mdash; in their own words.
            </p>
          </div>

          {/* Stats strip — gives a sense of scale at a glance */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-12 lg:mb-16 max-w-[680px]">
            <div className="card-base p-4 sm:p-5 text-center">
              <div className="font-sans font-bold text-[24px] sm:text-[30px] text-navy tnum leading-none">200+</div>
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-slate/70 mt-2">Families</div>
            </div>
            <div className="card-base p-4 sm:p-5 text-center">
              <div className="font-sans font-bold text-[24px] sm:text-[30px] text-navy tnum leading-none">4.9<span className="text-gold">&#9733;</span></div>
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-slate/70 mt-2">Avg Rating</div>
            </div>
            <div className="card-base p-4 sm:p-5 text-center">
              <div className="font-sans font-bold text-[24px] sm:text-[30px] text-navy tnum leading-none">6+ yrs</div>
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-slate/70 mt-2">Of Trust</div>
            </div>
          </div>

          {/* Stories grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="card-base p-8 px-7 flex flex-col h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-brass tracking-[3px] text-[15px]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="font-sans font-bold text-[48px] leading-[0.7] text-gold-light">&ldquo;</span>
                  </div>
                  <p className="body-base text-navy mb-6 flex-1 font-medium">{t.quote}</p>
                  <div className="flex items-center gap-3.5 pt-5 border-t border-dashed border-navy/10">
                    <div className="w-11 h-11 rounded-full bg-gold text-white grid place-items-center font-bold text-[14px] shadow-cta relative shrink-0">
                      <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans font-semibold text-[15px] text-navy truncate">{t.name}</div>
                      <div className="meta text-slate mt-0.5 truncate">{t.meta}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Submit-yours CTA */}
          <div className="mt-16 lg:mt-20 card-base p-8 lg:p-10 bg-ivory text-center max-w-[820px] mx-auto rounded-card">
            <div className="sec-eyebrow mb-3">Share Yours</div>
            <h2 className="font-display font-semibold text-navy text-[24px] lg:text-[30px] tracking-tight leading-tight mb-3">
              Found your home with us?
            </h2>
            <p className="body-base text-slate mb-6 max-w-[540px] mx-auto">
              Stories like the ones above help other buyers know they&apos;re in good hands. Take a few minutes to share yours &mdash; we&apos;ll write back personally.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-gold text-white font-sans font-semibold text-[14px] shadow-cta hover:bg-gold-hover transition-colors"
            >
              Share your story <span aria-hidden>&rarr;</span>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}