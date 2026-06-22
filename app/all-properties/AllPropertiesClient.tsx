"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Reveal from "@/components/ui/reveal";
import { getPropertyType, type Property, type PropertyType } from "@/lib/data";
import type { CustomerLocality } from "@/lib/localities-data";

// Filter & sort key types
type StatusFilter = "" | "ready" | "new-launch" | "under-construction";
type TypeFilter   = "" | PropertyType;
type BhkFilter    = "" | "1" | "2" | "3" | "4" | "5+";
type SortKey      = "" | "newest" | "price-low" | "price-high";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "",                   label: "All" },
  { value: "ready",              label: "Ready to Move" },
  { value: "new-launch",         label: "New Launches" },
  { value: "under-construction", label: "Under Construction" },
];

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "",           label: "All types" },
  { value: "apartment",  label: "Apartment" },
  { value: "villa",      label: "Villa" },
  { value: "duplex",     label: "Duplex" },
  { value: "studio",     label: "Studio Apartment" },
  { value: "plot",       label: "Plot" },
  { value: "commercial", label: "Commercial" },
];

const BHK_OPTIONS: { value: BhkFilter; label: string }[] = [
  { value: "",   label: "Any BHK" },
  { value: "1",  label: "1 BHK" },
  { value: "2",  label: "2 BHK" },
  { value: "3",  label: "3 BHK" },
  { value: "4",  label: "4 BHK" },
  { value: "5+", label: "5+ BHK" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "",           label: "Default order" },
  { value: "newest",     label: "Newest first" },
  { value: "price-low",  label: "Price: low → high" },
  { value: "price-high", label: "Price: high → low" },
];

interface ContentProps {
  properties: Property[];
  localities: CustomerLocality[];
}

function AllPropertiesContent({ properties, localities }: ContentProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Newest possession year — computed inside since `properties` is now a
  // prop, not a module-level constant.
  const newestPossessionYear = useMemo(
    () => properties.length > 0
      ? Math.max(...properties.map((p) => p.possessionYear))
      : new Date().getFullYear() + 1,
    [properties]
  );

  const statusMatches = (prop: Property, filter: StatusFilter): boolean => {
    switch (filter) {
      case "":                    return true;
      case "ready":               return prop.status === "ready";
      case "under-construction":  return prop.status === "under-construction";
      case "new-launch":          return prop.possessionYear === newestPossessionYear;
      default:                    return true;
    }
  };

  const typeMatches = (prop: Property, filter: TypeFilter): boolean => {
    if (!filter) return true;
    return getPropertyType(prop) === filter;
  };

  const bhkMatches = (prop: Property, filter: BhkFilter): boolean => {
    if (!filter) return true;
    if (filter === "5+") return prop.bhkOptions.some((n) => n >= 5);
    const n = parseInt(filter, 10);
    return prop.bhkOptions.includes(n);
  };

  const badgeFor = (prop: Property): { text: string; variant: "gold" | "navy" | "green" } => {
    if (prop.status === "ready") return { text: "Ready to Move", variant: "green" };
    if (prop.possessionYear === newestPossessionYear) return { text: "New Launch", variant: "gold" };
    return { text: "Under Construction", variant: "navy" };
  };

  const initialStatus   = (params?.get("status")   ?? "") as StatusFilter;
  const initialType     = (params?.get("type")     ?? "") as TypeFilter;
  const initialBhk      = (params?.get("bhk")      ?? "") as BhkFilter;
  const initialLocality = params?.get("locality")  ?? "";
  const initialSort     = (params?.get("sort")     ?? "") as SortKey;

  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>(initialStatus);
  const [typeFilter,     setTypeFilter]     = useState<TypeFilter>(initialType);
  const [bhkFilter,      setBhkFilter]      = useState<BhkFilter>(initialBhk);
  const [localityFilter, setLocalityFilter] = useState(initialLocality);
  const [sortFilter,     setSortFilter]     = useState<SortKey>(initialSort);

  useEffect(() => {
    const qp = new URLSearchParams();
    if (statusFilter)   qp.set("status",   statusFilter);
    if (typeFilter)     qp.set("type",     typeFilter);
    if (bhkFilter)      qp.set("bhk",      bhkFilter);
    if (localityFilter) qp.set("locality", localityFilter);
    if (sortFilter)     qp.set("sort",     sortFilter);
    const qs = qp.toString();
    router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
  }, [statusFilter, typeFilter, bhkFilter, localityFilter, sortFilter, pathname, router]);

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      if (!statusMatches(p, statusFilter)) return false;
      if (!typeMatches(p, typeFilter)) return false;
      if (!bhkMatches(p, bhkFilter)) return false;
      if (localityFilter && p.localitySlug !== localityFilter) return false;
      return true;
    });
    if (sortFilter === "newest")     return [...list].sort((a, b) => b.possessionYear - a.possessionYear);
    if (sortFilter === "price-low")  return [...list].sort((a, b) => a.priceMin - b.priceMin);
    if (sortFilter === "price-high") return [...list].sort((a, b) => b.priceMax - a.priceMax);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, bhkFilter, localityFilter, sortFilter, properties, newestPossessionYear]);

  const totalCount = properties.length;
  const showingCount = filtered.length;
  const activeFilterCount =
    (statusFilter   ? 1 : 0) +
    (typeFilter     ? 1 : 0) +
    (bhkFilter      ? 1 : 0) +
    (localityFilter ? 1 : 0) +
    (sortFilter     ? 1 : 0);

  const clearAll = () => {
    setStatusFilter("");
    setTypeFilter("");
    setBhkFilter("");
    setLocalityFilter("");
    setSortFilter("");
  };

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">

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
              Every project on this page has been visited by a senior advisor &mdash; floor plans walked, builders vetted, RERA filings checked. Filter by status, type, BHK, or locality to narrow down.
            </p>
          </div>

          <div className="mb-8 lg:mb-10 pb-6 border-b border-navy/10">

            <div className="flex flex-wrap gap-2 mb-3">
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

            <div className="flex flex-wrap gap-3 items-center">
              <FilterSelect
                value={typeFilter}
                onChange={(v) => setTypeFilter(v as TypeFilter)}
                options={TYPE_OPTIONS}
                ariaLabel="Filter by property type"
              />
              <FilterSelect
                value={bhkFilter}
                onChange={(v) => setBhkFilter(v as BhkFilter)}
                options={BHK_OPTIONS}
                ariaLabel="Filter by BHK"
              />
              <FilterSelect
                value={localityFilter}
                onChange={setLocalityFilter}
                options={[
                  { value: "", label: "All localities" },
                  ...localities.map((l) => ({ value: l.slug, label: l.name })),
                ]}
                ariaLabel="Filter by locality"
              />
              <FilterSelect
                value={sortFilter}
                onChange={(v) => setSortFilter(v as SortKey)}
                options={SORT_OPTIONS}
                ariaLabel="Sort properties"
              />

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="meta text-slate hover:text-navy underline underline-offset-2 transition-colors"
                >
                  Clear filters ({activeFilterCount})
                </button>
              )}

              <div className="ml-auto meta text-slate self-center tnum">
                Showing {showingCount} of {totalCount} {totalCount === 1 ? "property" : "properties"}
              </div>
            </div>
          </div>

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
                  onClick={clearAll}
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
                const propType = getPropertyType(p);
                const showTypeChip = propType !== "apartment";

                return (
                  <Reveal key={p.slug} delay={i * 0.04}>
                    <article className="card-base relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:shadow-hover group h-full">
                      <Link
                        href={"/projects/" + p.slug}
                        aria-label={`View details for ${p.name}`}
                        className="absolute inset-0 z-[1] rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                      />
                      <div className="relative h-[260px] overflow-hidden p-3.5">
                        <span className={"absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-pill text-[11px] font-bold tracking-wider " + badgeClass}>
                          {badge.text}
                        </span>
                        {showTypeChip && (
                          <span className="absolute top-6 right-6 z-10 px-3.5 py-1.5 rounded-pill text-[11px] font-bold tracking-wider bg-white/95 text-navy backdrop-blur-sm capitalize">
                            {propType}
                          </span>
                        )}
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

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-4 pr-10 py-2 rounded-pill bg-white border border-navy/15 text-[13px] font-sans font-semibold text-navy cursor-pointer hover:border-navy/40 transition-colors min-w-[160px]"
        aria-label={ariaLabel}
      >
        {options.map((o) => (
          <option key={o.value || "_none"} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy/50 text-[10px]"
        aria-hidden
      >
        &#9662;
      </span>
    </div>
  );
}

export default function AllPropertiesClient({ properties, localities }: ContentProps) {
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
      <AllPropertiesContent properties={properties} localities={localities} />
    </Suspense>
  );
}