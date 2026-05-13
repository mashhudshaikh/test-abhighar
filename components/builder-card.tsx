"use client";

import { useState } from "react";
import Link from "next/link";
import { Builder } from "@/lib/data";

export default function BuilderCard({ builder }: { builder: Builder }) {
  const [expanded, setExpanded] = useState(false);
  const teaser = builder.about.length > 280 && !expanded
    ? builder.about.slice(0, 280).replace(/\s\S*$/, "") + "..."
    : builder.about;

  return (
    <div className="card-base overflow-hidden">
      <div className="bg-navy/[0.04] border-b border-navy/8 px-5 sm:px-7 py-3.5">
        <div className="sec-eyebrow text-navy/70">About {builder.name}</div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid md:grid-cols-[200px_1fr] gap-5 sm:gap-7 items-start">
          {/* Wordmark — SVG-text instead of external image */}
          <div className="shrink-0">
            <div className="font-sans font-bold text-navy/85 mb-1.5">{builder.name}</div>
            <div className="aspect-[5/3] rounded-panel border border-navy/10 bg-white grid place-items-center px-4 relative overflow-hidden">
              <div aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                <span className="block w-7 h-[3px] bg-navy/30 rounded-full" />
                <span className="block w-9 h-[3px] bg-navy/40 rounded-full" />
                <span className="block w-11 h-[3px] bg-navy/50 rounded-full" />
                <span className="block w-9 h-[3px] bg-navy/40 rounded-full" />
                <span className="block w-7 h-[3px] bg-navy/30 rounded-full" />
              </div>
              <div className="text-center pl-10">
                <div className="font-display font-bold text-[22px] sm:text-[26px] tracking-tight text-[#9A8056] leading-none">
                  {builder.wordmark.text}
                </div>
                <div className="font-sans font-medium uppercase text-[9px] tracking-[0.18em] text-navy/55 mt-1.5">
                  {builder.wordmark.tagline}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <div className="meta text-slate font-semibold mb-2">Locations</div>
              <div className="flex flex-wrap gap-1.5">
                {builder.locations.map((loc) => (
                  <span key={loc} className="inline-block px-3 py-1 rounded-pill bg-navy/[0.04] border border-navy/10 text-navy text-[12.5px] font-medium">{loc}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5 mb-5">
          <Stat label="Experience" value={builder.experience} />
          <Stat label="Total Projects" value={builder.totalProjects.toString()} />
          <Stat label="Happy Families" value={builder.happyFamilies} />
        </div>

        <p className="body-base text-slate leading-relaxed">
          {teaser}
          {builder.about.length > 280 && (
            <>
              {" "}
              <button type="button" onClick={() => setExpanded(!expanded)} className="text-gold-hover font-semibold hover:text-navy transition-colors">
                {expanded ? "Read less" : "Read more"}
              </button>
            </>
          )}
        </p>

        <Link href="#" className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-success text-white font-sans font-semibold text-[13.5px] hover:bg-success/90 transition-colors">
          View all projects by {builder.name} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-pill bg-navy/[0.04] border border-navy/8">
      <span className="meta text-slate font-medium">{label}:</span>
      <span className="font-sans font-bold text-success text-[13.5px] tnum">{value}</span>
    </div>
  );
}