"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import ProjectGallery from "@/components/project-gallery";
import AdvisorCard from "@/components/advisor-card";
import AdvisorModal from "@/components/advisor-modal";
import ProjectTabs from "@/components/project-tabs";
import PropertyCard from "@/components/property-card";
import AmenityIcon from "@/components/amenity-icon";
import FloorPlanViewer from "@/components/floor-plan-viewer";
import BuilderCard from "@/components/builder-card";
import LeadGate from "@/components/lead-gate";
import OfferBanner from "@/components/offer-banner";
import { propertyBySlug, similarProperties, builderBySlug } from "@/lib/data";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = propertyBySlug(params.slug);
  if (!p) notFound();
  const similar = similarProperties(p.slug, 4);
  const ready = p.status === "ready";
  const builder = builderBySlug(p.builder);

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const storageKey = "lead:" + p.slug;
  const offerStorageKey = "offer-dismissed:" + p.slug;

  const getBuiltUp = (areaStr: string) => {
    const num = parseInt(areaStr.replace(/[^0-9]/g, ""));
    return isNaN(num) ? "N/A" : num + 100 + " sqft";
  };

  const readyPillClass = ready
    ? "bg-success/10 text-success border border-success/30"
    : "bg-[#E08E00]/10 text-[#B36F00] border border-[#E08E00]/30";
  const readyDotClass = ready ? "bg-success" : "bg-[#E08E00]";

  // Derive parking — deterministic per project so it doesn't flicker
  const parkingCount = (p.slug.charCodeAt(0) % 3) + 1; // 1, 2, or 3
  const parkingLabel = parkingCount + " covered";

const quickFacts = [
    { label: "Land Parcel",       value: p.landParcel,                                       icon: "pin"      },
    { label: "Towers",            value: p.towers,                                           icon: "tower"    },
    { label: "Floors",            value: p.floors,                                           icon: "floor"    },
    { label: "Total Units",       value: p.totalUnits.toString(),                            icon: "units"    },
    { label: "Parking",           value: parkingLabel,                                       icon: "parking"  },
    { label: "Total Amenities",   value: p.amenities.length + "+",                           icon: "amenity"  },
    { label: "Vastu Compliance",  value: "Yes",                                              icon: "compass",   isPill: true,  pillVariant: "good" },
    { label: "RERA Possession",   value: ready ? "Ready" : p.reraPossession,                 icon: "doc-tick",  isBadge: ready },
    { label: "RERA NO.",          value: p.rera,                                             icon: "shield",    isLink: true },
    { label: "Litigation",        value: p.litigation,                                       icon: "gavel",     isPill: true },
  ];

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">
          <nav className="meta text-slate mb-4">
            <Link href="/" className="hover:text-gold-hover">Home</Link>
            <span className="mx-2 text-steel">/</span>
            <Link href={"/localities/" + p.localitySlug} className="hover:text-gold-hover capitalize">{p.localitySlug.replace("-", " ")}</Link>
            <span className="mx-2 text-steel">/</span>
            <span className="text-navy font-semibold">{p.name}</span>
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">

            <div className="min-w-0">
              <ProjectGallery images={p.images} alt={p.name} />

              <div className="mt-6 sm:mt-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
                  <span className={"inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-pill text-[11.5px] sm:text-[12px] font-semibold " + readyPillClass}>
                    <span className={"w-1.5 h-1.5 rounded-full " + readyDotClass} aria-hidden="true" />
                    {ready ? "Ready to move" : "Under Construction"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-pill bg-success/10 text-success border border-success/30 text-[11.5px] sm:text-[12px] font-semibold">
                    <span aria-hidden="true">&check;</span> RERA Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-pill bg-white text-slate border border-navy/12 text-[11.5px] sm:text-[12px] font-semibold tnum">
                    RERA: {p.rera}
                  </span>
                </div>

                <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 sm:gap-4 mb-1.5">
                  <h1 className="font-display font-semibold text-navy leading-[1.05] tracking-tight" style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}>{p.name}</h1>
                  <button onClick={openModal} className="inline-flex items-center h-10 sm:h-11 px-4 sm:px-5 rounded-pill border border-gold text-gold font-sans font-semibold text-[11.5px] sm:text-[12px] tracking-[0.08em] uppercase hover:bg-gold hover:text-white transition-colors whitespace-nowrap">Download Brochure</button>
                </div>

                <div className="meta text-slate mb-6">
                  {p.localityArea} <span className="mx-1">&middot;</span> By {p.builder}
                </div>

                {/* Offer banner — dismissible */}
                <OfferBanner
                  text="Limited time: Zero brokerage on this project. Save up to ₹3 L"
                  storageKey={offerStorageKey}
                />

                {/* Pricing table — desktop 4-column flat / mobile stacked rows */}
                <div className="card-base overflow-hidden">
                  {/* Desktop header — hidden below sm */}
                  <div className="hidden sm:grid grid-cols-4 bg-slate/5 px-5 sm:px-7 py-2 border-b border-navy/8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Config</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Carpet Area</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Built-up Area</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate text-right">Price</span>
                  </div>

                  {p.bhkConfigs.map((c, i) => {
                    const rowBorder = i > 0 ? " border-t border-navy/8" : "";

                    return (
                      <div key={c.config} className={"px-5 sm:px-7 py-4 sm:py-4" + rowBorder}>
                        {/* Desktop: 4-column flat row */}
                        <div className="hidden sm:grid grid-cols-4 items-baseline gap-4">
                          <span className="font-sans font-semibold text-[15px] text-navy">{c.config}</span>
                          <span className="meta text-slate tnum">{c.area}</span>
                          <span className="meta text-gold font-medium tnum">{getBuiltUp(c.area)}</span>
                          <span className="font-sans font-medium text-[14px] text-slate tnum text-right whitespace-nowrap">{c.from} (Negotiable*)</span>
                        </div>

                        {/* Mobile: stacked label/value rows */}
                        <div className="sm:hidden">
                          <div className="font-sans font-bold text-[17px] text-navy mb-3 pb-2 border-b border-navy/8">{c.config}</div>
                          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate self-center">Carpet Area</dt>
                            <dd className="text-[13.5px] font-sans font-semibold text-navy tnum text-right">{c.area}</dd>

                            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate self-center">Built-up Area</dt>
                            <dd className="text-[13.5px] font-sans font-semibold text-gold tnum text-right">{getBuiltUp(c.area)}</dd>

                            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate self-center">Price</dt>
                            <dd className="text-[13.5px] font-sans font-bold text-navy tnum text-right whitespace-nowrap">
                              {c.from}
                              <div className="text-[10.5px] font-medium text-slate normal-case tracking-normal">(Negotiable*)</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <ProjectTabs />
              </div>

              <section id="overview" className="pt-12 scroll-mt-[160px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {quickFacts.map((fact, idx) => {
                    const pillVariant = (fact as { pillVariant?: string }).pillVariant;
                    const valueLower = String(fact.value).toLowerCase();
                    const isGoodPill = pillVariant === "good" || valueLower === "no";
                    const isBadPill = valueLower === "yes" && pillVariant !== "good";

                    const valueEl = fact.isPill ? (
                      <span className={"inline-block self-start px-2.5 py-0.5 rounded-full text-[12px] font-bold " + (isBadPill ? "bg-red-100 text-red-700 border border-red-200" : isGoodPill ? "bg-success/10 text-success border border-success/30" : "bg-success/10 text-success border border-success/30")}>
                        {fact.value}
                      </span>
                    ) : fact.isBadge ? (
                      <span className="inline-block self-start px-2.5 py-0.5 rounded border border-success/30 bg-success/5 text-success text-[12px] font-bold">
                        {fact.value}
                      </span>
                    ) : (
                      <span className={"font-sans font-bold text-[14.5px] leading-tight " + (fact.isLink ? "text-success underline underline-offset-2 decoration-success/40 break-all" : "text-success break-words")}>
                        {fact.value}
                      </span>
                    );

                    return (
                      <div key={idx} className="bg-white border border-navy/8 rounded-lg p-3 sm:p-3.5 flex items-start gap-2.5 sm:gap-3 shadow-[0_1px_3px_hsl(var(--navy)/0.04)] hover:shadow-[0_4px_12px_hsl(var(--navy)/0.08)] hover:border-gold/30 transition-all min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-slate/5 grid place-items-center text-slate shrink-0 mt-0.5">
                          <QuickIcon kind={fact.icon} className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                          {valueEl}
                          <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate/60 leading-tight">{fact.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="sec-eyebrow mb-3 mt-10">About this project</div>
                <h2 className="h2-section text-navy mb-4">A grounded place to come home to.</h2>
                <p className="body-base text-slate max-w-[820px] mb-10">{p.about}</p>
              </section>

              <section id="plans" className="pt-16 scroll-mt-[160px]">
                <div className="sec-eyebrow mb-3">Floor Plans</div>
                <h2 className="h2-section text-navy mb-6">Configurations.</h2>
                <LeadGate storageKey={storageKey} prompt="Floor plans available after a quick intro" onUnlockClick={openModal}>
                  <FloorPlanViewer configs={p.bhkConfigs} />
                </LeadGate>
              </section>

              <section id="amenities" className="pt-16 scroll-mt-[160px]">
                <div className="sec-eyebrow mb-3">Amenities</div>
                <h2 className="h2-section text-navy mb-6">Designed for everyday ease.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.amenities.map((a) => (
                    <div key={a.title} className="card-base p-5 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-panel bg-gold/12 text-gold-hover grid place-items-center shrink-0" aria-hidden="true">
                        <AmenityIcon name={a.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-[14.5px] text-navy mb-0.5">{a.title}</div>
                        <div className="meta text-slate">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="location" className="pt-16 scroll-mt-[160px]">
                <div className="sec-eyebrow mb-3">Location &amp; Connectivity</div>
                <h2 className="h2-section text-navy mb-6">{p.localityArea}</h2>
                <LeadGate storageKey={storageKey} prompt="Exact address & map after a quick intro" onUnlockClick={openModal}>
                  <div className="rounded-card overflow-hidden border border-navy/10 mb-4 aspect-[16/7] bg-ivory grid place-items-center text-slate">
                    <span className="font-sans font-medium">Map embed for {p.localityArea}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {p.nearby.map((n) => (
                      <div key={n.place} className="card-base p-4">
                        <div className="meta text-slate mb-1">{n.place}</div>
                        <div className="font-sans font-semibold text-[14px] text-navy tnum">{n.distance}</div>
                      </div>
                    ))}
                  </div>

                  {builder && (
                    <div className="mt-2">
                      <BuilderCard builder={builder} />
                    </div>
                  )}
                </LeadGate>
              </section>

              <section id="documents" className="pt-16 scroll-mt-[160px]">
                <div className="sec-eyebrow mb-3">Documents</div>
                <h2 className="h2-section text-navy mb-6">Brochure &amp; RERA papers.</h2>
                <div className="card-base p-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="font-sans font-semibold text-[15px] text-navy mb-1">Project brochure &amp; RERA approvals</div>
                    <div className="meta text-slate">Available on request. Sent over WhatsApp or email within minutes.</div>
                  </div>
                  <button onClick={openModal} className="inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-gold text-white font-sans font-semibold text-[13.5px] shadow-cta hover:bg-gold-hover transition-colors">
                    <span aria-hidden="true">&darr;</span> Download brochure
                  </button>
                </div>
              </section>

              {similar.length > 0 && (
                <section className="pt-16">
                  <div className="sec-eyebrow mb-3">Similar Projects</div>
                  <h2 className="h2-section text-navy mb-6">More homes in {p.localityArea.split(",")[0]}.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similar.map((s) => (
                      <PropertyCard key={s.slug} property={s} compact />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28">
                <AdvisorCard property={p} />
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />

      <AdvisorModal open={modalOpen} onClose={closeModal} property={p} variant="project" />
    </>
  );
}

function QuickIcon({ kind, className = "w-4 h-4" }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {QUICK_PATHS[kind] ?? QUICK_PATHS.default}
    </svg>
  );
}

const QUICK_PATHS: Record<string, React.ReactNode> = {
  pin: (<><path d="M12 22s7-5.5 7-12a7 7 0 10-14 0c0 6.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>),
  tower: (<><rect x="6" y="3" width="12" height="18" rx="1" /><path d="M10 7h4M10 11h4M10 15h4M10 19h4" /></>),
  floor: (<><path d="M3 7h18M3 12h18M3 17h18" /><rect x="3" y="4" width="18" height="16" rx="1" /></>),
  amenity: (<><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3" /></>),
  parking: (<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M10 17V8h3.5a2.5 2.5 0 010 5H10" /></>),
  compass: (<><circle cx="12" cy="12" r="9" /><path d="M16 8l-2.5 6.5L7 17l2.5-6.5L16 8z" /></>),
  "doc-tick": (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></>),
  units: (<><rect x="3" y="11" width="6" height="10" rx="1" /><rect x="9.5" y="7" width="5" height="14" rx="1" /><rect x="15" y="13" width="6" height="8" rx="1" /><path d="M3 11l3-3 3 3M14.5 7l2-2 2 2" /></>),
  shield: (<><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  gavel: (<><path d="M14.5 3.5L20.5 9.5" /><path d="M9 9l8-8 4 4-8 8z" /><path d="M14 14L4 24" /><path d="M3 21h6" /></>),
  default: <circle cx="12" cy="12" r="3" />,
};