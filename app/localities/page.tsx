// app/localities/page.tsx
// ─────────────────────────────────────────────────────────────────────
// "View all 28 localities" link on the homepage Localities section now
// points here. Replaces the previously-disabled v1 fallback.
//
// Distinct from /localities/[slug]/page.tsx (which is a single locality
// detail). This is the index page showing every locality we cover.
//
// Card visual matches the homepage Localities component so brand
// recognition carries across — but here it shows ALL of them in one place.
// ─────────────────────────────────────────────────────────────────────
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { localities } from "@/lib/data";
import Reveal from "@/components/ui/reveal";

export const metadata = {
  title: "All Pune Localities — Abhi Ghar",
  description: "Browse every Pune neighbourhood we cover. From the IT corridors of Hinjewadi to the heritage lanes of Koregaon Park.",
};

export default function AllLocalitiesPage() {
  // Sort by home count descending so the most active areas surface first.
  // If `count` is a formatted string like "120+" rather than a number,
  // this becomes a no-op; that's fine — alphabetical fallback below is
  // already a sensible order.
  const sorted = [...localities].sort((a, b) => {
    const na = parseInt(String(a.count).replace(/\D/g, "")) || 0;
    const nb = parseInt(String(b.count).replace(/\D/g, "")) || 0;
    return nb - na;
  });

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-16">
        <div className="container-x">

          {/* Header block */}
          <div className="mb-12 lg:mb-16 max-w-[820px]">
            <nav className="meta text-slate mb-4">
              <Link href="/" className="hover:text-gold-hover">Home</Link>
              <span className="mx-2 text-steel">/</span>
              <span className="text-navy font-semibold">Localities</span>
            </nav>
            <div className="sec-eyebrow mb-3">Explore by Locality</div>
            <h1
              className="font-display font-semibold text-navy leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)", letterSpacing: "-0.02em" }}
            >
              All Pune <em className="text-gold italic">neighbourhoods.</em>
            </h1>
            <p className="body-base text-slate mt-4 max-w-[680px]">
              Each locality has its own pace, character, and price band. Browse all {localities.length} curated areas we cover &mdash; from the IT corridors of Hinjewadi to the heritage lanes of Koregaon Park.
            </p>
          </div>

          {/* Locality cards — same visual language as the homepage section
              so the user feels at home. Just more of them. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((l, i) => (
              <Reveal key={l.slug} delay={i * 0.04}>
                <Link
                  href={`/localities/${l.slug}`}
                  className="group relative block rounded-[28px] overflow-hidden aspect-[4/3.4] bg-navy transition-transform duration-500 hover:-translate-y-2"
                >
                  <Image
                    src={l.image}
                    alt={l.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/85" />
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-gold-hover meta font-bold z-10">
                    {l.count} Homes
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                    <div className="font-sans font-semibold text-[26px] tracking-tight mb-2">{l.name}</div>
                    <div className="flex justify-between items-end gap-3">
                      <div className="meta opacity-90">From {l.from} &middot; {l.tag}</div>
                      <span className="w-10 h-10 rounded-full bg-white/18 backdrop-blur-sm border border-white/30 grid place-items-center text-white transition-all duration-300 group-hover:bg-gold group-hover:border-transparent group-hover:-rotate-45">
                        &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* "Don't see your area?" tail card */}
          <div className="mt-16 card-base p-7 lg:p-8 bg-ivory text-center max-w-[680px] mx-auto">
            <div className="font-sans font-bold text-[18px] lg:text-[20px] text-navy mb-2 tracking-tight">
              Don&apos;t see your preferred locality?
            </div>
            <p className="body-base text-slate mb-5 max-w-[480px] mx-auto">
              We cover most of Pune even when an area isn&apos;t listed here. Tell us where you&apos;re looking and we&apos;ll match you with an advisor who knows it well.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-navy text-white font-sans font-semibold text-[13px] hover:bg-navy/90 transition-colors"
            >
              Ask an advisor <span aria-hidden>&rarr;</span>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}