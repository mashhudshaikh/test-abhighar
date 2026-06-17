// app/all-properties/page.tsx
// ─────────────────────────────────────────────────────────────────────
// REVISED to match the real data shape. Previously this page imported
// `projects` (just 3 featured items with featured-card field names);
// now it uses the full `properties` array (21 items) with the actual
// Property type:
//   { slug, name, builder, localitySlug, localityArea, status,
//     bhkRange, bhkOptions, areaMin, areaRange, possessionLabel,
//     possessionYear, priceDisplay, priceMin, priceMax, thumbnail, ... }
//
// Filters (query-param backed):
//   ?status=ready          → status === "ready"
//   ?status=new-launch     → possessionYear === newest year in catalogue
//   ?status=under-construction → status === "under-construction"
//   ?locality=<slug>       → localitySlug === <slug>   (slug, not display name)
//
// Two filters stack: ?status=ready&locality=baner returns ready properties
// in Baner only.
//
// useSearchParams requires a Suspense boundary in Next 14, so the page
// default-exports a Suspense wrapper around the actual content component.
//
// CHANGED in this revision:
//   - ♡ Save heart icon and its useState favourites store removed
//     (no persistence layer, no signed-in user — same reasoning as
//     PropertyCard and FeaturedProjects).
//   - Each card is now a clickable surface: a full-card <Link> overlay
//     at z-1 routes to the project detail page. The title became an
//     <h3> (group-hover preserves the gold colour shift). The arrow
//     CTA at bottom-right uses `relative z-[2]` so its own rotate
//     animation still runs.
// ─────────────────────────────────────────────────────────────────────
"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Reveal from "@/components/ui/reveal";
import { properties, localities, type Property } from "@/lib/data";

// Newest possession year across the catalogue — used to define what
// "New Launch" means relative to the freshest cohort instead of
// hardcoding a year. Computed once at module load, not per render.
const NEWEST_POSSESSION_YEAR = Math.max(...properties.map((p) => p.possessionYear));

type StatusFilter = "" | "ready" | "new-launch" | "under-construction";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "",                   label: "All" },
  { value: "ready",              label: "Ready to Move" },
  { value: "new-launch",         label: "New Launches" },
  { value: "under-construction", label: "Under Construction" },
];

// Maps a status filter to a predicate against a property. The logic is
// structured against the Property type fields rather than free-form
// string matching — more reliable since the data is well-shaped.
function statusMatches(prop: Property, filter: StatusFilter): boolean {
  switch (filter) {
    case "":                    return true;
    case "ready":               return prop.status === "ready";
    case "under-construction":  return prop.status === "under-construction";
    case "new-launch":          return prop.possessionYear === NEWEST_POSSESSION_YEAR;
    default:                    return true;
  }
}

// Derives the badge text and visual variant shown on the card. Cards in
// the existing featured-projects section show a single badge per card
// (e.g. "New Launch", "Ready to Move", "Trending"); we follow the same
// pattern here, computed deterministically from the structured fields.
function badgeFor(prop: Property): { text: string; variant: "gold" | "navy" | "green" } {
  if (prop.status === "ready") return { text: "Ready to Move", variant: "green" };
  if (prop.possessionYear === NEWEST_POSSESSION_YEAR) return { text: "New Launch", variant: "gold" };
  return { text: "Under Construction", variant: "navy" };
}

function AllPropertiesContent() {
  const params = useSearchParams();
  // Initial filter state seeded from URL. If the visitor lands via
  // /all-properties?status=ready, the Ready pill is pre-selected on load.
  const initialStatus = (params?.get("status") ?? "") as StatusFilter;
  const initialLocality = params?.get("locality") ?? "";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [localityFilter, setLocalityFilter] = useState(initialLocality);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (!statusMatches(p, statusFilter)) return false;
      // localityFilter is a slug ("baner") matched against localitySlug,
      // not against the display string in localityArea. Slug match is
      // exact and unambiguous.
      if (localityFilter && p.localitySlug !== localityFilter) return false;
      return true;
    });
  }, [statusFilter, localityFilter]);

  const totalCount = properties.length;
  const showingCount = filtered.length;
  const activeFilterCount = (statusFilter ? 1 : 0) + (localityFilter ? 1 : 0);

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">

          {/* Header block */}
          <div className="mb-10 lg:mb-12 max-w-[820px]">
            <nav className="meta text-slate mb-4">
              <Link href="/" className="hover:text-gold-hover">Home</Link>
              <span className="mx-2 text-steel">/</span>
              <span className="text-navy font-semibold">All Properties</span>
            </nav>
            <div className="sec-eyebrow mb-3">Full Catalogue</div>
            <h1
              className="font-display font-semibold text-navy leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
            >
              Every project, <em className="text-gold italic">vetted.</em>
            </h1>
            <p className="body-base text-slate mt-4 max-w-[680px]">
              Every project on this page has been visited by a senior advisor &mdash; floor plans walked, builders vetted, RERA filings checked. Filter by status or locality to narrow down.
            </p>
          </div>

          {/* Filters strip */}
          <div className="flex flex-wrap gap-3 items-center mb-8 lg:mb-10 pb-6 border-b border-navy/10">

            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = statusFilter === opt.value;
                return (
                  <button
                    key={opt.value || "all"}
                    onClick={() => setStatusFilter(opt.value)}
                    aria-pressed={active}
                    className={
                      "px-4 py-2 rounded-pill border text-[13px] font-sans font-semibold transition-colors " +
                      (active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-navy border-navy/15 hover:border-navy/40")
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Locality dropdown — values are slugs so the URL stays clean
                (?locality=baner not ?locality=Baner+Pune+West). */}
            <div className="relative">
              <select
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-pill bg-white border border-navy/15 text-[13px] font-sans font-semibold text-navy cursor-pointer hover:border-navy/40 transition-colors min-w-[180px]"
                aria-label="Filter by locality"
              >
                <option value="">All localities</option>
                {localities.map((l) => (
                  <option key={l.slug} value={l.slug}>{l.name}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy/50 text-[10px]" aria-hidden>&#9662;</span>
            </div>

            {/* Clear all — only when at least one filter active */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setStatusFilter(""); setLocalityFilter(""); }}
                className="meta text-slate hover:text-navy underline underline-offset-2 transition-colors"
              >
                Clear filters
              </button>
            )}

            {/* Result count — pushed to the right */}
            <div className="ml-auto meta text-slate self-center tnum">
              Showing {showingCount} of {totalCount} {totalCount === 1 ? "property" : "properties"}
            </div>
          </div>

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <div className="card-base p-10 lg:p-14 text-center max-w-[520px] mx-auto">
              <div className="w-14 h-14 rounded-full bg-ivory grid place-items-center mx-auto mb-5 text-slate">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="font-sans font-bold text-[18px] text-navy mb-2 tracking-tight">No properties match these filters</div>
              <p className="body-base text-slate mb-6">Try removing a filter, or talk to an advisor about what you&apos;re looking for &mdash; we may have something off-list.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => { setStatusFilter(""); setLocalityFilter(""); }}
                  className="px-5 py-2.5 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] shadow-cta hover:bg-gold-hover transition-colors"
                >
                  Clear filters
                </button>
                <Link
                  href="/#contact"
                  className="px-5 py-2.5 rounded-pill border border-navy/15 text-navy font-sans font-semibold text-[13px] hover:border-navy/40 transition-colors"
                >
                  Talk to advisor
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((p, i) => {
                const badge = badgeFor(p);
                const badgeClass =
                  badge.variant === "gold"  ? "bg-gold text-white shadow-cta" :
                  badge.variant === "green" ? "bg-success/15 text-success border border-success/30" :
                                              "bg-navy text-white";
                return (
                  <Reveal key={p.slug} delay={i * 0.04}>
                    {/* Card shape adapted from featured-projects.tsx but
                        wired to the Property type's actual field names:
                        thumbnail (not image), localityArea (not location),
                        bhkRange / areaMin / possessionLabel (not config /
                        area / possession), priceDisplay (not price).

                        `relative` + the overlay Link below = full-card
                        click target. h-full keeps cards equal-height in
                        a flex row even when some cards have longer text. */}
                    <article className="card-base relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:shadow-hover group h-full">
                      {/* Full-card click overlay — see comment in
                          property-card.tsx / featured-projects.tsx for
                          the full reasoning on the z-index stacking. */}
                      <Link
                        href={"/projects/" + p.slug}
                        aria-label={`View details for ${p.name}`}
                        className="absolute inset-0 z-[1] rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                      />
                      <div className="relative h-[260px] overflow-hidden p-3.5">
                        <span className={"absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-pill text-[11px] font-bold tracking-wider " + badgeClass}>
                          {badge.text}
                        </span>
                        {/* REMOVED: ♡ Save button at top-6 right-6 — no
                            backend to persist favourites, so clicking
                            promised something the app couldn't deliver. */}
                        <div className="relative w-full h-full overflow-hidden rounded-[22px]">
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="px-7 pb-7 pt-1 flex-1 flex flex-col">
                        <div className="eyebrow text-slate mb-2 flex items-center gap-2">
                          <span aria-hidden>&#9679;</span> {p.localityArea}
                        </div>
                        {/* Title was a Link; now an h3 with group-hover —
                            same reasoning as the other revised cards. */}
                        <h3 className="h3-card text-navy mb-1 group-hover:text-gold-hover transition-colors">
                          {p.name}
                        </h3>
                        <div className="meta text-slate/70 mb-3.5">By {p.builder}</div>
                        <div className="flex gap-2 flex-wrap mb-5 pb-5 border-b border-dashed border-navy/10">
                          {[p.bhkRange, p.areaMin, p.possessionLabel].map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-pill bg-ivory text-slate meta font-semibold">{s}</span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="price text-navy">
                            {p.priceDisplay}
                          </div>
                          {/* Arrow CTA gets `relative z-[2]` so it sits
                              above the overlay Link — preserves its
                              rotate-on-hover animation independently of
                              the card's group-hover lift. */}
                          <Link
                            href={"/projects/" + p.slug}
                            aria-label={"View " + p.name}
                            className="relative z-[2] w-10 h-10 rounded-full bg-ivory text-navy grid place-items-center transition-all duration-300 hover:bg-gold hover:text-white hover:-rotate-45 hover:shadow-cta"
                          >
                            <span aria-hidden>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

// Page export — wraps the content in Suspense so useSearchParams works
// without throwing during build. The fallback renders the page chrome
// (header + container with a spinner line) so layout doesn't flash.
export default function AllPropertiesPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="pt-[100px] lg:pt-[110px] pb-16">
            <div className="container-x">
              <div className="card-base p-10 text-center max-w-[420px] mx-auto">
                <div className="meta text-slate">Loading catalogue&hellip;</div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <AllPropertiesContent />
    </Suspense>
  );
}