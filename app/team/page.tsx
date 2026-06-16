// app/team/page.tsx
// ─────────────────────────────────────────────────────────────────────
// "See the full team" link on the homepage Advisors section now points
// here. Replaces the previously-disabled v1 fallback.
//
// Data: this page iterates `advisors` from @/lib/data. If you later split
// `advisors` into "homepage-featured advisors" vs "all-advisors", update
// the import below to whichever is the full roster.
//
// Layout matches the design system used elsewhere on the site:
//   - Top breadcrumb + section eyebrow + display heading + body
//   - Card grid (sm: 2 cols, lg: 3 cols) of advisor cards
//   - Closing "join us" CTA panel that points to email
// ─────────────────────────────────────────────────────────────────────
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { advisors } from "@/lib/data";
import Reveal from "@/components/ui/reveal";

export const metadata = {
  title: "Our Team — Abhi Ghar",
  description: "Senior property advisors who walk Pune's neighbourhoods, decode RERA filings, and put your interest first.",
};

export default function TeamPage() {
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
              <span className="text-navy font-semibold">Our Team</span>
            </nav>
            <div className="sec-eyebrow mb-3">Meet the Team</div>
            <h1
              className="font-display font-semibold text-navy leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
            >
              Senior advisors who&apos;ve <em className="text-gold italic">walked these floor plans.</em>
            </h1>
            <p className="body-base text-slate mt-4 max-w-[680px]">
              Real-estate is too important to leave to amateurs. Every member of our team has at least four years of on-ground Pune experience &mdash; knowing builders, decoding RERA filings, and putting your interest first.
            </p>
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {advisors.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.05}>
                <article className="card-base p-7 px-6 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-hover group relative overflow-hidden h-full">
                  {/* Hover glow */}
                  <span
                    aria-hidden
                    className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[220px] h-[160px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(circle, hsl(var(--gold) / 0.25), transparent 70%)",
                      filter: "blur(40px)",
                    }}
                  />

                  {/* Avatar */}
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-white relative z-10 mb-5"
                    style={{
                      boxShadow: "0 0 0 3px hsl(var(--gold)), 0 10px 24px hsl(var(--gold) / 0.22)",
                    }}
                  >
                    <Image src={a.image} alt={a.name} width={112} height={112} className="w-full h-full object-cover" />
                  </div>

                  <div className="font-sans font-bold text-[20px] text-navy mb-1 relative z-10 tracking-tight">{a.name}</div>
                  <div className="meta text-gold font-semibold mb-5 relative z-10">{a.role}</div>

                  <div className="w-full pt-5 border-t border-navy/8 relative z-10">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate/70 mb-0.5">Experience</div>
                        <div className="font-sans font-bold text-[14px] text-navy">{a.exp}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate/70 mb-0.5">Focus Area</div>
                        <div className="font-sans font-bold text-[14px] text-navy">{a.area}</div>
                      </div>
                    </div>
                    {a.rating != null && (
                      <div className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-dashed border-navy/8">
                        <span className="text-gold" aria-hidden>&#9733;</span>
                        <span className="font-sans font-semibold text-[13px] text-navy tnum">{a.rating}</span>
                        <span className="meta text-slate">advisor rating</span>
                      </div>
                    )}
                  </div>

                  {/* CTA — sends the visitor to the contact form. When a
                      per-advisor profile route exists, point to that instead
                      (e.g. /team/{slug}). */}
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-pill bg-navy text-white font-sans font-semibold text-[12.5px] hover:bg-navy/90 transition-colors relative z-10"
                  >
                    Talk to {a.name.split(" ")[0]} <span aria-hidden>&rarr;</span>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Join-us banner — closes the page with a recruiting nudge */}
          <div className="mt-16 lg:mt-20 card-base p-8 lg:p-10 bg-navy text-ivory text-center max-w-[820px] mx-auto rounded-card">
            <div className="sec-eyebrow text-gold mb-3">Join Us</div>
            <h2 className="font-display font-semibold text-ivory text-[24px] lg:text-[30px] tracking-tight leading-tight mb-3">
              We&apos;re always looking for senior advisors.
            </h2>
            <p className="body-base text-ivory/75 mb-6 max-w-[540px] mx-auto">
              If you have 5+ years in Pune real-estate and care more about being right than being right-now, we&apos;d like to hear from you.
            </p>
            <a
              href="mailto:contact@abhighar.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-gold text-white font-sans font-semibold text-[14px] shadow-cta hover:bg-gold-hover transition-colors"
            >
              <span aria-hidden>&#9993;</span> Write to us
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}