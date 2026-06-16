import Link from "next/link";
import BrandMark from "./ui/brand-mark";

const SOCIALS = [
  { label: "Instagram", short: "IG", href: "https://instagram.com/abhighar" },
  { label: "Facebook",  short: "FB", href: "https://facebook.com/abhighar" },
  { label: "LinkedIn",  short: "LI", href: "https://linkedin.com/company/abhighar" },
  { label: "YouTube",   short: "YT", href: "https://youtube.com/@abhighar" },
];

// Items that should open in a new browser tab when clicked. Centralised here
// so any footer column can opt items in by passing the same label through
// `externalItems` (see Quick Links below). Keeping the list separate from
// the columns themselves means a future "open Terms in new tab in the
// header too" doesn't require copying logic — it just imports this set.
const EXTERNAL_QUICK_LINKS = new Set(["Terms", "Privacy Policy"]);

function mapFooterHref(col: string, item: string): string {
  if (col === "Locations") {
    const m: Record<string, string> = {
      "Hinjewadi": "/localities/hinjwadi",
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
    const m: Record<string, string> = {
      "All Projects":    "/localities/hinjwadi",
      "New Launches":    "/localities/hinjwadi",
      "Ready to Move":   "/localities/hinjwadi",
      "Interior Design": "/interiors",
      "EMI Calculator":  "/#tools",
      "About Us":        "/#contact",
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
                <span className="font-sans font-semibold uppercase text-[10px] mt-1 tracking-[0.16em] text-gold">Pune &middot; Est. 2018</span>
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
              <a href="tel:+919890122755" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-gold text-white meta font-semibold shadow-cta transition-all hover:bg-gold-hover hover:-translate-y-0.5">
                <span aria-hidden>&#9742;</span> Schedule a 15-min call
              </a>
              <a href="https://wa.me/919890122755" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-[#25D366] text-white meta font-semibold transition-all hover:bg-[#1da851] hover:-translate-y-0.5">
                <span aria-hidden>&#128172;</span> +91 98901 22755
              </a>
            </div>
          </div>

          <FooterCol title="Locations" items={["Hinjewadi","Baner","Kharadi","Wakad","Aundh","Koregaon Park","Chinchwad & Akurdi","Hadapsar"]} />
          <FooterCol
            title="Quick Links"
            items={["All Projects","New Launches","Ready to Move","Interior Design","EMI Calculator","About Us","Contact","Terms","Privacy Policy"]}
            externalItems={EXTERNAL_QUICK_LINKS}
          />
          <FooterCol title="Reach Us" items={["+91 9890122755","+91 9730302843","hello@abhighar.in","Mon – Sun · 10 AM – 8 PM"]} plain />
        </div>

        <div className="pt-7 flex justify-between items-center flex-wrap gap-5">
          <div className="meta text-ivory/50 leading-relaxed">
            &copy; 2025 <strong className="text-ivory font-bold">Abhi Ghar</strong> &middot; All rights reserved &middot; MAHARERA Reg. No. A52100018236
          </div>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded-full bg-ivory/8 grid place-items-center text-ivory text-[12px] font-semibold transition-all duration-300 hover:bg-gold hover:-translate-y-1 hover:-rotate-6 hover:shadow-cta">{s.short}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}