"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Property } from "@/lib/data";
import PropertyCard from "./property-card";

// — Property type config (mirrors hero) —
type PropertyTypeKey = "Apartment" | "Villa" | "Duplex" | "Plot" | "Studio" | "Commercial";

const PROPERTY_TYPE_OPTIONS: PropertyTypeKey[] = ["Apartment", "Villa", "Duplex", "Plot", "Studio", "Commercial"];

const PROPERTY_TYPE_CONFIG: Record<PropertyTypeKey, { label: string; options: string[] }> = {
  Apartment:  { label: "BHK",        options: ["Any", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Villa:      { label: "BHK",        options: ["Any", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Duplex:     { label: "BHK",        options: ["Any", "3 BHK", "4 BHK", "5 BHK", "6+ BHK"] },
  Plot:       { label: "Listing",    options: ["Any", "Buy", "Lease"] },
  Studio:     { label: "Config",     options: ["Any", "1 RK"] },
  Commercial: { label: "Space Type", options: ["Any", "Showroom", "Shop", "Office Space", "Lease"] },
};

type Possession = "all" | "new-launch" | "under-construction" | "nearing" | "ready";
type Sort = "newest" | "price-low" | "price-high";

const PRICE_MIN_BOUND = 0;
const PRICE_MAX_BOUND = 1000;
const PRICE_STEP = 10;

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

export default function LocalityListings({
  localityName,
  properties,
}: {
  localityName: string;
  properties: Property[];
}) {
  const [propertyType, setPropertyType] = useState<PropertyTypeKey>("Apartment");
  const [typeSubChoice, setTypeSubChoice] = useState<string>("Any");
  const [priceMin, setPriceMin] = useState(PRICE_MIN_BOUND);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_BOUND);
  const [possession, setPossession] = useState<Possession>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const [openPill, setOpenPill] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

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

  const currentTypeConfig = PROPERTY_TYPE_CONFIG[propertyType];

  const filtered = useMemo(() => {
    let list = [...properties];

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
  }, [properties, currentTypeConfig.label, typeSubChoice, priceMin, priceMax, possession, sort]);

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
            <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-pill bg-navy text-white text-[12px] sm:text-[13px] font-semibold shrink-0">
              1 locality
            </span>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filtered.map((p) => <PropertyCard key={p.slug} property={p} />)}
        </div>
      )}

      <div className="text-center mt-8 sm:mt-10">
        <button className="px-6 sm:px-7 h-11 sm:h-12 rounded-pill bg-white border border-navy/15 text-navy font-semibold text-[13.5px] sm:text-[14px] hover:border-gold hover:text-gold-hover transition-colors">
          Load more properties
        </button>
      </div>

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