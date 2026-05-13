"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  const thumbs = images.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 h-[280px] md:h-[460px]">
      <div className="relative rounded-card overflow-hidden bg-navy">
        <Image
          key={main}
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
          className="object-cover transition-opacity duration-300"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 h-full">
        {thumbs.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative rounded-card overflow-hidden bg-navy transition-all ${
              active === i ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory" : "opacity-90 hover:opacity-100"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} — view ${i + 1}`}
              fill
              sizes="20vw"
              className="object-cover"
            />
            {i === 3 && thumbs.length > 4 && (
              <span className="absolute inset-0 bg-navy/60 grid place-items-center text-white font-sans font-semibold text-[14px]">
                +{images.length - 4} more
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}