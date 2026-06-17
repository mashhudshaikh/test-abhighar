"use client";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data";
import Reveal from "./ui/reveal";
import MagneticButton from "./ui/magnetic-button";

// CHANGED in this revision:
//   1. ♡ Save heart icon and its useState favourites store removed —
//      same reasoning as PropertyCard: no persistence layer, no
//      signed-in user, no analytics behind it, so the click was a UI
//      promise we couldn't keep.
//   2. The whole card is now a clickable surface. A full-card <Link>
//      overlay sits at z-1 inside each article and routes to the
//      project detail page. The title is no longer its own <Link>
//      (would have been a nested anchor) — it's an <h3> that uses
//      group-hover to still shift to gold on card hover. The
//      bottom-right arrow Link is lifted with `relative z-[2]` so
//      its own hover (rotate + gold fill) keeps working independently.
//      Price text stays at default stacking so clicks on the price
//      area pass through to the overlay Link and navigate.
//
// Result: visitors can tap anywhere on the card to open the project;
// no orphan favourites button; the arrow CTA is preserved.

export default function FeaturedProjects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-white pt-16 lg:pt-20 pb-14 lg:pb-20 scroll-mt-[100px]">
      <div className="absolute top-[15%] right-[-180px] w-[520px] h-[520px] rounded-full blur-[80px] opacity-50 pointer-events-none animate-drift-3"
           style={{ background: "radial-gradient(circle, hsl(var(--brass) / 0.35), transparent 70%)" }} />
      <div className="absolute bottom-[10%] left-[-150px] w-[340px] h-[340px] rounded-full blur-[80px] opacity-40 pointer-events-none animate-drift-4"
           style={{ background: "radial-gradient(circle, hsl(var(--navy-80) / 0.40), transparent 70%)" }} />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-12 lg:mb-14">
          <Reveal>
            <div className="sec-eyebrow mb-4">Hand-picked This Season</div>
            <h2 className="h2-section text-navy">
              Featured <em className="text-gold italic">residences.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">
                Curated by senior advisors who&apos;ve walked every floor plan and verified every detail.
              </p>
              {/*
                ACTIVATED: now that /all-properties index exists with
                status/locality filters, this link points there. Previously
                disabled-style because no destination existed.
              */}
              <Link
                href="/all-properties"
                className="font-sans font-semibold text-gold-hover inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-navy transition-all"
              >
                View full catalogue <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              {/* `relative` on the article makes the overlay Link's
                  inset-0 absolute positioning anchor to the card.
                  `group` enables group-hover on the title below. */}
              <article className="card-base relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:shadow-hover group">
                {/* Full-card click overlay — same pattern as PropertyCard.
                    z-1 puts it above the image and the content text but
                    below the badge (z-10) and the bottom-right arrow
                    Link (z-2). focus-visible:ring-inset draws the
                    keyboard focus ring inside the card bounds so the
                    article's overflow-hidden doesn't clip it. */}
                <Link
                  href={"/projects/" + p.slug}
                  aria-label={`View details for ${p.name}`}
                  className="absolute inset-0 z-[1] rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                />
                <div className="relative h-[260px] overflow-hidden p-3.5">
                  <span className={"absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-pill meta font-bold tracking-wider " + (p.badgeAlt ? "bg-navy text-white" : "bg-gold text-white shadow-cta")}>
                    {p.badge}
                  </span>
                  {/* REMOVED: the ♡ Save button used to sit at top-6 right-6.
                      Removed because there's no favourites store behind it
                      — no signed-in user, no persistence, no analytics. The
                      click was visual-only. Pulled until there's a real
                      wishlist with admin-side persistence. */}
                  <div className="relative w-full h-full overflow-hidden rounded-[22px]">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[800ms] group-hover:scale-105"/>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-1 flex-1 flex flex-col">
                  <div className="eyebrow text-slate mb-2 flex items-center gap-2">
                    <span aria-hidden>&#9679;</span> {p.location}
                  </div>
                  {/* Title is an <h3> now, not a <Link> — the overlay Link
                      handles navigation. group-hover keeps the gold shift
                      when the visitor hovers anywhere on the card. */}
                  <h3 className="h3-card text-navy mb-3.5 group-hover:text-gold-hover transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex gap-2 flex-wrap mb-5 pb-5 border-b border-dashed border-navy/10">
                    {[p.config, p.area, p.possession].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-pill bg-ivory text-slate meta font-semibold">{s}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="price text-navy">{p.price}
                      <span className="meta text-steel font-normal ml-1">onwards</span>
                    </div>
                    {/* Arrow CTA gets `relative z-[2]` so it sits above the
                        overlay Link — that lets its own rotate-on-hover
                        animation run independently. Both this Link and
                        the overlay Link go to the same place, so the user
                        can click either; they're siblings (not nested),
                        so no invalid HTML. The price text on the left
                        stays at default stacking and lets clicks fall
                        through to the overlay. */}
                    <Link href={"/projects/" + p.slug} aria-label="View" className="relative z-[2] w-10 h-10 rounded-full bg-ivory text-navy grid place-items-center transition-all duration-300 hover:bg-gold hover:text-white hover:-rotate-45 hover:shadow-cta">
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-12 lg:mt-14">
          {/*
            CHANGED: now that /all-properties exists (with status/locality
            filter support), the prominent "Browse all 340 properties" CTA
            points there. Previously this was "/localities/hinjewadi" — a
            single locality, which under-delivered on the "all 340" promise.
          */}
          <MagneticButton href="/all-properties" className="btn-primary">
            Browse all 340 properties
            <span aria-hidden>&rarr;</span>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}