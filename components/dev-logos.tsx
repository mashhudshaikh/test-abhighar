import { developers } from "@/lib/data";

// 1. Define a shape for your developer objects
// The '?' makes 'bold' optional so TypeScript doesn't complain when it's missing.
type Developer = {
  readonly name: string;
  readonly glyph: string;
  readonly bold?: boolean; 
};

function Glyph({ kind }: { kind: string }) {
  switch (kind) {
    case "diamond":     return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><polygon points="16,4 28,16 16,28 4,16" stroke="currentColor" strokeWidth="1.5"/><polygon points="16,10 22,16 16,22 10,16" fill="currentColor"/></svg>);
    case "circle-arrow":return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/><path d="M10 16 H 22 M 16 10 L 22 16 L 16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
    case "mm":          return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><path d="M4 6 V 26 M 4 6 L 12 18 L 20 6 V 26 M 24 6 L 28 6 V 26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case "kp-square":   return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><rect x="4" y="4" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/><text x="16" y="21" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="700" fill="currentColor">KP</text></svg>);
    case "k-circle":    return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/><path d="M11 9 V 23 M 11 16 L 21 9 M 11 16 L 21 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case "star":        return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><path d="M16 3 L 19 13 L 29 13 L 21 19 L 24 29 L 16 23 L 8 29 L 11 19 L 3 13 L 13 13 Z" fill="currentColor" opacity="0.18"/><path d="M16 3 L 19 13 L 29 13 L 21 19 L 24 29 L 16 23 L 8 29 L 11 19 L 3 13 L 13 13 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>);
    case "waves":       return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><path d="M16 4 V 28 M 8 12 Q 16 14 24 12 M 6 18 Q 16 21 26 18 M 8 24 Q 16 26 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>);
    case "vtp":         return (<svg viewBox="0 0 32 32" fill="none" className="w-7 h-7"><path d="M3 6 L 10 24 L 16 6 M 14 24 L 20 6 L 26 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default: return null;
  }
}

export default function DevLogos() {
  // 2. Cast the imported data to our Developer array type
  const list = [...developers, ...developers] as Developer[];

  return (
    <section className="py-12 overflow-hidden relative bg-ivory" aria-label="Building partners">
      <div className="container-x">
        <div className="text-center mb-7">
          <span className="inline-flex items-center gap-3 eyebrow text-slate">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Building With Pune's Finest
          </span>
        </div>
      </div>
      <div
        className="overflow-hidden group"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="flex gap-14 items-center w-max animate-slide group-hover:[animation-play-state:paused] mt-1">
          {list.map((d, i) => (
            <div
              key={`${d.name}-${i}`}
              className="h-12 flex items-center gap-3 shrink-0 text-slate bg-white/70 border border-navy/8 backdrop-blur-sm px-5 rounded-card transition-all duration-500 hover:text-gold-hover hover:-translate-y-1 hover:shadow-card hover:border-gold"
            >
              <Glyph kind={d.glyph} />
              <span className={d.bold ? "font-sans font-extrabold text-[17px] tracking-tight whitespace-nowrap" : "font-sans font-semibold text-[18px] tracking-tight whitespace-nowrap"}>
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}