"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BrandMark from "./ui/brand-mark";
import MagneticButton from "./ui/magnetic-button";
import MobileMenu from "./mobile-menu";
import { cn } from "@/lib/utils";

// CHANGED: "Projects" now points to /all-properties — the dedicated
// catalogue index page with status and locality filter support. Previously
// pointed to /localities/hinjewadi as a stand-in (and before that, the
// typo'd /localities/hinjwadi which 404'd). Top-level nav should land on
// a real "all" listing, not a single locality.
const NAV_LINKS: [string, string][] = [
  ["Projects",        "/all-properties"],
  ["Locations",       "/localities"],
  ["Interior Design", "/interiors"],
  ["Contact",         "/#contact"],
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const overHero = pathname === "/" && !scrolled && !menuOpen;

  const navClass = cn(
    "flex items-center justify-between rounded-pill border backdrop-blur-2xl px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 transition-all duration-500",
    overHero
      ? "bg-white/15 border-white/25 shadow-[0_8px_32px_hsl(var(--navy)/0.35)]"
      : "bg-ivory/95 border-navy/10 shadow-[0_10px_40px_hsl(var(--navy)/0.10)]"
  );

  const brandTextStyle = overHero ? { textShadow: "0 2px 16px hsl(var(--navy) / 0.7)" } : undefined;
  const brandTagStyle  = overHero ? { textShadow: "0 1px 8px hsl(var(--navy) / 0.7)" } : undefined;
  const navLinkStyle   = overHero ? { textShadow: "0 1px 8px hsl(var(--navy) / 0.6)" } : undefined;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-500">
        <div className="mx-auto max-w-[1280px] px-3 sm:px-4 lg:px-8 mt-2.5 sm:mt-3.5">
          <nav className={navClass}>
            <Link href="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
              <BrandMark size={40} glow={overHero} className="sm:!w-12 sm:!h-12" />
              <div className="flex flex-col leading-none min-w-0">
                <span className={cn("font-display font-semibold text-[16px] sm:text-[20px] tracking-tight transition-colors duration-500 truncate", overHero ? "text-white" : "text-navy")} style={brandTextStyle}>Abhi Ghar</span>
                <span className={cn("font-sans font-semibold uppercase text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 tracking-[0.14em] sm:tracking-[0.16em] transition-colors duration-500 truncate", overHero ? "text-gold" : "text-gold-hover")} style={brandTagStyle}>Pune &middot; Est. 2020</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(([label, href]) => (
                <Link key={href} href={href} className={cn("inline-flex font-sans font-medium text-sm px-4 py-2 rounded-pill transition-colors duration-300", overHero ? "text-white hover:bg-white/20 hover:text-gold" : "text-navy hover:bg-navy/5 hover:text-gold-hover")} style={navLinkStyle}>{label}</Link>
              ))}
              <MagneticButton href="/#contact" className="ml-2 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] px-5 py-2.5 shadow-cta hover:bg-gold-hover transition-colors duration-300">
                Talk to Advisor <span aria-hidden>&rarr;</span>
              </MagneticButton>
            </div>

            {/* Mobile — hamburger button only */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={cn(
                "md:hidden inline-flex items-center justify-center w-10 h-10 rounded-pill transition-colors shrink-0",
                overHero ? "text-white hover:bg-white/15" : "text-navy hover:bg-navy/5"
              )}
              style={navLinkStyle}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  );
}