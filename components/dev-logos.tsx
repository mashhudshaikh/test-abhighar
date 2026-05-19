// dev-logo.tsx
import React from "react";

const builders = [
  { name: "ANP", src: "/builders/anp.png" },
  { name: "Birla State", src: "/builders/birla-state.png" },
  { name: "Gera", src: "/builders/gera.png" },
  { name: "Godrej Properties", src: "/builders/godrej-properties.png" },
  { name: "Hiranandani Group", src: "/builders/Hiranandani-logo.png" },
  { name: "Kalpataru", src: "/builders/Kalpataru-Ltd.png" },
  { name: "Kasturi", src: "/builders/kasturi.png" },
  { name: "Kohinoor", src: "/builders/kohinoor.png" },
  { name: "Kolte Patil", src: "/builders/kolte_patil_developers_limited_logo.png" },
  { name: "Lodha Group", src: "/builders/Lodha-group-logo.png" },
  { name: "Mahindra Lifespaces", src: "/builders/Mahindra-Lifespaces.png" },
  { name: "Paranjape Schemes", src: "/builders/Paranjape%20Schemes.png" },
  { name: "Shapoorji Pallonji", src: "/builders/Shapoorji_Pallonji_Group_logo.svg" },
  { name: "VTP Reality", src: "/builders/vtp-reality.png" }
];

export default function DevLogos() {
  // Tripling or doubling the array ensures no visual gaps/snapping on massive desktop widths during the loop
  const list = [...builders, ...builders, ...builders];

  return (
    <section className="py-8 md:py-12 pt-5 overflow-hidden relative bg-ivory" aria-label="Building partners">
      <div className="container-x">
        <div className="text-center mb-5 md:mb-7">
          <span className="inline-flex items-center gap-2 md:gap-3 eyebrow text-slate text-xs md:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Building With Pune's Finest
          </span>
        </div>
      </div>
      
      <div
        className="overflow-hidden group w-full"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        <div className="flex gap-6 md:gap-14 items-center w-max animate-slide md:group-hover:[animation-play-state:paused] mt-1">
          {list.map((d, i) => (
            <div
              key={`${d.name}-${i}`}
              className="h-12 w-32 md:h-16 md:w-44 flex items-center justify-center shrink-0 bg-white/70 border border-navy/8 backdrop-blur-sm px-3 md:px-4 rounded-card transition-all duration-500 md:hover:-translate-y-1 md:hover:shadow-card md:hover:border-gold"
            >
              <img 
                src={d.src} 
                alt={`${d.name} Logo`} 
                className="max-h-7 md:max-h-10 max-w-full object-contain transition-transform duration-300 md:group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}