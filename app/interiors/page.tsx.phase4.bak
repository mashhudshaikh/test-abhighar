"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import Reveal from "@/components/ui/reveal";
import { interiorCategories, interiorAdvisor, Property } from "@/lib/data";
import LeadGate from "@/components/lead-gate";
import AdvisorCard from "@/components/advisor-card";
import AdvisorModal from "@/components/advisor-modal";

// Pull the interior-side advisor from lib/data.ts instead of hardcoding here.
// Editing `interiorAdvisor` in data.ts is now the single way to change who
// shows up on this page — no need to touch the component.
const INTERIORS_ADVISOR_DATA = {
  advisor: {
    initials: interiorAdvisor.initials,
    name: interiorAdvisor.name,
    role: interiorAdvisor.role,
    rating: interiorAdvisor.rating,
  },
} as unknown as Property;

type Pkg = {
  slug: "essentials" | "premium" | "luxury";
  name: string;
  tagline: string;
  price: string;
  popular?: boolean;
  image: string;
  features: string[];
};

const PACKAGES: Pkg[] = [
  { slug: "essentials", name: "Essentials", tagline: "Perfect for compact homes", price: "₹1,99,000",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
    features: ["Modular Kitchen", "Wardrobes in 1 Bedroom", "Basic False Ceiling", "2D Design & Consultation"] },
  { slug: "premium", name: "Premium", tagline: "Perfect blend of style & comfort", price: "₹3,49,000", popular: true,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    features: ["Modular Kitchen", "Wardrobes in 2 Bedrooms", "False Ceiling with Lights", "3D Design & Consultation", "Premium Materials"] },
  { slug: "luxury", name: "Luxury", tagline: "For a luxurious living experience", price: "₹5,99,000",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
    features: ["Modular Kitchen (Premium)", "Wardrobes in All Bedrooms", "Designer False Ceiling", "3D Design & Consultation", "Premium Materials & Decor"] },
];

const PORTFOLIO = [
  { id: 1, category: "living-room", title: "Modern Living Room",  location: "3 BHK Apartment · Pune",      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80" },
  { id: 2, category: "kitchen",     title: "Modular Kitchen",     location: "2 BHK Apartment · Mumbai",    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80" },
  { id: 3, category: "bedroom",     title: "Master Bedroom",      location: "4 BHK Apartment · Bangalore", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80" },
  { id: 4, category: "full-home",   title: "Full Home Interior",  location: "3 BHK Apartment · Hyderabad", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80" },
  { id: 5, category: "living-room", title: "Compact Living Room", location: "2 BHK Apartment · Pune",      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80" },
  { id: 6, category: "kitchen",     title: "Open Kitchen",        location: "3 BHK Apartment · Delhi",     image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80" },
  { id: 7, category: "bedroom",     title: "Kids Bedroom",        location: "3 BHK Apartment · Pune",      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=80" },
  { id: 8, category: "full-home",   title: "Penthouse Interior",  location: "4 BHK Penthouse · Mumbai",    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
];

const FILTERS = [
  { slug: "all",         label: "All" },
  { slug: "living-room", label: "Living Room" },
  { slug: "kitchen",     label: "Kitchen" },
  { slug: "bedroom",     label: "Bedroom" },
  { slug: "full-home",   label: "Full Home" },
];

const PROCESS = [
  { step: "01", title: "Free consultation", desc: "Tell us about your space, style, and budget. No commitment, no fee." },
  { step: "02", title: "3D design preview", desc: "Our designers create a 3D walkthrough you can review and refine before a hammer swings." },
  { step: "03", title: "Production & build", desc: "Modular pieces manufactured at our factory, sent to your site with site supervisors." },
  { step: "04", title: "Handover",           desc: "Move-in-ready home with 10-year warranty and a single point of contact for any concern." },
];

const FAQS = [
  { q: "How long does the interior design process take?", a: "Most full home interiors are delivered in 45 days from final design approval. Modular kitchens take 30 days, single-room makeovers 20-35 days." },
  { q: "Is there a charge for the initial consultation?",  a: "No. The first consultation, site visit, and design proposal are all complimentary. You only pay if you choose to move forward with the project." },
  { q: "Do you handle the civil/electrical work too?",     a: "Yes. We coordinate every trade — electrical, plumbing, false ceiling, painting, woodwork — so you only deal with one project manager." },
  { q: "What is included in the 10-year warranty?",         a: "Modular furniture (woodwork, shutters, internal fittings, hardware) carries a 10-year warranty. Wall finishes and accessories carry a 1-year warranty." },
  { q: "Can I see samples and materials before committing?", a: "Yes. After the design preview, you visit our experience centre to feel, touch, and approve every material before production begins." },
];

export default function InteriorsPage() {
  const [selectedPackage, setSelectedPackage] = useState<Pkg["slug"]>("premium");
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px]">
        <Hero openModal={openModal} />

        <div className="container-x">
          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
            <div className="min-w-0">
              <Services />
              <Packages selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} openModal={openModal} />
              <Portfolio openModal={openModal} />
              <Process />
              <FAQ />
            </div>

            <aside className="hidden lg:block pt-12">
              <div className="sticky top-28">
                <AdvisorCard property={INTERIORS_ADVISOR_DATA} variant="interior" />
              </div>
            </aside>
          </div>
        </div>

        <div className="lg:hidden container-x py-8">
          <AdvisorCard property={INTERIORS_ADVISOR_DATA} variant="interior" />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />

      <AdvisorModal open={modalOpen} onClose={closeModal} property={INTERIORS_ADVISOR_DATA} variant="interior" />
    </>
  );
}

function Hero({ openModal }: { openModal: () => void }) {
  return (
    <section className="container-x pt-4 sm:pt-6 pb-8 sm:pb-12 lg:pb-16">
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
        <Reveal>
          <h1 className="font-display font-semibold text-navy leading-[1.05] tracking-tight mb-3" style={{ fontSize: "clamp(28px, 5vw, 56px)", letterSpacing: "-0.02em" }}>
            Design your dream home
            <br />
            <em className="text-gold italic font-medium">inside out.</em>
          </h1>
          <p className="body-base text-slate max-w-[480px] mb-5 sm:mb-8">
            End-to-end interior design solutions tailored to your style, space, and budget &mdash; built by senior designers, delivered in 45 days.
          </p>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-5 sm:mb-8 max-w-[520px]">
            {[
              { icon: "pencil", label: "Personalised", sub: "Designs" },
              { icon: "clock",  label: "Timely",       sub: "Delivery" },
              { icon: "rupee",  label: "Transparent",  sub: "Pricing" },
              { icon: "shield", label: "10 Years",     sub: "Warranty" },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-1 sm:mb-2 rounded-full bg-ivory border border-navy/8 grid place-items-center text-gold-hover">
                  <Icon kind={b.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-[10.5px] sm:text-[12.5px] font-sans font-semibold text-navy leading-tight">{b.label}</div>
                <div className="meta text-slate text-[10px] sm:text-[11px] leading-tight">{b.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button type="button" onClick={openModal} className="btn-primary inline-flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6 text-[12.5px] sm:text-sm">
              Book Free Consultation <span aria-hidden>&rarr;</span>
            </button>
            <Link href="#portfolio" className="inline-flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6 rounded-btn border border-navy/15 text-navy font-sans font-semibold text-[12.5px] sm:text-sm hover:border-gold hover:text-gold-hover transition-colors">
              View Our Work <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-card overflow-hidden aspect-[5/4] bg-ivory">
            <Image src="/interiors/hero.jpg" alt="Designed interior" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto card-base px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold border-2 border-white grid place-items-center text-white text-[9px] sm:text-[11px] font-bold">
                    {String.fromCharCode(64 + n)}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-sans font-bold text-[13px] sm:text-[16px] text-navy leading-none">3000+</div>
                <div className="meta text-slate text-[10px] sm:text-[11px]">Homes Designed</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  const all = [
    { slug: "modular-kitchen", name: "Modular Kitchen", icon: "kitchen" },
    { slug: "living-room",     name: "Living Room",     icon: "sofa" },
    ...interiorCategories.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon })),
    { slug: "full-home", name: "Full Home Interiors", icon: "home" },
  ];

  return (
    <section className="rounded-card bg-ivory/60 py-6 sm:py-10 lg:py-14 px-3 sm:px-5 lg:px-8 mb-6 sm:mb-10 lg:mb-14">
      <Reveal>
        <h2 className="h2-section text-navy text-center mb-2">Our Interior Services</h2>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-6 sm:mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {all.slice(0, 8).map((s) => (
            <Link key={s.slug} href={"#" + s.slug} id={s.slug} className="card-base bg-white px-2 sm:px-3 py-3 sm:py-6 flex flex-col items-center gap-1.5 sm:gap-3 hover:border-gold hover:-translate-y-1 hover:shadow-lg transition-all border border-transparent group">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-panel bg-ivory text-gold-hover group-hover:bg-gold group-hover:text-white grid place-items-center transition-colors">
                <Icon kind={s.icon} className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="text-[11px] sm:text-[13px] font-sans font-semibold text-navy text-center leading-tight">{s.name}</div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Packages({
  selectedPackage,
  setSelectedPackage,
  openModal,
}: {
  selectedPackage: Pkg["slug"];
  setSelectedPackage: (slug: Pkg["slug"]) => void;
  openModal: () => void;
}) {
  const [propertyType, setPropertyType] = useState("2 BHK");
  const [carpetArea, setCarpetArea] = useState("800 - 1000");
  const [style, setStyle] = useState("Modern");

  const estimate = useMemo(() => {
    const base: Record<string, number> = { "1 BHK": 250000, "2 BHK": 350000, "3 BHK": 500000, "4 BHK": 700000 };
    const areaMult: Record<string, number> = { "400 - 600": 0.85, "600 - 800": 0.95, "800 - 1000": 1, "1000 - 1500": 1.2, "1500+": 1.5 };
    const styleMult: Record<string, number> = { Modern: 1, Contemporary: 1.1, Luxury: 1.4 };
    const low = (base[propertyType] || 350000) * (areaMult[carpetArea] || 1) * (styleMult[style] || 1);
    const high = low * 1.2;
    return { low: Math.round(low / 1000) * 1000, high: Math.round(high / 1000) * 1000 };
  }, [propertyType, carpetArea, style]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <section id="packages" className="py-6 sm:py-10 lg:py-14">
      <Reveal>
        <h2 className="h2-section text-navy text-center mb-2">Interior Design Packages</h2>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-3" />
        <p className="meta text-slate text-center mb-5 sm:mb-10 px-4">Tap a package to compare. The most popular pick is highlighted.</p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8">
        {PACKAGES.map((pkg, i) => {
          const isSelected = selectedPackage === pkg.slug;
          const cardCls = [
            "relative overflow-hidden flex flex-row sm:flex-col scroll-mt-[120px]",
            "card-base cursor-pointer text-left w-full",
            "transition-all duration-300",
            "hover:-translate-y-1.5 hover:shadow-hover",
            // Fixed equal height on mobile so cards visually match
            "h-[148px] sm:h-auto",
            isSelected ? "ring-2 ring-gold shadow-hover" : "ring-1 ring-transparent hover:ring-gold/30",
            pkg.popular ? "sm:col-span-2 lg:col-span-1" : "",
          ].join(" ");

          return (
            <Reveal key={pkg.slug} delay={i * 0.08} className={pkg.popular ? "sm:col-span-2 lg:col-span-1" : ""}>
              <button type="button" id={pkg.slug} onClick={() => setSelectedPackage(pkg.slug)} aria-pressed={isSelected} className={cardCls}>
                {/* Selected checkmark — top-left of image area */}
                {isSelected && (
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gold text-white grid place-items-center shadow-cta">
                    <Icon kind="check" className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                )}

                {/* Image — left thumb on mobile, top banner on desktop */}
                <div className="relative w-[40%] sm:w-full shrink-0 h-full sm:h-auto sm:aspect-[16/10] bg-ivory overflow-hidden">
                  <Image src={pkg.image} alt={pkg.name} fill sizes="(max-width: 640px) 40vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-[700ms] group-hover:scale-105" />
                </div>

                <div className="flex-1 min-w-0 p-3 sm:p-5 flex flex-col">
                  {/* Title row — title left, badge right (mobile: badge stacks under title to avoid collision) */}
                  <div className="flex items-start justify-between gap-2 mb-0.5 sm:mb-1">
                    <div className="font-sans font-semibold text-[15px] sm:text-[20px] text-navy leading-tight">{pkg.name}</div>
                    {pkg.popular && (
                      <span className="shrink-0 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-pill bg-success text-white text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap mt-0.5">
                        <span className="sm:hidden">Popular</span>
                        <span className="hidden sm:inline">Most Popular</span>
                      </span>
                    )}
                  </div>

                  <div className="meta text-slate text-[11.5px] sm:text-[12px] mb-1.5 sm:mb-4 truncate sm:whitespace-normal">{pkg.tagline}</div>

                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-4">
                    <span className="font-sans font-bold text-[16px] sm:text-[22px] text-navy tnum">{pkg.price}</span>
                    <span className="meta text-slate text-[10.5px] sm:text-[12px]">Onwards</span>
                  </div>

                  {/* Desktop: full feature list */}
                  <ul className="hidden sm:block space-y-2 mb-5 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="meta text-slate flex items-start gap-2">
                        <Icon kind="check" className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile: compact inclusion count */}
                  <div className="sm:hidden meta text-slate text-[11px] mb-2 inline-flex items-center gap-1">
                    <Icon kind="check" className="w-2.5 h-2.5 text-success shrink-0" />
                    {pkg.features.length} inclusions
                  </div>

                  <div role="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); openModal(); }} className={"h-8 sm:h-11 rounded-btn font-sans font-semibold text-[11.5px] sm:text-sm grid place-items-center transition-colors mt-auto " + (isSelected ? "bg-gold text-white hover:bg-gold-hover" : "border border-navy/15 text-navy hover:border-gold hover:text-gold-hover hover:bg-gold/5")}>
                    {isSelected ? "Get this →" : "Select & View"}
                  </div>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.16}>
        <LeadGate storageKey="lead:interiors" prompt="Cost estimate after a quick intro" onUnlockClick={openModal}>
          <aside className="card-base p-3.5 sm:p-5 lg:p-6">
            <h3 className="font-sans font-semibold text-[15px] sm:text-[18px] text-navy text-center mb-3.5 sm:mb-5">
              Cost Calculator <span className="text-slate font-medium block sm:inline">&middot; {PACKAGES.find((p) => p.slug === selectedPackage)?.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-3.5 sm:mb-5">
              <Field label="Property Type">
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="calc-input">
                  {["1 BHK", "2 BHK", "3 BHK", "4 BHK"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Carpet Area (sq.ft.)">
                <select value={carpetArea} onChange={(e) => setCarpetArea(e.target.value)} className="calc-input">
                  {["400 - 600", "600 - 800", "800 - 1000", "1000 - 1500", "1500+"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Style">
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="calc-input">
                  {["Modern", "Contemporary", "Luxury"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-panel bg-ivory p-3 sm:p-4">
              <div className="min-w-0">
                <div className="meta text-slate mb-0.5">Estimated Cost</div>
                <div className="font-sans font-bold text-[15px] sm:text-[20px] text-success tnum">
                  {fmt(estimate.low)} <span className="text-slate font-medium">&ndash;</span> {fmt(estimate.high)}
                </div>
                <div className="meta text-slate mt-0.5 text-[10.5px] sm:text-[11px]">*Approximate &mdash; final quote on consultation</div>
              </div>

              <button type="button" onClick={openModal} className="h-10 sm:h-11 px-4 sm:px-5 rounded-btn bg-gold text-white font-sans font-semibold text-[12.5px] sm:text-sm hover:bg-gold-hover transition-colors whitespace-nowrap shadow-cta shrink-0 w-full sm:w-auto">
                Get Free Quote
              </button>
            </div>

            <style jsx>{`
              .calc-input {
                width: 100%;
                background: white;
                border: 1px solid hsl(var(--navy) / 0.12);
                border-radius: 8px;
                padding: 10px 14px;
                font-family: var(--font-inter), system-ui, sans-serif;
                font-size: 13.5px;
                font-weight: 500;
                color: hsl(var(--navy));
                outline: none;
                cursor: pointer;
                transition: border-color .25s;
              }
              .calc-input:focus { border-color: hsl(var(--gold)); }
            `}</style>
          </aside>
        </LeadGate>
      </Reveal>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11.5px] sm:text-[12.5px] font-sans font-semibold text-navy mb-1 sm:mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Portfolio({ openModal }: { openModal: () => void }) {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="rounded-card bg-ivory/60 py-6 sm:py-10 lg:py-14 px-3 sm:px-5 lg:px-8 mb-6 sm:mb-10 lg:mb-14">
      <Reveal>
        <h2 className="h2-section text-navy text-center mb-2">See Our Work</h2>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-5 sm:mb-8" />
      </Reveal>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap sm:flex-wrap sm:justify-center mb-5 sm:mb-8 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar">
        {FILTERS.map((f) => {
          const active = filter === f.slug;
          const cls = "shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-pill text-[11.5px] sm:text-[13px] font-sans font-semibold transition-all whitespace-nowrap " + (active ? "bg-success text-white shadow-cta scale-105" : "bg-white border border-navy/10 text-slate hover:text-navy hover:border-gold hover:-translate-y-0.5");
          return (
            <button key={f.slug} type="button" onClick={() => setFilter(f.slug)} className={cls}>{f.label}</button>
          );
        })}
      </div>

      <LeadGate storageKey="lead:interiors" prompt="Full portfolio after a quick intro" onUnlockClick={openModal}>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {visible.map((p) => (
            <Reveal key={p.id} className="h-full">
              <article className="card-base bg-white overflow-hidden group h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover">
                <div className="relative aspect-[4/3] bg-ivory overflow-hidden">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.08]" />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-pill bg-white/95 backdrop-blur-sm text-[9.5px] sm:text-[11px] font-sans font-semibold text-navy capitalize">
                    {p.category.replace("-", " ")}
                  </span>
                </div>
                <div className="p-2.5 sm:p-4">
                  <div className="font-sans font-semibold text-[12.5px] sm:text-[15px] text-navy mb-0.5 transition-colors group-hover:text-gold-hover leading-tight">{p.title}</div>
                  <div className="meta text-slate text-[10.5px] sm:text-[11px] leading-tight">{p.location}</div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </LeadGate>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

function Process() {
  return (
    <section className="py-6 sm:py-10 lg:py-14">
      <Reveal>
        <h2 className="h2-section text-navy text-center mb-2">How it works</h2>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-6 sm:mb-10" />
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        {PROCESS.map((s, i) => (
          <Reveal key={s.step} delay={i * 0.08} className="h-full">
            <div className="card-base p-4 sm:p-6 h-full flex flex-row sm:flex-col items-start gap-3 sm:gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover hover:border-gold/30 group">
              <div className="font-display font-semibold text-[28px] sm:text-[40px] text-gold leading-none mb-0 sm:mb-3 tnum transition-transform group-hover:scale-110 origin-left shrink-0">{s.step}</div>
              <div className="flex-1 min-w-0">
                <div className="font-sans font-semibold text-[14px] sm:text-[17px] text-navy mb-1 sm:mb-2 leading-tight">{s.title}</div>
                <p className="meta text-slate text-[12px] sm:text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="rounded-card bg-ivory/60 py-6 sm:py-10 lg:py-14 px-3 sm:px-5 lg:px-8">
      <Reveal>
        <h2 className="h2-section text-navy text-center mb-2">Common questions</h2>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-6 sm:mb-10" />
      </Reveal>
      <div className="space-y-2 sm:space-y-3 max-w-[760px] mx-auto">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i}>
              <details open={isOpen} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open ? i : null)} className="card-base bg-white px-3.5 sm:px-5 py-3 sm:py-4 group transition-all hover:border-gold/30">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-2.5 sm:gap-4">
                  <span className="font-sans font-semibold text-[13px] sm:text-[15.5px] text-navy leading-snug">{f.q}</span>
                  <span className={"w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-ivory grid place-items-center text-navy transition-all duration-300 shrink-0 " + (isOpen ? "rotate-45 bg-gold text-white" : "group-hover:bg-gold/15")}>
                    <Icon kind="plus" className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                </summary>
                <p className="body-base text-slate mt-2.5 sm:mt-3 text-[12.5px] sm:text-[14px] leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Icon({ kind, className = "w-4 h-4" }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[kind] ?? PATHS.default}
    </svg>
  );
}

const PATHS: Record<string, React.ReactNode> = {
  kitchen: (<><path d="M3 9h18M3 9v12h18V9M3 9V5h18v4" /><path d="M7 14v3M11 14v3M15 14v3M19 14v3" /></>),
  sofa: (<><path d="M3 14v-3a2 2 0 012-2h14a2 2 0 012 2v3" /><path d="M2 14h20v5H2zM5 19v2M19 19v2" /></>),
  home: (<><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2z" /></>),
  bed: (<><path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6" /><path d="M3 18h18M7 10V8a2 2 0 012-2h6a2 2 0 012 2v2" /></>),
  wardrobe: (<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M12 3v18M9 10v3M15 10v3" /></>),
  ceiling: (<><path d="M3 8h18M5 8v3M9 8v3M13 8v3M17 8v3M21 8v3" /><path d="M3 14h18M5 20h14" /></>),
  bath: (<><path d="M5 12V6a2 2 0 014 0v1" /><path d="M3 12h18l-1 7a2 2 0 01-2 2H6a2 2 0 01-2-2L3 12z" /></>),
  door: (<><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="14" cy="12" r="0.8" fill="currentColor" /></>),
  desk: (<><path d="M3 14h18M5 14v6M19 14v6" /><path d="M5 14V8h14v6M9 8V5h6v3" /></>),
  pencil: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4z" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  rupee: (<><path d="M7 5h10M7 9h10" /><path d="M7 5c0 5-3 6-3 6h2c5 0 6 4 6 9" /></>),
  shield: (<><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  check: (<><path d="M5 12l5 5L20 7" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>),
  default: (<circle cx="12" cy="12" r="3" />),
};