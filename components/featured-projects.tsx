"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/data";
import Reveal from "./ui/reveal";
import MagneticButton from "./ui/magnetic-button";

export default function FeaturedProjects() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const toggle = (slug: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <section id="projects" className="relative overflow-hidden bg-white pt-16 lg:pt-20 pb-14 lg:pb-20 scroll-mt-[100px]">
      <div className="absolute top-[15%] right-[-180px] w-[520px] h-[520px] rounded-full blur-[80px] opacity-50 pointer-events-none animate-drift-3"
           style={{ background: "radial-gradient(circle, hsl(var(--brass) / 0.35), transparent 70%)" }} />
      <div className="absolute bottom-[10%] left-[-150px] w-[340px] h-[340px] rounded-full blur-[80px] opacity-40 pointer-events-none animate-drift-4"
           style={{ background: "radial-gradient(circle, hsl(var(--navy-80) / 0.40), transparent 70%)" }} />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-12 lg:mb-14">
          <Reveal>
            <div className="sec-eyebrow mb-4">Hand-picked This Season</div>
            <h2 className="h2-section text-navy">
              Featured <em className="text-gold italic">residences.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">
                Curated by senior advisors who&apos;ve walked every floor plan and verified every detail.
              </p>
              <Link href="/localities/hinjwadi" className="font-sans font-semibold text-gold-hover inline-flex items-center gap-1.5 hover:gap-2.5 hover:text-navy transition-all">
                View full catalogue <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <article className="card-base flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:shadow-hover group">
                <div className="relative h-[260px] overflow-hidden p-3.5">
                  <span className={"absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-pill meta font-bold tracking-wider " + (p.badgeAlt ? "bg-navy text-white" : "bg-gold text-white shadow-cta")}>
                    {p.badge}
                  </span>
                  <button
                    onClick={() => toggle(p.slug)}
                    aria-label="Save"
                    className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm grid place-items-center text-gold-hover transition-all duration-300 hover:bg-gold hover:text-white hover:scale-110"
                  >
                    {favs.has(p.slug) ? "\u2665" : "\u2661"}
                  </button>
                  <div className="relative w-full h-full overflow-hidden rounded-[22px]">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[800ms] group-hover:scale-105"/>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-1 flex-1 flex flex-col">
                  <div className="eyebrow text-slate mb-2 flex items-center gap-2">
                    <span aria-hidden>&#9679;</span> {p.location}
                  </div>
                  <Link href={"/projects/" + p.slug} className="h3-card text-navy mb-3.5 hover:text-gold-hover transition-colors">{p.name}</Link>
                  <div className="flex gap-2 flex-wrap mb-5 pb-5 border-b border-dashed border-navy/10">
                    {[p.config, p.area, p.possession].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-pill bg-ivory text-slate meta font-semibold">{s}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="price text-navy">{p.price}
                      <span className="meta text-steel font-normal ml-1">onwards</span>
                    </div>
                    <Link href={"/projects/" + p.slug} aria-label="View" className="w-10 h-10 rounded-full bg-ivory text-navy grid place-items-center transition-all duration-300 hover:bg-gold hover:text-white hover:-rotate-45 hover:shadow-cta">
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-12 lg:mt-14">
          <MagneticButton href="/localities/hinjwadi" className="btn-primary">
            Browse all 340 properties
            <span aria-hidden>&rarr;</span>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}