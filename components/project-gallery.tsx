"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  // Mobile: 4 thumbs strip. Desktop: 4 thumbs in 2x2 grid.
  const thumbs = images.slice(0, 4);
  const remaining = Math.max(0, images.length - 4);

  return (
    <div>
      {/* Mobile layout — main image stacked above thumb strip */}
      <div className="md:hidden">
        <div className="relative w-full h-[280px] xs:h-[320px] rounded-card overflow-hidden bg-navy mb-2.5">
          <Image
            key={"m-" + main}
            src={main}
            alt={alt}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-opacity duration-300"
          />
          {/* Image counter pill — visual indicator on mobile */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-pill bg-navy/70 backdrop-blur-sm text-white text-[11px] font-sans font-semibold tnum">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Thumb strip — 4 equal squares + more overlay */}
        <div className="grid grid-cols-4 gap-2">
          {thumbs.map((src, i) => {
            const isLast = i === 3 && remaining > 0;
            const isActive = active === i;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={"View image " + (i + 1)}
                className={"relative aspect-square rounded-md overflow-hidden bg-navy transition-all " + (isActive ? "ring-2 ring-gold ring-offset-1 ring-offset-ivory" : "opacity-85 hover:opacity-100")}
              >
                <Image src={src} alt={alt + " — view " + (i + 1)} fill sizes="25vw" className="object-cover" />
                {isLast && (
                  <span className="absolute inset-0 bg-navy/65 grid place-items-center text-white font-sans font-bold text-[14px]">
                    +{remaining}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop layout — 2-column (main + 2x2 thumb grid) */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] gap-3 h-[460px]">
        <div className="relative rounded-card overflow-hidden bg-navy">
          <Image
            key={"d-" + main}
            src={main}
            alt={alt}
            fill
            sizes="60vw"
            priority
            className="object-cover transition-opacity duration-300"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
          {thumbs.map((src, i) => {
            const isLast = i === 3 && remaining > 0;
            const isActive = active === i;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={"View image " + (i + 1)}
                className={"relative rounded-card overflow-hidden bg-navy transition-all " + (isActive ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory" : "opacity-90 hover:opacity-100")}
              >
                <Image src={src} alt={alt + " — view " + (i + 1)} fill sizes="20vw" className="object-cover" />
                {isLast && (
                  <span className="absolute inset-0 bg-navy/60 grid place-items-center text-white font-sans font-semibold text-[14px]">
                    +{remaining} more
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}