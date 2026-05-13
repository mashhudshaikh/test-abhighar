"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BrandMark from "./ui/brand-mark";
import MagneticButton from "./ui/magnetic-button";
import { cn } from "@/lib/utils";

const NAV_LINKS: [string, string][] = [
  ["Projects",        "/localities/hinjwadi"],
  ["Locations",       "/#localities"],
  ["Interior Design", "/interiors"],
  ["Contact",         "/#contact"],
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent-over-dark mode is only valid on the homepage at the top.
  // Every other page (and the homepage once scrolled) uses the light pill.
  const overHero = pathname === "/" && !scrolled;

  const navClass = cn(
    "flex items-center justify-between rounded-pill border backdrop-blur-2xl px-4 py-2.5 lg:px-5 transition-all duration-500",
    overHero
      ? "bg-white/15 border-white/25 shadow-[0_8px_32px_hsl(var(--navy)/0.35)]"
      : "bg-ivory/95 border-navy/10 shadow-[0_10px_40px_hsl(var(--navy)/0.10)]"
  );

  const brandTextStyle = overHero ? { textShadow: "0 2px 16px hsl(var(--navy) / 0.7)" } : undefined;
  const brandTagStyle  = overHero ? { textShadow: "0 1px 8px hsl(var(--navy) / 0.7)" } : undefined;
  const navLinkStyle   = overHero ? { textShadow: "0 1px 8px hsl(var(--navy) / 0.6)" } : undefined;

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-500">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-8 mt-3.5">
        <nav className={navClass}>
          <Link href="/" className="group flex items-center gap-3">
            <BrandMark size={48} glow={overHero} />
            <div className="flex flex-col leading-none">
              <span className={cn("font-display font-semibold text-[20px] tracking-tight transition-colors duration-500", overHero ? "text-white" : "text-navy")} style={brandTextStyle}>Abhi Ghar</span>
              <span className={cn("font-sans font-semibold uppercase text-[10px] mt-1 tracking-[0.16em] transition-colors duration-500", overHero ? "text-gold" : "text-gold-hover")} style={brandTagStyle}>Pune &middot; Est. 2018</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href} className={cn("hidden md:inline-flex font-sans font-medium text-sm px-4 py-2 rounded-pill transition-colors duration-300", overHero ? "text-white hover:bg-white/20 hover:text-gold" : "text-navy hover:bg-navy/5 hover:text-gold-hover")} style={navLinkStyle}>{label}</Link>
            ))}
            <MagneticButton href="/#contact" className="ml-2 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] px-5 py-2.5 shadow-cta hover:bg-gold-hover transition-colors duration-300">
              Talk to Advisor <span aria-hidden>&rarr;</span>
            </MagneticButton>
          </div>
        </nav>
      </div>
    </header>
  );
}