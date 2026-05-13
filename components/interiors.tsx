import Image from "next/image";
import Link from "next/link";
import { interiors, interiorCategories, interiorTrust } from "@/lib/data";
import Reveal from "./ui/reveal";
import MagneticButton from "./ui/magnetic-button";

type Service = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  from: string;
  image: string;
};

export default function Interiors() {
  const [hero, ...rest] = interiors;

  return (
    <section id="interiors" className="section relative overflow-hidden">
      <div aria-hidden className="absolute top-[15%] right-[-200px] w-[480px] h-[480px] rounded-full blur-[80px] opacity-50 pointer-events-none animate-drift-3" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.35), transparent 70%)" }} />

      <div className="container-x relative z-10">

        {/* Section header */}
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-10 lg:mb-12">
          <Reveal>
            <div className="sec-eyebrow mb-3.5">Interior Design</div>
            <h2 className="h2-section text-navy max-w-[600px]">
              Beautiful interiors, <em className="text-gold italic">thoughtfully done.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-2.5">
                In-house designers shaping your home around your family's daily life — not the other way around.
              </p>
              <Link href="/interiors" className="font-sans font-semibold text-gold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                See our portfolio <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Bento: 1 featured + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 lg:min-h-[520px]">
          <Reveal className="h-full">
            <FeaturedCard service={hero} />
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-rows-2 gap-4 lg:gap-5 h-full">
            {rest.map((s, i) => (
              <Reveal key={s.slug} delay={(i + 1) * 0.08} className="h-full">
                <RegularCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Category pills — "Also covering" */}
        <Reveal>
          <div className="mt-6 lg:mt-7 card-base p-5 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="eyebrow text-slate">Also covering</div>
              <Link href="/interiors" className="meta text-gold font-semibold hover:text-gold-hover">
                Browse all services <span aria-hidden>&rarr;</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {interiorCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={"/interiors#" + c.slug}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-ivory border border-navy/8 hover:border-gold hover:bg-white text-navy text-[13.5px] font-medium transition-all"
                >
                  <Icon kind={c.icon} className="w-4 h-4 text-gold-hover" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Trust + CTA combined dark strip */}
        <Reveal>
          <div className="mt-6 lg:mt-7 rounded-card bg-navy text-white p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-center relative overflow-hidden">
            <div aria-hidden className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full blur-[80px] opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.40), transparent 70%)" }} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5 relative z-10">
              {interiorTrust.map((t) => (
                <div key={t.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-panel bg-gold/15 text-gold grid place-items-center shrink-0">
                    <Icon kind={t.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans font-semibold text-[14.5px] text-white leading-tight">{t.title}</div>
                    <div className="meta text-white/65 mt-0.5">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative z-10 lg:justify-self-end">
              <MagneticButton href="/interiors" className="btn-primary">
                Explore Interior Design
                <span aria-hidden>&rarr;</span>
              </MagneticButton>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* — Featured (large) card — */
function FeaturedCard({ service: s }: { service: Service }) {
  return (
    <Link href={"/interiors#" + s.slug} className="card-base group relative block h-full min-h-[420px] overflow-hidden hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0">
        <Image src={s.image} alt={s.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1000ms] group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/10" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8 text-white">
        <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-pill bg-gold text-white text-[11px] font-bold uppercase tracking-wider mb-3 shadow-cta">
          <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden /> Most Popular
        </span>
        <div className="font-sans font-semibold text-[26px] lg:text-[30px] leading-tight mb-2">{s.title}</div>
        <p className="body-base text-white/85 max-w-[440px] mb-5">{s.description}</p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="eyebrow text-gold mb-1">Starting from</div>
            <div className="price text-white">{s.from}</div>
          </div>
          <span className="meta text-white/75 inline-flex items-center gap-1.5">
            <Icon kind="clock" className="w-4 h-4 text-gold" />
            {s.duration}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* — Regular (smaller) card — */
function RegularCard({ service: s }: { service: Service }) {
  return (
    <Link href={"/interiors#" + s.slug} className="card-base group flex h-full overflow-hidden hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
      <div className="relative w-[42%] shrink-0 bg-navy">
        <Image src={s.image} alt={s.title} fill sizes="(max-width: 1024px) 42vw, 20vw" className="object-cover transition-transform duration-[1000ms] group-hover:scale-[1.04]" />
      </div>
      <div className="flex-1 p-5 lg:p-6 flex flex-col min-w-0">
        <div className="font-sans font-semibold text-[18px] text-navy mb-1.5 leading-tight">{s.title}</div>
        <p className="meta text-slate mb-3 line-clamp-2">{s.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="eyebrow text-slate mb-0.5">From</div>
            <div className="font-sans font-semibold text-[15px] text-navy tnum">{s.from}</div>
          </div>
          <span className="w-9 h-9 rounded-full bg-ivory text-navy grid place-items-center group-hover:bg-gold group-hover:text-white group-hover:-rotate-45 transition-all duration-300 shrink-0">
            <span aria-hidden>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* — Inline icon set — */
function Icon({ kind, className = "w-4 h-4" }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[kind] ?? PATHS.default}
    </svg>
  );
}

const PATHS: Record<string, React.ReactNode> = {
  bed: (
    <>
      <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6" />
      <path d="M3 18h18M7 10V8a2 2 0 012-2h6a2 2 0 012 2v2" />
    </>
  ),
  wardrobe: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M12 3v18M9 10v3M15 10v3" />
    </>
  ),
  ceiling: (
    <>
      <path d="M3 8h18M5 8v3M9 8v3M13 8v3M17 8v3M21 8v3" />
      <path d="M3 14h18M5 20h14" />
    </>
  ),
  bath: (
    <>
      <path d="M5 12V6a2 2 0 014 0v1" />
      <path d="M3 12h18l-1 7a2 2 0 01-2 2H6a2 2 0 01-2-2L3 12z" />
    </>
  ),
  door: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <circle cx="14" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  desk: (
    <>
      <path d="M3 14h18M5 14v6M19 14v6" />
      <path d="M5 14V8h14v6M9 8V5h6v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M1 5h13v11H1zM14 9h5l3 4v3h-8z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  rupee: (
    <>
      <path d="M7 5h10M7 9h10" />
      <path d="M7 5c0 5-3 6-3 6h2c5 0 6 4 6 9" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  default: <circle cx="12" cy="12" r="3" />,
};