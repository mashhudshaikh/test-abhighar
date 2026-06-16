"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import SplitText from "./ui/split-text";
import MagneticButton from "./ui/magnetic-button";
import Counter from "./ui/counter";

const SLIDES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80",
];

const SLIDE_DURATION = 6000;

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

// "Studio Apartment" is the display label across the hero search. Other
// surfaces (URL slugs, DB enum values) can keep the shorter "studio"
// internally — that's a separate decision.
type PropertyTypeKey = "Apartment" | "Villa" | "Duplex" | "Plot" | "Studio Apartment" | "Commercial";

const PROPERTY_TYPE_OPTIONS: PropertyTypeKey[] = ["Apartment", "Villa", "Duplex", "Plot", "Studio Apartment", "Commercial"];

const PROPERTY_TYPE_CONFIG: Record<PropertyTypeKey, { label: string; options: string[] }> = {
  Apartment:           { label: "BHK",        options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Villa:               { label: "BHK",        options: ["2 BHK", "3 BHK", "4 BHK", "5+ BHK"] },
  Duplex:              { label: "BHK",        options: ["3 BHK", "4 BHK", "5 BHK", "6+ BHK"] },
  Plot:                { label: "Listing",    options: ["Buy", "Lease"] },
  "Studio Apartment":  { label: "Config",     options: ["1 RK"] },
  Commercial:          { label: "Space Type", options: ["Showroom", "Shop", "Office Space", "Lease"] },
};

const LOCALITY_OPTIONS = [
  "Aundh",
  "Baner",
  "Hinjewadi",
  "Kharadi",
  "Koregaon Park",
  "Wakad",
];

function formatPrice(lakhs: number): string {
  if (lakhs >= PRICE_MAX_BOUND) return "10 Cr+";
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return cr % 1 === 0 ? "₹" + cr + " Cr" : "₹" + cr.toFixed(2).replace(/\.?0+$/, "") + " Cr";
  }
  return "₹" + lakhs + " L";
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollY } = useScroll();

  const [isLite, setIsLite] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsLite(coarse || reduced);
  }, []);

  const [slide, setSlide] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyTypeKey>("Apartment");
  const [locality, setLocality] = useState("Aundh");
  const [priceMin, setPriceMin] = useState(PRICE_MIN_BOUND);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_BOUND);
  const [typeSubChoice, setTypeSubChoice] = useState<string>(PROPERTY_TYPE_CONFIG.Apartment.options[0]);
  const [possession, setPossession] = useState("New Launch");
  const [openField, setOpenField] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-search-field]")) {
        setOpenField(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenField(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handlePropertyTypeChange = (next: string) => {
    const nextKey = next as PropertyTypeKey;
    setPropertyType(nextKey);
    const config = PROPERTY_TYPE_CONFIG[nextKey];
    if (!config) return;
    const preferred = config.options.find((o) => o === "2 BHK") ?? config.options[0];
    setTypeSubChoice(preferred);
  };

  function handleSearch() {
    const slug = locality.toLowerCase().replace(/\s+/g, "").replace("park", "");
    router.push("/localities/" + slug);
  }

  const budgetSummary =
    priceMin === PRICE_MIN_BOUND && priceMax >= PRICE_MAX_BOUND
      ? "Any budget"
      : formatPrice(priceMin) + " – " + formatPrice(priceMax);

  const currentTypeConfig = PROPERTY_TYPE_CONFIG[propertyType];

  const sSpring = { damping: 25, stiffness: 100, mass: 0.5 };
  const photoY = useSpring(useTransform(scrollY, [0, 900], [0, 240]), sSpring);
  const blobsY = useSpring(useTransform(scrollY, [0, 900], [0, 120]), sSpring);
  const textY = useSpring(useTransform(scrollY, [0, 700], [0, -80]), sSpring);
  const textOp = useSpring(useTransform(scrollY, [0, 500], [1, 0.45]), sSpring);
  const photoS = useTransform(scrollY, [0, 1000], [1, 1.18]);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { damping: 35, stiffness: 80 });
  const smy = useSpring(my, { damping: 35, stiffness: 80 });
  const photoMx = useTransform(smx, [-1, 1], [-18, 18]);
  const photoMy = useTransform(smy, [-1, 1], [-18, 18]);
  const blobsMx = useTransform(smx, [-1, 1], [12, -12]);
  const blobsMy = useTransform(smy, [-1, 1], [12, -12]);
  const textMx = useTransform(smx, [-1, 1], [-6, 6]);
  const textMy = useTransform(smy, [-1, 1], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isLite || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function handleMouseLeave() {
    if (isLite) return;
    mx.set(0); my.set(0);
  }

  const photoStyle = isLite ? {} : { y: photoY, x: photoMx, scale: photoS };
  const photoInnerStyle = isLite ? {} : { y: photoMy };
  const blobsStyle = isLite ? {} : { y: blobsY, x: blobsMx };
  const blobsInnerStyle = isLite ? {} : { y: blobsMy };
  const textStyle = isLite ? {} : { y: textY, x: textMx, opacity: textOp };
  const textInnerStyle = isLite ? {} : { y: textMy };

  return (
    <section
      ref={heroRef}
      onMouseMove={isLite ? undefined : handleMouseMove}
      onMouseLeave={isLite ? undefined : handleMouseLeave}
      className="relative isolate min-h-[600px] lg:min-h-[760px] overflow-hidden bg-navy text-white pt-20 sm:pt-24 lg:pt-32 pb-36 sm:pb-40 lg:pb-44"
    >

      <motion.div className="absolute inset-[-10%_-5%] z-0 will-change-transform" style={photoStyle}>
        <motion.div className="relative w-full h-full" style={photoInnerStyle}>
          <AnimatePresence>
            <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: isLite ? 0.6 : 1.5, ease: "easeInOut" }} className="absolute inset-0">
              <Image src={SLIDES[slide]} alt="" fill sizes="100vw" priority className="object-cover brightness-[0.5] saturate-[0.85] contrast-[1.08]" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 0%, hsl(var(--gold) / 0.2), transparent 50%), radial-gradient(ellipse at 20% 100%, hsl(var(--navy-80) / 0.55), transparent 55%), linear-gradient(180deg, hsl(var(--navy) / 0.55) 0%, hsl(var(--navy) / 0.30) 40%, hsl(var(--navy) / 0.85) 100%)" }} />
      </motion.div>

      {!isLite ? (
        <motion.div className="absolute inset-0 z-[1] pointer-events-none" style={blobsStyle}>
          <motion.div style={blobsInnerStyle} className="absolute inset-0">
            <div className="absolute rounded-full blur-[80px] animate-drift-1" style={{ width: 560, height: 560, top: -100, right: -160, background: "radial-gradient(circle, hsl(var(--gold) / 0.45), transparent 70%)" }} />
            <div className="absolute rounded-full blur-[80px] animate-drift-2" style={{ width: 520, height: 520, bottom: -180, left: -180, background: "radial-gradient(circle, hsl(var(--gold) / 0.28), transparent 70%)" }} />
            <div className="absolute rounded-full blur-[80px] animate-drift-3" style={{ width: 420, height: 420, top: "38%", left: "32%", background: "radial-gradient(circle, hsl(var(--brass) / 0.32), transparent 70%)" }} />
            <div className="absolute rounded-full blur-[80px] animate-drift-4" style={{ width: 340, height: 340, top: "18%", right: "18%", background: "radial-gradient(circle, hsl(var(--navy-80) / 0.5), transparent 70%)" }} />
          </motion.div>
        </motion.div>
      ) : (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 320, height: 320, top: -80, right: -100, background: "radial-gradient(circle, hsl(var(--gold) / 0.35), transparent 70%)" }} />
          <div className="absolute rounded-full opacity-25" style={{ width: 280, height: 280, bottom: -80, left: -80, background: "radial-gradient(circle, hsl(var(--gold) / 0.25), transparent 70%)" }} />
        </div>
      )}

      {!isLite && <div className="absolute inset-0 z-[2] grain opacity-40 pointer-events-none" />}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} type="button" onClick={() => setSlide(i)} aria-label={"Slide " + (i + 1)} className={"h-1.5 rounded-full transition-all duration-500 " + (slide === i ? "w-8 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/60")} />
        ))}
      </div>

      <motion.div className="relative z-[3] container-x text-center max-w-[1080px]" style={textStyle}>
        <motion.div style={textInnerStyle}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className={"inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-3xl sm:rounded-pill border border-white/20 mb-6 sm:mb-7 shadow-lg max-w-[95vw] " + (isLite ? "bg-navy/40" : "bg-white/10 backdrop-blur-md")}>
            <span className="inline-flex items-center gap-2">
              <span className="relative w-1.5 h-1.5 rounded-full bg-gold">
                {!isLite && <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-50" />}
              </span>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium text-white whitespace-nowrap">340+ curated homes</span>
            </span>
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-pill bg-gold text-white text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">RERA &middot; Verified</span>
          </motion.div>

          <h1 className="h1-hero mb-6" style={{ textShadow: "0 2px 24px hsl(var(--navy) / 0.5)" }}>
            {isLite ? (
              <>Your Perfect Home in</>
            ) : (
              <SplitText text="Your Perfect Home in" highlight="" delay={0.15} stagger={0.08} />
            )}
            <br />
            <span className="text-gold font-display not-italic">Pune</span> Awaits.
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="body-base text-white/90 max-w-[620px] mx-auto mb-10" style={{ textShadow: "0 1px 12px hsl(var(--navy) / 0.6)" }}>
            From the IT corridors of Hinjewadi to the heritage lanes of Koregaon Park &mdash; we curate residences with the warmth of a friend and the rigour of an advisor.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-[1080px] mx-auto text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-pill bg-gold text-white eyebrow text-[11.5px] shadow-cta whitespace-nowrap tracking-[0.14em]">Find Your Home</div>

            <div
              className="rounded-[28px] sm:rounded-[36px] p-2 shadow-[0_30px_80px_hsl(var(--navy)/0.4)] border border-white/80"
              style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FBF6EE 100%)" }}
            >
              <div className="flex flex-col lg:flex-row items-stretch bg-ivory rounded-[22px] sm:rounded-[28px] overflow-visible">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 lg:items-stretch">
                  <SearchField id="propertyType" label="Property Type" value={propertyType} onChange={handlePropertyTypeChange} options={PROPERTY_TYPE_OPTIONS as unknown as string[]} openField={openField} setOpenField={setOpenField} />

                  <SearchField
                    id="typeSubChoice"
                    label={currentTypeConfig.label}
                    value={typeSubChoice}
                    onChange={setTypeSubChoice}
                    options={currentTypeConfig.options}
                    openField={openField}
                    setOpenField={setOpenField}
                  />

                  <BudgetField
                    id="budget"
                    label="Budget"
                    summary={budgetSummary}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onChange={(lo, hi) => { setPriceMin(lo); setPriceMax(hi); }}
                    openField={openField}
                    setOpenField={setOpenField}
                  />

                  <SearchField
                    id="locality"
                    label="Locality"
                    value={locality}
                    onChange={setLocality}
                    options={LOCALITY_OPTIONS}
                    openField={openField}
                    setOpenField={setOpenField}
                    searchable
                    searchPlaceholder="Search Pune localities..."
                  />

                  

                  <SearchField id="possession" label="Possession" value={possession} onChange={setPossession} options={["New Launch", "Under Construction", "Nearing Possession", "Ready to Move"]} openField={openField} setOpenField={setOpenField} last />
                </div>

                <div className="flex items-center justify-center p-2 lg:p-2">
                  <MagneticButton onClick={handleSearch} className="w-full lg:w-auto h-12 px-8 rounded-[18px] sm:rounded-[22px] text-white font-sans font-bold text-[14.5px] inline-flex items-center justify-center gap-2.5 shadow-cta lg:min-w-[160px] hover:brightness-110 transition-all bg-[linear-gradient(135deg,#C9A961_0%,#8C6A2F_100%)]">
                    Search <span aria-hidden>&rarr;</span>
                  </MagneticButton>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3 px-4 pt-3.5 pb-2 text-[12.5px] sm:text-[13px] font-medium text-navy/80">
                <span className="leading-relaxed">
                  Most searched:&nbsp;
                  <Link href="/localities/baner" className="text-navy font-bold underline underline-offset-2 decoration-gold/60 hover:decoration-gold-hover transition-colors">3BHK in Baner</Link>
                  <span className="mx-2 text-slate/50">&middot;</span>
                  <Link href="/localities/hinjwadi" className="text-navy font-bold underline underline-offset-2 decoration-gold/60 hover:decoration-gold-hover transition-colors">Ready in Hinjewadi</Link>
                </span>
                <Link href="/localities/hinjwadi" className="text-[#6B4F23] font-bold hover:text-navy transition-colors whitespace-nowrap">Browse all 340+ &rarr;</Link>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 mt-9 pt-7 border-t border-white/20">
            {[
              { num: 340, sup: "+", label: "Curated Homes" },
              { num: 28, sup: "", label: "Pune Localities" },
              { num: 200, sup: "+", label: "Happy Families" },
              { num: 6, sup: "+ yrs", label: "Of Trust" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-sans font-semibold text-[26px] sm:text-[32px] tnum leading-none text-white">
                  {isLite ? s.num : <Counter to={s.num} />}
                  <sup className="text-[0.55em] text-gold font-medium ml-0.5">{s.sup}</sup>
                </span>
                <span className="font-sans font-semibold uppercase text-[10px] sm:text-[11px] tracking-[0.14em] text-white/70 text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SearchField({
  id,
  label,
  value,
  onChange,
  options,
  openField,
  setOpenField,
  last,
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  openField: string | null;
  setOpenField: (id: string | null) => void;
  last?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const isOpen = openField === id;

  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    if (!searchable) return;
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isFinePointer && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, searchable]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [searchable, query, options]);

  const listMaxHeight = searchable
    ? "max-h-[180px] sm:max-h-[200px]"
    : "max-h-[220px] sm:max-h-[240px]";

  const dropdownWidth = searchable
    ? "lg:min-w-[260px]"
    : "lg:min-w-[200px]";

  return (
    <div
      data-search-field
      className={
        "group relative lg:flex-1 " +
        (last ? "" : "lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-3 lg:after:bottom-3 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-navy/15 lg:after:to-transparent")
      }
    >
      <button
        type="button"
        onClick={() => setOpenField(isOpen ? null : id)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-3.5 text-left cursor-pointer transition-colors hover:bg-white/60"
      >
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-bold uppercase text-[10px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.16em] text-[#6B4F23] mb-0.5 sm:mb-1 transition-colors group-hover:text-[#8C6A2F]">{label}</span>
          <span className="font-sans font-bold text-[14.5px] sm:text-[15.5px] text-navy leading-tight truncate">{value}</span>
        </div>
        <span className={"text-navy/50 transition-transform duration-200 shrink-0 " + (isOpen ? "rotate-180" : "")} aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={"absolute top-full left-2 right-2 sm:left-0 sm:right-0 mt-1.5 z-50 bg-white border border-navy/10 rounded-2xl shadow-[0_20px_50px_hsl(var(--navy)/0.25)] overflow-hidden flex flex-col " + dropdownWidth}>
          {searchable && (
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
                placeholder={searchPlaceholder}
                className="w-full pl-7 pr-8 py-1.5 bg-white border border-navy/10 rounded-lg text-[13px] font-sans font-medium text-navy placeholder:text-navy/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-colors"
                aria-label={"Search " + label}
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
          )}

          <ul role="listbox" className={"overflow-y-auto py-1.5 " + listMaxHeight}>
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-5 text-center text-[13px] font-sans font-medium text-slate">
                <div className="text-navy/50 mb-1">No matches found</div>
                <div className="text-[11.5px] text-slate/70">Try a different keyword</div>
              </li>
            ) : (
              filteredOptions.map((o) => {
                const selected = o === value;
                return (
                  <li key={o} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => { onChange(o); setOpenField(null); }}
                      className={"w-full text-left px-4 py-2.5 text-[14px] font-sans font-semibold transition-colors flex items-center justify-between gap-2 " + (selected ? "bg-gold/10 text-gold-hover" : "text-navy hover:bg-ivory")}
                    >
                      {searchable && query.trim() ? (
                        <HighlightedText text={o} query={query} />
                      ) : (
                        <span>{o}</span>
                      )}
                      {selected && (
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

function BudgetField({
  id,
  label,
  summary,
  priceMin,
  priceMax,
  onChange,
  openField,
  setOpenField,
}: {
  id: string;
  label: string;
  summary: string;
  priceMin: number;
  priceMax: number;
  onChange: (lo: number, hi: number) => void;
  openField: string | null;
  setOpenField: (id: string | null) => void;
}) {
  const isOpen = openField === id;
  return (
    <div
      data-search-field
      className="group relative lg:flex-1 lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-3 lg:after:bottom-3 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-navy/15 lg:after:to-transparent"
    >
      <button
        type="button"
        onClick={() => setOpenField(isOpen ? null : id)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-3.5 text-left cursor-pointer transition-colors hover:bg-white/60"
      >
        <div className="flex flex-col min-w-0">
          <span className="font-sans font-bold uppercase text-[10px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.16em] text-[#6B4F23] mb-0.5 sm:mb-1 transition-colors group-hover:text-[#8C6A2F]">{label}</span>
          <span className="font-sans font-bold text-[14.5px] sm:text-[15.5px] text-navy leading-tight truncate">{summary}</span>
        </div>
        <span className={"text-navy/50 transition-transform duration-200 shrink-0 " + (isOpen ? "rotate-180" : "")} aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-2 right-2 sm:left-0 sm:right-auto lg:left-1/2 lg:right-auto lg:-translate-x-1/2 mt-1.5 z-50 bg-white border border-navy/10 rounded-2xl shadow-[0_20px_50px_hsl(var(--navy)/0.25)] p-4 sm:p-5 lg:w-[380px] sm:w-[360px]">
          <RangeSlider
            min={PRICE_MIN_BOUND}
            max={PRICE_MAX_BOUND}
            step={PRICE_STEP}
            valueMin={priceMin}
            valueMax={priceMax}
            onChange={onChange}
            format={formatPrice}
            ticks={PRICE_TICKS}
          />
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy/8">
            <button type="button" onClick={() => onChange(PRICE_MIN_BOUND, PRICE_MAX_BOUND)} className="text-[12px] font-semibold text-slate hover:text-navy transition-colors">
              Reset
            </button>
            <button type="button" onClick={() => setOpenField(null)} className="px-4 py-1.5 rounded-pill bg-gold text-white text-[12px] font-semibold hover:bg-gold-hover transition-colors shadow-cta">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
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
                className={"absolute -translate-x-1/2 w-px rounded-full pointer-events-none z-[3] " +
                  (t.major ? "h-3" : "h-2") + " " +
                  (inRange ? "bg-gold" : "bg-navy/25")}
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
            className="range-input-hero"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={valueMax}
            onChange={handleMaxChange}
            className="range-input-hero"
            aria-label="Maximum price"
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
        .range-input-hero {
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
        .range-input-hero::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--gold));
          border: 3px solid white;
          box-shadow: 0 4px 12px hsl(var(--gold) / 0.45);
          cursor: pointer;
          pointer-events: auto;
          margin-top: 0;
          transition: transform 0.1s ease;
          position: relative;
          z-index: 30;
        }
        .range-input-hero::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .range-input-hero::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--gold));
          border: 3px solid white;
          box-shadow: 0 4px 12px hsl(var(--gold) / 0.45);
          cursor: pointer;
          pointer-events: auto;
          z-index: 30;
        }
        .range-input-hero::-webkit-slider-runnable-track {
          background: transparent;
          height: 24px;
        }
        .range-input-hero:last-of-type { z-index: 21; }
      `}</style>
    </div>
  );
}