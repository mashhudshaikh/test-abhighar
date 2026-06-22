"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Property, getPropertyType, type PropertyType } from "@/lib/data";
import PropertyCard from "./property-card";

// FIXED: "Studio Apartment" needs its own closing quote, then the pipe, then
// the next option starts with its own opening quote. Previously this was
// written as `"Studio Apartment | "Commercial"` which TypeScript read as a
// single unterminated string literal "Studio Apartment | " followed by a
// loose identifier `Commercial`.
type PropertyTypeKey = "Apartment" | "Villa" | "Duplex" | "Plot" | "Studio Apartment" | "Commercial";

const PROPERTY_TYPE_OPTIONS: PropertyTypeKey[] = ["Apartment", "Villa", "Duplex", "Plot", "Studio Apartment", "Commercial"];

const PROPERTY_TYPE_CONFIG: Record<PropertyTypeKey, { label: string; options: string[] }> = {
  Apartment:           { label: "BHK",        options: ["Any", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Villa:               { label: "BHK",        options: ["Any", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Duplex:              { label: "BHK",        options: ["Any", "3 BHK", "4 BHK", "5 BHK", "6+ BHK"] },
  Plot:                { label: "Listing",    options: ["Any", "Buy", "Lease"] },
  // FIXED: Object keys containing whitespace must be quoted. The bare
  // `Studio Apartment:` was being parsed as shorthand property `Studio`
  // followed by a stray `Apartment` identifier, hence the cascade of errors.
  "Studio Apartment":  { label: "Config",     options: ["Any", "1 RK"] },
  Commercial:          { label: "Space Type", options: ["Any", "Showroom", "Shop", "Office Space", "Lease"] },
};

// Maps the visitor-facing dropdown labels ("Apartment", "Villa",
// "Studio Apartment", "Commercial", …) onto the canonical PropertyType
// union from lib/data.ts that getPropertyType(p) returns. Lets the
// filter compare apples to apples instead of trying to match a display
// label ("Studio Apartment") against a data value ("studio").
//
// Centralised here so the table never drifts: add a new entry to
// PropertyTypeKey above and a new key here, TypeScript will error on
// any missing mapping at compile time (Record<...> is exhaustive).
const LABEL_TO_PROPERTY_TYPE: Record<PropertyTypeKey, PropertyType> = {
  Apartment:          "apartment",
  Villa:              "villa",
  Duplex:             "duplex",
  Plot:               "plot",
  "Studio Apartment": "studio",
  Commercial:         "commercial",
};

type Possession = "all" | "new-launch" | "under-construction" | "nearing" | "ready";
type Sort = "newest" | "price-low" | "price-high";

const PRICE_MIN_BOUND = 0;
const PRICE_MAX_BOUND = 1000;
const PRICE_STEP = 10;

// Hard cap on how many properties can be compared at once. 4 is the typical
// real-estate-portal convention (NoBroker / 99acres / MagicBricks all use 4)
// — it's the most a side-by-side table can show without each column getting
// so narrow that the values become unreadable on a typical laptop.
const COMPARE_MAX = 4;

// ── PAGINATION ──────────────────────────────────────────────────────
// How many cards to render on first paint, and how many more to reveal
// when "Load more properties" is clicked. 6 per page matches the 2-col
// grid × 3 rows on desktop, so the visitor always sees clean rows
// instead of orphaned cards on the last row. Increase if the catalogue
// grows and 6 starts feeling too short for the typical locality.
const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

const PRICE_TICKS = [
  { value: 0,    label: "0",     major: true  },
  { value: 100,  label: "₹1 Cr", major: false },
  { value: 200,  label: "₹2 Cr", major: true  },
  { value: 300,  label: "₹3 Cr", major: false },
  { value: 400,  label: "₹4 Cr", major: true  },
  { value: 500,  label: "₹5 Cr", major: false },
  { value: 600,  label: "₹6 Cr", major: true  },
  { value: 700,  label: "₹7 Cr", major: false },
  { value: 800,  label: "₹8 Cr", major: true  },
  { value: 900,  label: "₹9 Cr", major: false },
  { value: 1000, label: "10 Cr+", major: true },
];

function formatPrice(lakhs: number): string {
  if (lakhs >= PRICE_MAX_BOUND) return "10 Cr+";
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return cr % 1 === 0 ? "₹" + cr + " Cr" : "₹" + cr.toFixed(2).replace(/\.?0+$/, "") + " Cr";
  }
  return "₹" + lakhs + " L";
}

function bhkFromLabel(label: string): number | null {
  const m = label.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// — Locality switcher needs to know all available localities to build the list.
//   This list mirrors `localities` in lib/data.ts. If you'd rather single-source it,
//   pass it as a prop from the page (see the page.tsx update).
type LocalityOption = { slug: string; name: string };

export default function LocalityListings({
  localityName,
  localitySlug,
  allLocalities,
  properties,
}: {
  localityName: string;
  localitySlug: string;
  allLocalities: LocalityOption[];
  properties: Property[];
}) {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState<PropertyTypeKey>("Apartment");
  const [typeSubChoice, setTypeSubChoice] = useState<string>("Any");
  const [priceMin, setPriceMin] = useState(PRICE_MIN_BOUND);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_BOUND);
  const [possession, setPossession] = useState<Possession>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const [openPill, setOpenPill] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // ── COMPARE STATE ──────────────────────────────────────────────────
  // List of property slugs the visitor has marked for comparison. Storing
  // slugs (not full Property objects) keeps the state lean and lets us
  // resolve the current Property data from the `properties` prop on each
  // render — important because Property records could be updated in
  // future without us holding stale snapshots in state.
  //
  // showCompare is the modal's open/close flag. We deliberately keep it
  // separate from compareSlugs.length so the visitor can close the modal
  // without losing their selection — common UX pattern when they want to
  // tweak the list and reopen.
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // ── Pagination ─────────────────────────────────────────────────
  // How many of the filtered cards are visible right now. Starts at
  // INITIAL_PAGE_SIZE; "Load more" bumps by PAGE_INCREMENT. We reset
  // back to the initial size whenever a filter (or sort) changes
  // because that's effectively a new browse session — the visitor's
  // mental model is "showing the top 6 results for this query", not
  // "expand whatever I had open before". Without the reset, a user
  // who had loaded 24 cards and then narrowed by type would still see
  // 24 cards on a new query, which feels off and skips the natural
  // re-orientation moment.
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Resolve slugs to live Property records. If a slug disappears from
  // `properties` (e.g. a project gets unpublished mid-session), it just
  // drops out of the compare bar silently rather than throwing.
  const compareItems = useMemo(
    () => compareSlugs
      .map((s) => properties.find((p) => p.slug === s))
      .filter((p): p is Property => Boolean(p)),
    [compareSlugs, properties]
  );

  const toggleCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      // Cap at COMPARE_MAX. We could show a toast here, but the Compare
      // button on already-full state simply doesn't add — the bottom bar
      // already shows "n / 4" so the visitor sees the cap was hit.
      if (prev.length >= COMPARE_MAX) return prev;
      return [...prev, slug];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
    setShowCompare(false);
  }, []);

  // ESC closes the compare modal — same convention used elsewhere on this
  // page for the pill bottom-sheets.
  useEffect(() => {
    if (!showCompare) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCompare(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showCompare]);

  // Lock body scroll while the modal is open — prevents the page below
  // from scrolling under the overlay on mobile, and keeps the modal
  // visually anchored on desktop.
  useEffect(() => {
    if (!showCompare) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showCompare]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterBarRef.current) return;
      if (!filterBarRef.current.contains(e.target as Node)) {
        setOpenPill(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPill(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 640) return;
    if (!openPill) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("sheet-open");
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("sheet-open");
    };
  }, [openPill]);

  const togglePill = useCallback((id: string) => {
    setOpenPill((curr) => (curr === id ? null : id));
  }, []);

  const handlePropertyTypeChange = (next: PropertyTypeKey) => {
    setPropertyType(next);
    setTypeSubChoice("Any");
    setOpenPill(null);
  };

  // Navigate to another locality's page when user selects a different one
  const handleLocalityChange = (slug: string) => {
    setOpenPill(null);
    if (slug === localitySlug) return; // same page, no nav
    router.push("/localities/" + slug);
  };

  const currentTypeConfig = PROPERTY_TYPE_CONFIG[propertyType];

  const filtered = useMemo(() => {
    let list = [...properties];

    // ── Type filter (the new piece) ────────────────────────────────
    // Match each property's classification against the dropdown
    // selection. Records without an explicit `type` field default to
    // "apartment" via getPropertyType, so flipping the dropdown to
    // Villa / Studio Apartment / Commercial correctly narrows to those
    // tagged records and shows the empty state when none exist in the
    // current locality.
    //
    // This used to be missing entirely — the dropdown value was only
    // wired to swap the sub-choice options (BHK vs Space Type vs
    // Listing), but the property list itself ignored the type
    // selection, which is why "Commercial" was still showing
    // apartments.
    const wantedType = LABEL_TO_PROPERTY_TYPE[propertyType];
    list = list.filter((p) => getPropertyType(p) === wantedType);

    if (currentTypeConfig.label === "BHK" && typeSubChoice !== "Any") {
      const n = bhkFromLabel(typeSubChoice);
      if (n !== null && n <= 5) {
        list = list.filter((p) => p.bhkOptions.includes(n as 1 | 2 | 3 | 4 | 5));
      } else if (n !== null && n >= 5) {
        list = list.filter((p) => p.bhkOptions.includes(5));
      }
    }

    const effectiveMax = priceMax >= PRICE_MAX_BOUND ? Infinity : priceMax;
    list = list.filter((p) => p.priceMin <= effectiveMax && p.priceMax >= priceMin);

    if (possession === "ready") {
      list = list.filter((p) => p.status === "ready");
    } else if (possession === "nearing") {
      list = list.filter((p) => p.status === "under-construction" && p.possessionYear <= 2027);
    } else if (possession === "under-construction") {
      list = list.filter((p) => p.status === "under-construction" && p.possessionYear === 2028);
    } else if (possession === "new-launch") {
      list = list.filter((p) => p.status === "under-construction" && p.possessionYear >= 2029);
    }

    if (sort === "price-low")  list.sort((a, b) => a.priceMin - b.priceMin);
    if (sort === "price-high") list.sort((a, b) => b.priceMax - a.priceMax);
    return list;
    // propertyType added to the deps array — without it React would
    // memo-cache the previous filter result and skip re-running when
    // the dropdown changed, even though the predicate now reads it.
  }, [properties, propertyType, currentTypeConfig.label, typeSubChoice, priceMin, priceMax, possession, sort]);

  // Reset the paginated view back to the first page whenever the
  // filter/sort inputs change. Mirrors the dependency list of the
  // `filtered` useMemo above so any future filter added in one place
  // is reflected in the other.
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [propertyType, typeSubChoice, priceMin, priceMax, possession, sort]);

  // Slice of `filtered` we actually render. Kept as its own derived
  // value so the count display ("X properties in Y") still shows the
  // full filtered total — the slice only affects what's painted in
  // the grid, not the headline number above it.
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;
  const nextBatchSize = Math.min(PAGE_INCREMENT, filtered.length - visibleCount);

  const budgetSummary =
    priceMin === PRICE_MIN_BOUND && priceMax >= PRICE_MAX_BOUND
      ? "Any"
      : formatPrice(priceMin) + " – " + formatPrice(priceMax);

  const possessionLabel =
    possession === "all" ? "Any" :
    possession === "new-launch" ? "New Launch" :
    possession === "under-construction" ? "Under Constr." :
    possession === "nearing" ? "Nearing" :
    "Ready";

  return (
    <div className="container-x py-6 sm:py-8 lg:py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 sm:mb-5">
        <div className="meta text-slate">
          <strong className="text-navy font-semibold">{filtered.length}</strong> propert
          {filtered.length === 1 ? "y" : "ies"} in {localityName}
        </div>
      </div>

      <div ref={filterBarRef} className="mb-6 sm:mb-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <div className="flex items-center gap-2 overflow-x-auto -mx-3 px-3 pb-1 lg:pb-0 lg:overflow-visible lg:flex-wrap lg:mx-0 lg:px-0 no-scrollbar">

            {/* Locality switcher pill — replaces the old static "1 locality" badge */}
            <LocalityPill
              id="locality"
              openPill={openPill}
              togglePill={togglePill}
              currentName={localityName}
              currentSlug={localitySlug}
              allLocalities={allLocalities}
              onChange={handleLocalityChange}
            />

            <Pill id="propertyType" openPill={openPill} togglePill={togglePill} label="Type" value={propertyType}>
              {PROPERTY_TYPE_OPTIONS.map((v) => (
                <Opt key={v} active={propertyType === v} onClick={() => handlePropertyTypeChange(v)}>
                  {v}
                </Opt>
              ))}
            </Pill>

            <Pill
              id="typeSubChoice"
              openPill={openPill}
              togglePill={togglePill}
              label={currentTypeConfig.label}
              value={typeSubChoice}
            >
              {currentTypeConfig.options.map((v) => (
                <Opt
                  key={v}
                  active={typeSubChoice === v}
                  onClick={() => { setTypeSubChoice(v); setOpenPill(null); }}
                >
                  {v}
                </Opt>
              ))}
            </Pill>

            <Pill id="budget" openPill={openPill} togglePill={togglePill} label="Budget" value={budgetSummary} wide>
              <RangeSlider
                min={PRICE_MIN_BOUND}
                max={PRICE_MAX_BOUND}
                step={PRICE_STEP}
                valueMin={priceMin}
                valueMax={priceMax}
                onChange={(lo, hi) => { setPriceMin(lo); setPriceMax(hi); }}
                format={formatPrice}
                ticks={PRICE_TICKS}
              />
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy/8">
                <button type="button" onClick={() => { setPriceMin(PRICE_MIN_BOUND); setPriceMax(PRICE_MAX_BOUND); }} className="text-[12px] font-semibold text-slate hover:text-navy transition-colors">
                  Reset
                </button>
                <button type="button" onClick={() => setOpenPill(null)} className="px-4 py-1.5 rounded-pill bg-gold text-white text-[12px] font-semibold hover:bg-gold-hover transition-colors shadow-cta">
                  Apply
                </button>
              </div>
            </Pill>

            <Pill id="possession" openPill={openPill} togglePill={togglePill} label="Possession" value={possessionLabel}>
              <Opt active={possession === "all"}                 onClick={() => { setPossession("all"); setOpenPill(null); }}>Any</Opt>
              <Opt active={possession === "new-launch"}          onClick={() => { setPossession("new-launch"); setOpenPill(null); }}>New Launch</Opt>
              <Opt active={possession === "under-construction"} onClick={() => { setPossession("under-construction"); setOpenPill(null); }}>Under Construction</Opt>
              <Opt active={possession === "nearing"}             onClick={() => { setPossession("nearing"); setOpenPill(null); }}>Nearing Possession</Opt>
              <Opt active={possession === "ready"}               onClick={() => { setPossession("ready"); setOpenPill(null); }}>Ready to Move</Opt>
            </Pill>
          </div>

          <div className="flex items-center gap-2 lg:shrink-0">
            <span className="meta text-slate shrink-0">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="flex-1 lg:flex-none bg-white border border-navy/10 rounded-pill px-3 sm:px-4 py-2 text-[12.5px] sm:text-[13px] font-semibold text-navy outline-none focus:border-gold"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price · Low to High</option>
              <option value="price-high">Price · High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        // ── PROPERTY GRID ─────────────────────────────────────────────
        // No wrapper overlay anymore — the Compare chip lives inside
        // PropertyCard itself (bottom-left of the hero image). We pass
        // `selected` and `onCompareToggle` to wire its existing
        // checkbox visual to our local compare state. `compareDisabled`
        // is set when the cap of 4 is hit, so unselected cards become
        // visually dimmed and non-clickable until something is removed.
        //
        // We render `visible` (the paginated slice) here rather than
        // the full `filtered` array — the rest become visible when the
        // visitor clicks "Load more" below the grid.
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {visible.map((p) => {
            const selected = compareSlugs.includes(p.slug);
            const atCap = !selected && compareSlugs.length >= COMPARE_MAX;
            return (
              <PropertyCard
                key={p.slug}
                property={p}
                selected={selected}
                compareDisabled={atCap}
                onCompareToggle={() => toggleCompare(p.slug)}
              />
            );
          })}
        </div>
      )}

      {/* "Load more properties" — only shown when there are still
          un-rendered cards in the filtered set. The label includes the
          exact count of the next batch so the visitor knows what
          they're getting (e.g. "Load 6 more properties", or
          "Load 2 more properties" if only 2 remain). On click we
          extend `visibleCount` by the page increment; once everything
          is shown the button silently disappears. */}
      {hasMore && (
        <div className="text-center mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_INCREMENT, filtered.length))}
            className="px-6 sm:px-7 h-11 sm:h-12 rounded-pill bg-white border border-navy/15 text-navy font-semibold text-[13.5px] sm:text-[14px] hover:border-gold hover:text-gold-hover transition-colors"
          >
            Load {nextBatchSize} more {nextBatchSize === 1 ? "property" : "properties"}
          </button>
        </div>
      )}

      {/* ── COMPARE TRAY (sticky bottom bar) ──────────────────────────────
          Appears only when at least one item is selected. Sits above the
          floating WhatsApp button (z-50 vs WA's z-60 — WA still wins, so
          we use z-[55] and the body.sheet-open class still hides WA when
          the modal opens). Shows compact previews of selected properties
          + a primary CTA, all dismissible. */}
      {compareItems.length > 0 && !showCompare && (
        <CompareTray
          items={compareItems}
          onRemove={(slug) => toggleCompare(slug)}
          onCompare={() => setShowCompare(true)}
          onClear={clearCompare}
        />
      )}

      {/* ── COMPARE MODAL ──────────────────────────────
          Full-screen overlay with the side-by-side comparison table.
          Closes via the X button, ESC, or backdrop click. Selection
          persists when closed so the visitor can tweak via the tray. */}
      {showCompare && compareItems.length > 0 && (
        <CompareModal
          items={compareItems}
          onClose={() => setShowCompare(false)}
          onRemove={(slug) => toggleCompare(slug)}
          onClearAll={clearCompare}
        />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        body.sheet-open [data-whatsapp-float],
        body.sheet-open .whatsapp-float {
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
      `}</style>
    </div>
  );
}

// ━━━ COMPARE TRAY ━━━
// Sticky bottom bar shown while at least one item is selected for compare
// and the modal is closed. Lists thumbnails / names of selected items
// with per-item remove (×), a Clear All and a primary "Compare N
// Properties" CTA. On mobile it collapses to just the count + CTA to
// avoid eating screen space.
function CompareTray({
  items,
  onRemove,
  onCompare,
  onClear,
}: {
  items: Property[];
  onRemove: (slug: string) => void;
  onCompare: () => void;
  onClear: () => void;
}) {
  return (
    <div
      role="region"
      aria-label={"Compare " + items.length + " selected " + (items.length === 1 ? "property" : "properties")}
      className="fixed inset-x-0 bottom-0 z-[55] px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-[1100px] mx-auto bg-navy text-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.30)] border border-white/8 backdrop-blur-md overflow-hidden animate-tray-up">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold/20 text-gold text-[12px] font-bold tnum">
              {items.length}
            </span>
            <span className="text-[12.5px] sm:text-[13px] font-semibold tracking-tight">
              <span className="sm:hidden">{items.length} / {COMPARE_MAX}</span>
              <span className="hidden sm:inline">{items.length === 1 ? "property" : "properties"} to compare</span>
            </span>
          </div>

          {/* Item chips — hidden on small screens to keep the bar compact.
              Each chip is removable; click on the × deletes the item from
              the selection without opening the modal. */}
          <div className="hidden sm:flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {items.map((p) => (
              <div
                key={p.slug}
                className="shrink-0 inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full bg-white/10 border border-white/12 max-w-[180px]"
              >
                <span className="w-6 h-6 rounded-full bg-gold/20 grid place-items-center overflow-hidden shrink-0">
                  {/* Thumbnail — graceful fallback to initial if image
                      missing. Using Next/Image for consistent sizing. */}
                  {p.thumbnail ? (
                    <Image
                      src={p.thumbnail}
                      alt=""
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-gold">{(p.name || "?")[0]}</span>
                  )}
                </span>
                <span className="text-[11.5px] font-semibold truncate max-w-[120px]">{p.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(p.slug)}
                  aria-label={"Remove " + p.name}
                  className="w-4 h-4 rounded-full text-white/70 hover:text-white hover:bg-white/15 grid place-items-center shrink-0"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6"  x2="6"  y2="18" />
                    <line x1="6"  y1="6"  x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={onClear}
              className="hidden sm:inline-flex text-[12px] font-semibold text-white/65 hover:text-white px-2 py-1.5 transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onCompare}
              disabled={items.length < 2}
              title={items.length < 2 ? "Add at least 2 properties to compare" : undefined}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-pill bg-gold text-white text-[12.5px] sm:text-[13px] font-semibold shadow-cta hover:bg-gold-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="18" y2="18" />
              </svg>
              <span className="hidden sm:inline">Compare {items.length} {items.length === 1 ? "property" : "properties"}</span>
              <span className="sm:hidden">Compare</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes trayUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-tray-up { animation: trayUp 0.32s cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
    </div>
  );
}

// ━━━ COMPARE MODAL ━━━
// Side-by-side comparison table for the selected properties. Rows are the
// attributes we want to surface; columns are the properties. Empty/unknown
// values render as "—" so missing data is obvious. Differences are
// highlighted across the row so the visitor can spot what varies at a
// glance.
function CompareModal({
  items,
  onClose,
  onRemove,
  onClearAll,
}: {
  items: Property[];
  onClose: () => void;
  onRemove: (slug: string) => void;
  onClearAll: () => void;
}) {
  // Row definitions — each function pulls a string from a Property. We
  // tolerate fields that might not exist on every Property variant by
  // doing optional chaining and fallback to "—". Adding a new row is a
  // one-line append here.
  const rows: { label: string; get: (p: Property) => string }[] = [
    { label: "Builder",         get: (p) => p.builder || "—" },
    { label: "Locality",        get: (p) => p.localityArea || "—" },
    { label: "Status",          get: (p) => p.status === "ready" ? "Ready to Move" : "Under Construction" },
    { label: "Configurations",  get: (p) => p.bhkRange || (p.bhkOptions?.length ? p.bhkOptions.join(", ") + " BHK" : "—") },
    { label: "Carpet Area",     get: (p) => p.areaRange || (p.areaMin ? p.areaMin + "+ sq.ft" : "—") },
    { label: "Price",           get: (p) => p.priceDisplay || "—" },
    { label: "Possession",      get: (p) => p.possessionLabel || (p.possessionYear ? String(p.possessionYear) : "—") },
    { label: "RERA",            get: (p) => p.rera || "—" },
    { label: "Total Units",     get: (p) => p.totalUnits ? String(p.totalUnits) : "—" },
    { label: "Towers · Floors", get: (p) => {
        const t = p.towers ? p.towers + " towers" : "";
        const f = p.floors ? p.floors + " floors" : "";
        const joined = [t, f].filter(Boolean).join(" · ");
        return joined || "—";
      },
    },
    { label: "Amenities",       get: (p) => p.amenities?.length ? p.amenities.length + " amenities" : "—" },
    { label: "Litigation",      get: (p) => p.litigation || "—" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Compare properties"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comparison"
        className="absolute inset-0 bg-navy/55 backdrop-blur-sm animate-fade-in cursor-default"
      />

      <div className="relative bg-white rounded-[20px] shadow-[0_30px_80px_rgba(0,0,0,0.30)] w-full max-w-[1100px] max-h-[88vh] flex flex-col overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-navy/8 shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-hover mb-0.5">Compare</div>
            <h2 className="font-display font-bold text-[19px] sm:text-[22px] text-navy tracking-tight leading-tight">
              {items.length} {items.length === 1 ? "property" : "properties"} side by side
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearAll}
              className="hidden sm:inline-flex text-[12.5px] font-semibold text-slate hover:text-navy px-2 py-1.5 transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full text-navy hover:bg-navy/5 grid place-items-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table — vertically scrollable while header sticks. The horizontal
            overflow handles 3-4 columns on tablets gracefully. */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            {/* Column heads — property cards. Sticky on the top edge so
                the visitor always knows which property each column is
                for as they scroll the rows. */}
            <thead className="sticky top-0 z-10 bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate/60 align-bottom border-b border-navy/10 bg-white" style={{ minWidth: "140px" }}>
                  Attribute
                </th>
                {items.map((p) => (
                  <th key={p.slug} className="px-3 py-3 text-left border-b border-navy/10 bg-white align-bottom" style={{ minWidth: "180px" }}>
                    <div className="relative">
                      <div className="w-full aspect-[16/10] rounded-card overflow-hidden bg-ivory mb-2.5 relative">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-slate/40 text-xs">No image</div>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemove(p.slug)}
                          aria-label={"Remove " + p.name + " from comparison"}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 text-navy hover:bg-navy hover:text-white grid place-items-center transition-colors shadow-card"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                      <div className="font-sans font-bold text-[14px] text-navy leading-tight tracking-tight truncate">{p.name}</div>
                      <div className="meta text-slate truncate mt-0.5">{p.builder || "—"}</div>
                      {p.slug && (
                        <Link
                          href={"/projects/" + p.slug}
                          className="inline-flex items-center gap-1 mt-2 text-[11.5px] font-semibold text-gold-hover hover:text-gold transition-colors"
                        >
                          View details
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIdx) => {
                // Highlight rows where values differ across columns —
                // helps the buyer spot the deciding factor (e.g. price
                // range differs by 50L, RERA numbers differ, etc.).
                const values = items.map((p) => row.get(p));
                const allSame = values.every((v) => v === values[0]);
                return (
                  <tr
                    key={row.label}
                    className={(rowIdx % 2 === 0 ? "bg-ivory/30" : "bg-white") + " hover:bg-ivory/55 transition-colors"}
                  >
                    <td className="px-4 py-3 align-top text-[11.5px] font-bold uppercase tracking-[0.1em] text-slate/70 border-b border-navy/5 sticky left-0 bg-inherit">
                      {row.label}
                    </td>
                    {values.map((v, i) => (
                      <td
                        key={items[i].slug}
                        className={
                          "px-3 py-3 align-top text-[13.5px] leading-snug text-navy border-b border-navy/5 " +
                          (!allSame && v !== "—" ? "font-semibold" : "font-normal")
                        }
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer — count + close. Compare bar shows when the modal is
            dismissed via the X so the visitor can tweak selection. */}
        <div className="px-4 sm:px-6 py-3 border-t border-navy/8 shrink-0 flex items-center justify-between gap-3 bg-ivory/40">
          <div className="meta text-slate">
            Add up to {COMPARE_MAX} properties to compare side by side.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-pill bg-navy text-white text-[12.5px] font-semibold hover:bg-navy-80 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn  { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.22s ease-out; }
        .animate-pop-in  { animation: popIn 0.32s cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
    </div>
  );
}

// ━━━ LOCALITY SWITCHER PILL ━━━
// Looks similar to the navy "1 locality" badge but is interactive.
// Searchable dropdown lists all localities. Selecting one navigates to that
// locality's page via router.push. Same desktop+mobile patterns as the
// generic Pill component (desktop popup, mobile bottom sheet).
function LocalityPill({
  id,
  openPill,
  togglePill,
  currentName,
  currentSlug,
  allLocalities,
  onChange,
}: {
  id: string;
  openPill: string | null;
  togglePill: (id: string) => void;
  currentName: string;
  currentSlug: string;
  allLocalities: LocalityOption[];
  onChange: (slug: string) => void;
}) {
  const isOpen = openPill === id;
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isFinePointer && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allLocalities;
    const q = query.trim().toLowerCase();
    return allLocalities.filter((l) => l.name.toLowerCase().includes(q));
  }, [query, allLocalities]);

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => togglePill(id)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={"inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-pill text-[12px] sm:text-[13px] font-semibold transition-colors whitespace-nowrap " + (isOpen ? "bg-navy text-white shadow-card ring-2 ring-gold/40" : "bg-navy text-white hover:bg-navy-80")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="hidden sm:inline">{currentName}</span>
          <span className="sm:hidden">{currentName.length > 12 ? currentName.slice(0, 11) + "…" : currentName}</span>
          <span className={"text-white/70 transition-transform duration-200 " + (isOpen ? "rotate-180" : "")} aria-hidden>
            &#9662;
          </span>
        </button>

        {/* Desktop dropdown */}
        {isOpen && (
          <div className="hidden sm:flex flex-col absolute top-full left-0 mt-2 z-30 min-w-[260px] bg-white border border-navy/10 rounded-card shadow-card overflow-hidden">
            <div className="relative shrink-0 border-b border-navy/8 px-3 py-2.5 bg-ivory/40">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Switch to another locality..."
                className="w-full pl-7 pr-8 py-1.5 bg-white border border-navy/10 rounded-lg text-[13px] font-sans font-medium text-navy placeholder:text-navy/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-colors"
                aria-label="Search localities"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-navy/10 hover:bg-navy/20 text-navy/70 grid place-items-center transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <ul role="listbox" className="max-h-[220px] overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <li className="px-4 py-5 text-center text-[13px] font-sans font-medium text-slate">
                  <div className="text-navy/50 mb-1">No matches found</div>
                  <div className="text-[11.5px] text-slate/70">Try a different keyword</div>
                </li>
              ) : (
                filtered.map((l) => {
                  const isCurrent = l.slug === currentSlug;
                  return (
                    <li key={l.slug} role="option" aria-selected={isCurrent}>
                      <button
                        type="button"
                        onClick={() => onChange(l.slug)}
                        className={"w-full text-left px-4 py-2.5 text-[14px] font-sans font-semibold transition-colors flex items-center justify-between gap-2 " + (isCurrent ? "bg-gold/10 text-gold-hover" : "text-navy hover:bg-ivory")}
                      >
                        {query.trim() ? <HighlightedText text={l.name} query={query} /> : <span>{l.name}</span>}
                        {isCurrent && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile bottom-sheet */}
      {isOpen && (
        <div className="sm:hidden">
          <div
            onClick={() => togglePill(id)}
            aria-hidden
            className="fixed inset-0 z-[80] bg-navy/40 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-[24px] shadow-[0_-12px_40px_hsl(var(--navy)/0.20)] animate-slide-up max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-navy/8 shrink-0">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-hover mb-0.5">Switch to</div>
                <div className="font-sans font-bold text-[17px] text-navy">Locality</div>
              </div>
              <button
                type="button"
                onClick={() => togglePill(id)}
                aria-label="Close"
                className="w-9 h-9 rounded-full text-navy hover:bg-navy/5 grid place-items-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-5 pt-3 pb-2 shrink-0">
              <div className="relative">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search localities..."
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory/60 border border-navy/10 rounded-lg text-[14px] font-sans font-medium text-navy placeholder:text-navy/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-colors"
                  aria-label="Search localities"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2.5 pt-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-[14px] font-sans font-medium text-slate">
                  <div className="text-navy/50 mb-1">No matches found</div>
                  <div className="text-[12px] text-slate/70">Try a different keyword</div>
                </div>
              ) : (
                filtered.map((l) => {
                  const isCurrent = l.slug === currentSlug;
                  return (
                    <button
                      key={l.slug}
                      type="button"
                      onClick={() => onChange(l.slug)}
                      className={"w-full text-left px-4 py-3 rounded-btn text-[14px] font-medium transition-colors flex items-center justify-between " + (isCurrent ? "bg-gold text-white" : "text-navy hover:bg-ivory")}
                    >
                      {query.trim() ? <HighlightedText text={l.name} query={query} /> : <span>{l.name}</span>}
                      {isCurrent && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
            .animate-fade-in { animation: fadeIn 0.2s ease-out; }
            .animate-slide-up { animation: slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
          `}</style>
        </div>
      )}
    </>
  );
}

function Pill({
  id,
  openPill,
  togglePill,
  label,
  value,
  children,
  wide,
}: {
  id: string;
  openPill: string | null;
  togglePill: (id: string) => void;
  label: string;
  value: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const isOpen = openPill === id;

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => togglePill(id)}
          aria-expanded={isOpen}
          className={"inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-pill border text-[12px] sm:text-[13px] font-medium transition-colors whitespace-nowrap " + (isOpen ? "bg-white border-gold text-navy shadow-card" : "bg-white border-navy/10 text-navy hover:border-gold")}
        >
          <span className="text-slate hidden sm:inline">{label}:</span>
          <span className="text-slate sm:hidden">{label}</span>
          <span className="font-semibold hidden sm:inline">{value}</span>
          <span className={"text-slate transition-transform duration-200 " + (isOpen ? "rotate-180" : "")} aria-hidden>&#9662;</span>
        </button>

        {isOpen && (
          <div className={"hidden sm:block absolute top-full left-0 mt-2 bg-white border border-navy/10 rounded-card shadow-card z-30 " + (wide ? "min-w-[380px] sm:min-w-[420px] p-4" : "min-w-[200px] p-1.5")}>
            {children}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div
            onClick={() => togglePill(id)}
            aria-hidden
            className="fixed inset-0 z-[80] bg-navy/40 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-[24px] shadow-[0_-12px_40px_hsl(var(--navy)/0.20)] animate-slide-up max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-navy/8 shrink-0">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-hover mb-0.5">Filter</div>
                <div className="font-sans font-bold text-[17px] text-navy">{label}</div>
              </div>
              <button
                type="button"
                onClick={() => togglePill(id)}
                aria-label="Close"
                className="w-9 h-9 rounded-full text-navy hover:bg-navy/5 grid place-items-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={"overflow-y-auto " + (wide ? "p-5" : "p-2.5")}>
              {children}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
            .animate-fade-in { animation: fadeIn 0.2s ease-out; }
            .animate-slide-up { animation: slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
          `}</style>
        </div>
      )}
    </>
  );
}

function Opt({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"w-full text-left px-4 py-3 sm:px-3 sm:py-2 rounded-btn text-[14px] sm:text-[13px] font-medium transition-colors " + (active ? "bg-gold text-white" : "text-navy hover:bg-ivory")}
    >
      {children}
    </button>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <span>{text}</span>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <span>
      {before}
      <mark className="bg-gold/25 text-navy font-extrabold rounded px-0.5 not-italic">{match}</mark>
      {after}
    </span>
  );
}

function RangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  format,
  ticks,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
  format: (n: number) => string;
  ticks?: { value: number; label: string; major: boolean }[];
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(+e.target.value, valueMax - step);
    onChange(next, valueMax);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(+e.target.value, valueMin + step);
    onChange(valueMin, next);
  };

  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;
  const pctOf = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="px-1 py-1">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate mb-0.5">Min</div>
          <div className="font-sans font-bold text-[16px] text-navy tnum">{format(valueMin)}</div>
        </div>
        <div className="text-slate/40 mt-3">&mdash;</div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate mb-0.5">Max</div>
          <div className="font-sans font-bold text-[16px] text-navy tnum">{format(valueMax)}</div>
        </div>
      </div>

      <div className="relative mx-3 pb-8">
        <div className="relative h-6 flex items-center">
          <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gold-light pointer-events-none z-[1]" />
          <div
            className="absolute h-1.5 rounded-full bg-gold pointer-events-none z-[2]"
            style={{ left: pctMin + "%", right: (100 - pctMax) + "%" }}
          />
          {ticks && ticks.map((t) => {
            const pct = pctOf(t.value);
            const inRange = t.value >= valueMin && t.value <= valueMax;
            return (
              <span
                key={"tick-" + t.value}
                className={"absolute -translate-x-1/2 w-px rounded-full pointer-events-none z-[3] " + (t.major ? "h-3" : "h-2") + " " + (inRange ? "bg-gold" : "bg-navy/25")}
                style={{ left: pct + "%" }}
                aria-hidden
              />
            );
          })}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={valueMin}
            onChange={handleMinChange}
            className="range-input"
            aria-label="Minimum budget"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={valueMax}
            onChange={handleMaxChange}
            className="range-input"
            aria-label="Maximum budget"
          />
        </div>

        {ticks && (
          <div className="absolute left-0 right-0 top-full mt-2 h-5">
            {ticks.filter((t) => t.major).map((t) => {
              const pct = pctOf(t.value);
              const inRange = t.value >= valueMin && t.value <= valueMax;
              return (
                <span
                  key={"lbl-" + t.value}
                  className={"absolute -translate-x-1/2 text-[10px] font-semibold tnum whitespace-nowrap pointer-events-none " + (inRange ? "text-navy" : "text-slate/50")}
                  style={{ left: pct + "%" }}
                >
                  {t.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .range-input {
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          width: 100%;
          background: transparent;
          pointer-events: none;
          outline: none;
          margin: 0;
          height: 24px;
          z-index: 20;
        }
        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--gold));
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          pointer-events: auto;
          margin-top: 0;
          position: relative;
          z-index: 30;
          touch-action: pan-y;
        }
        .range-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--gold));
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          pointer-events: auto;
          z-index: 30;
        }
        .range-input::-webkit-slider-runnable-track {
          background: transparent;
          height: 24px;
        }
        .range-input:last-of-type { z-index: 21; }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-base p-8 sm:p-12 text-center">
      <div className="text-[40px] mb-3" aria-hidden>&#128269;</div>
      <div className="h3-card text-navy mb-2">No matches with these filters</div>
      <p className="body-base text-slate max-w-[400px] mx-auto">
        Try widening your budget or BHK range, or clear filters to see all properties in this locality.
      </p>
    </div>
  );
}