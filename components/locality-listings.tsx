"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Property } from "@/lib/data";
import PropertyCard from "./property-card";

type BHK = "all" | 1 | 2 | 3 | 4 | 5;
type StatusF = "all" | "ready" | "under-construction";
type Possession = "all" | "ready-2025" | "2026-2027" | "2028+";
type Sort = "newest" | "price-low" | "price-high";

const BUDGETS = [
  { label: "Any budget", min: 0,   max: Infinity },
  { label: "Under ₹50 L", min: 0,   max: 50  },
  { label: "₹50 L – ₹1 Cr", min: 50,  max: 100 },
  { label: "₹1 – 2 Cr",  min: 100, max: 200 },
  { label: "₹2 – 5 Cr",  min: 200, max: 500 },
  { label: "₹5 Cr+",     min: 500, max: Infinity },
];

export default function LocalityListings({
  localityName,
  properties,
}: {
  localityName: string;
  properties: Property[];
}) {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [bhk, setBhk] = useState<BHK>("all");
  const [budget, setBudget] = useState(0);
  const [status, setStatus] = useState<StatusF>("all");
  const [possession, setPossession] = useState<Possession>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    let list = [...properties];

    if (bhk !== "all") list = list.filter((p) => p.bhkOptions.includes(bhk));
    if (status !== "all") list = list.filter((p) => p.status === status);

    const b = BUDGETS[budget];
    list = list.filter((p) => p.priceMin <= b.max && p.priceMax >= b.min);

    if (possession === "ready-2025") list = list.filter((p) => p.possessionYear <= 2025);
    if (possession === "2026-2027") list = list.filter((p) => p.possessionYear >= 2026 && p.possessionYear <= 2027);
    if (possession === "2028+")     list = list.filter((p) => p.possessionYear >= 2028);

    if (sort === "price-low")  list.sort((a, b) => a.priceMin - b.priceMin);
    if (sort === "price-high") list.sort((a, b) => b.priceMax - a.priceMax);
    return list;
  }, [properties, bhk, budget, status, possession, sort]);

  return (
    <div className="container-x py-8 lg:py-10">
      {/* Top strip — count + grid/map toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="meta text-slate">
          <strong className="text-navy font-semibold">{filtered.length}</strong> propert
          {filtered.length === 1 ? "y" : "ies"} in {localityName}
        </div>
        <div className="inline-flex p-1 rounded-pill bg-white border border-navy/10 shadow-card">
          {(["grid", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-pill text-[13px] font-semibold transition-colors ${
                view === v ? "bg-gold text-white shadow-cta" : "text-slate hover:text-navy"
              }`}
            >
              {v === "grid" ? "Grid" : "Map view"}
            </button>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-navy text-white text-[13px] font-semibold">
            1 locality
          </span>

          <Pill label="BHK" value={bhk === "all" ? "Any" : `${bhk} BHK`}>
            {(["all", 1, 2, 3, 4, 5] as const).map((v) => (
              <Opt key={v.toString()} active={bhk === v} onClick={() => setBhk(v)}>
                {v === "all" ? "Any" : `${v} BHK`}
              </Opt>
            ))}
          </Pill>

          <Pill label="Budget" value={BUDGETS[budget].label}>
            {BUDGETS.map((b, i) => (
              <Opt key={b.label} active={budget === i} onClick={() => setBudget(i)}>
                {b.label}
              </Opt>
            ))}
          </Pill>

          <Pill label="Status" value={status === "all" ? "Any" : status === "ready" ? "Ready to move" : "Under Construction"}>
            <Opt active={status === "all"}             onClick={() => setStatus("all")}>Any</Opt>
            <Opt active={status === "ready"}           onClick={() => setStatus("ready")}>Ready to move</Opt>
            <Opt active={status === "under-construction"} onClick={() => setStatus("under-construction")}>Under Construction</Opt>
          </Pill>

          <Pill label="Possession" value={
            possession === "all" ? "Any" :
            possession === "ready-2025" ? "By 2025" :
            possession === "2026-2027" ? "2026–2027" : "2028 or later"
          }>
            <Opt active={possession === "all"}       onClick={() => setPossession("all")}>Any</Opt>
            <Opt active={possession === "ready-2025"} onClick={() => setPossession("ready-2025")}>By 2025</Opt>
            <Opt active={possession === "2026-2027"}  onClick={() => setPossession("2026-2027")}>2026 – 2027</Opt>
            <Opt active={possession === "2028+"}      onClick={() => setPossession("2028+")}>2028 or later</Opt>
          </Pill>
        </div>

        <div className="flex items-center gap-2">
          <span className="meta text-slate">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-white border border-navy/10 rounded-pill px-4 py-2 text-[13px] font-semibold text-navy outline-none focus:border-gold"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price · Low to High</option>
            <option value="price-high">Price · High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((p) => <PropertyCard key={p.slug} property={p} />)}
          </div>
        )
      ) : (
        <div className="rounded-card bg-white border border-navy/10 h-[480px] grid place-items-center text-slate">
          Map view coming soon. <Link href="#" className="text-gold ml-2 underline">Notify me</Link>
        </div>
      )}

      <div className="text-center mt-10">
        <button className="px-7 h-12 rounded-pill bg-white border border-navy/15 text-navy font-semibold text-[14px] hover:border-gold hover:text-gold-hover transition-colors">
          Load more properties
        </button>
      </div>
    </div>
  );
}

function Pill({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <details className="relative group">
      <summary className="list-none cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-white border border-navy/10 text-[13px] font-medium text-navy hover:border-gold transition-colors">
        <span className="text-slate">{label}:</span>
        <span className="font-semibold">{value}</span>
        <span className="text-slate" aria-hidden>▾</span>
      </summary>
      <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-navy/10 rounded-card shadow-card p-1.5 z-20">
        {children}
      </div>
    </details>
  );
}

function Opt({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-btn text-[13px] font-medium transition-colors ${
        active ? "bg-gold text-white" : "text-navy hover:bg-ivory"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="card-base p-12 text-center">
      <div className="text-[40px] mb-3" aria-hidden>🔍</div>
      <div className="h3-card text-navy mb-2">No matches with these filters</div>
      <p className="body-base text-slate max-w-[400px] mx-auto">
        Try widening your budget or BHK range, or clear filters to see all properties in this locality.
      </p>
    </div>
  );
}