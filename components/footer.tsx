import Link from "next/link";
import BrandMark from "./ui/brand-mark";

// Brand-mark social icons — outline-style SVGs that inherit `currentColor`.
// We use SVGs (not lucide-react brand exports) because lucide deprecated
// its brand icons over trademark concerns; storing them inline keeps the
// footer self-contained and removes one dependency. The 18×18 size centers
// cleanly inside the existing 40×40 circle pill below.
function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

// SOCIALS now holds an Icon component instead of a short text label.
// Adding/swapping a network is a one-line change: add the entry here, write
// (or import) its icon component above. The rendering loop below picks it up.
const SOCIALS: { label: string; href: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Instagram", href: "https://instagram.com/abhighar",          Icon: InstagramIcon },
  { label: "Facebook",  href: "https://facebook.com/abhighar",           Icon: FacebookIcon  },
  { label: "LinkedIn",  href: "https://linkedin.com/company/abhighar",   Icon: LinkedInIcon  },
  { label: "YouTube",   href: "https://youtube.com/@abhighar",           Icon: YouTubeIcon   },
];

// Items that should open in a new browser tab when clicked. Centralised here
// so any footer column can opt items in by passing the same label through
// `externalItems` (see Quick Links below). Keeping the list separate from
// the columns themselves means a future "open Terms in new tab in the
// header too" doesn't require copying logic — it just imports this set.
const EXTERNAL_QUICK_LINKS = new Set(["Terms", "Privacy Policy"]);

function mapFooterHref(col: string, item: string): string {
  if (col === "Locations") {
    // CHANGED: "Hinjewadi" was mapped to "/localities/hinjwadi" (no 'e')
    // which 404s — the actual slug in data.ts is "hinjewadi". Fixed below.
    // Other locality slugs were already correct (baner, kharadi, wakad,
    // aundh, koregaon all match what the hero search produces via
    // .toLowerCase()).
    const m: Record<string, string> = {
      "Hinjewadi": "/localities/hinjewadi",
      "Baner": "/localities/baner",
      "Kharadi": "/localities/kharadi",
      "Wakad": "/localities/wakad",
      "Aundh": "/localities/aundh",
      "Koregaon Park": "/localities/koregaon",
      "Chinchwad & Akurdi": "/#localities",
      "Hadapsar": "/#localities",
    };
    return m[item] || "/#localities";
  }
  if (col === "Quick Links") {
    // CHANGED: now that /all-properties exists with query-param filtering,
    // the three catalogue-related items use it:
    //   - "All Projects"    → /all-properties (no filter)
    //   - "New Launches"    → /all-properties?status=new-launch
    //   - "Ready to Move"   → /all-properties?status=ready
    // The /all-properties page reads these query params (see its
    // useSearchParams call) and pre-applies the matching filter so the
    // visitor lands on a filtered view, not the unfiltered grid.
    const m: Record<string, string> = {
      "All Projects":    "/all-properties",
      "New Launches":    "/all-properties?status=new-launch",
      "Ready to Move":   "/all-properties?status=ready",
      "Interior Design": "/interiors",
      "EMI Calculator":  "/#tools",
      "About Us":        "/team",
      "Contact":         "/#contact",
      // Legal pages — rendered with target="_blank" by FooterCol when the
      // item label is also in EXTERNAL_QUICK_LINKS.
      "Terms":           "/terms-of-use",
      "Privacy Policy":  "/privacy-policy",
    };
    return m[item] || "/";
  }
  return "/";
}

function FooterCol({
  title,
  items,
  plain,
  externalItems,
}: {
  title: string;
  items: string[];
  plain?: boolean;
  // Optional set of item labels that should open in a new tab. Items not
  // in the set fall back to the normal in-page Next <Link> behaviour, so
  // existing columns don't need to change to opt in.
  externalItems?: Set<string>;
}) {
  return (
    <div>
      <h4 className="font-sans font-semibold text-[15px] text-ivory mb-5 flex items-center gap-2.5 tracking-tight">
        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {items.map((it) => {
          if (plain) {
            return <li key={it} className="body-base text-ivory/70">{it}</li>;
          }
          const href = mapFooterHref(title, it);
          const isExternal = externalItems?.has(it) ?? false;
          // External items use a plain <a> with target="_blank" so they
          // open in a new tab; the Next <Link> wrapper wouldn't add that
          // attribute. rel="noopener noreferrer" is the standard pair to
          // prevent the new tab from being able to navigate the opener.
          if (isExternal) {
            return (
              <li key={it}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-base text-ivory/70 inline-block transition-all duration-300 hover:text-gold hover:pl-1.5"
                >
                  {it}
                </a>
              </li>
            );
          }
          return (
            <li key={it}>
              <Link
                href={href}
                className="body-base text-ivory/70 inline-block transition-all duration-300 hover:text-gold hover:pl-1.5"
              >
                {it}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden mt-16 rounded-t-[48px] bg-navy text-ivory px-3 lg:px-4 pt-20 pb-6">
      <div aria-hidden className="absolute -top-48 -right-24 w-[600px] h-[600px] rounded-full opacity-100 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.25), transparent 70%)", filter: "blur(60px)" }} />
      <div aria-hidden className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-100 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--navy-80) / 0.50), transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-ivory/12">
          <div>
            <Link href="/" className="group flex items-center gap-3">
              <BrandMark size={48} glow={true} />
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-[20px] text-ivory tracking-tight">Abhi Ghar</span>
                <span className="font-sans font-semibold uppercase text-[10px] mt-1 tracking-[0.16em] text-gold">Pune &middot; Est. 2020</span>
              </div>
            </Link>

            <p className="font-sans font-medium text-[28px] leading-[1.15] my-7 max-w-[380px] text-ivory tracking-tight">
              Your trusted partner for <span className="text-gold italic">premium properties</span> across Pune.
            </p>
            <p className="body-base text-ivory/65 max-w-[380px] mb-7">
              Abhi Ghar curates residential and commercial real estate across Pune&apos;s most considered localities &mdash; from Hinjewadi to Hadapsar &mdash; with senior-advisor-led guidance.
            </p>

            <div className="flex items-center gap-3.5 p-4 rounded-card bg-ivory/6 border border-ivory/10 max-w-[380px] mb-5">
              <div className="w-12 h-12 rounded-full bg-gold text-white grid place-items-center font-sans font-bold text-[14px] shadow-cta">SK</div>
              <div>
                <div className="font-sans font-semibold text-[17px] text-ivory tracking-tight">Sarika </div>
                <div className="meta text-ivory/60">Senior Advisor</div>
              </div>
            </div>

            <div className="flex gap-2.5 flex-wrap">
              <a href="tel:+919730302843" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-gold text-white meta font-semibold shadow-cta transition-all hover:bg-gold-hover hover:-translate-y-0.5">
                <span aria-hidden>&#9742;</span> Schedule a 15-min call
              </a>
              <a href="https://wa.me/919730302843" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-[#25D366] text-white meta font-semibold transition-all hover:bg-[#1da851] hover:-translate-y-0.5">
                <span aria-hidden>&#128172;</span> +91 97303 02843
              </a>
            </div>
          </div>

          <FooterCol title="Locations" items={["Hinjewadi","Baner","Kharadi","Wakad","Aundh","Koregaon Park","Chinchwad & Akurdi","Hadapsar"]} />
          <FooterCol
            title="Quick Links"
            items={["All Projects","New Launches","Ready to Move","Interior Design","EMI Calculator","About Us","Contact","Terms","Privacy Policy"]}
            externalItems={EXTERNAL_QUICK_LINKS}
          />
          <FooterCol title="Reach Us" items={["+91 9730302843","+91 9890122755","contact@abhighar.com","Mon – Sun · 10 AM – 8 PM"]} plain />
        </div>

        <div className="pt-7 flex justify-between items-center flex-wrap gap-5">
          <div className="meta text-ivory/50 leading-relaxed">
            &copy; 2025 <strong className="text-ivory font-bold">Abhi Ghar</strong> &middot; All rights reserved &middot; MAHARERA Reg. No. A031262401068
          </div>
          {/* Social pills — same 40×40 circle styling as before; the only
              change is that we render the brand-mark Icon (inheriting the
              ivory text color) instead of a 2-letter text abbreviation.
              On hover the background flips to gold; the icon stays the
              same color (currentColor) since text-ivory keeps applying. */}
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-ivory/8 grid place-items-center text-ivory transition-all duration-300 hover:bg-gold hover:-translate-y-1 hover:-rotate-6 hover:shadow-cta"
              >
                <s.Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}