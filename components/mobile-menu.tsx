"use client";
import { useEffect } from "react";
import Link from "next/link";
import BrandMark from "./ui/brand-mark";

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: [string, string][];
}) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={"md:hidden fixed inset-0 z-[55] bg-navy/60 backdrop-blur-sm transition-opacity duration-300 " + (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
      />

      {/* Drawer — slides in from right */}
      <aside
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={"md:hidden fixed top-0 right-0 bottom-0 z-[60] w-[85vw] max-w-[360px] bg-ivory shadow-[-12px_0_40px_hsl(var(--navy)/0.20)] transition-transform duration-300 ease-out flex flex-col " + (open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header inside drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy/10">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <BrandMark size={40} glow={false} />
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold text-[17px] text-navy tracking-tight">Abhi Ghar</span>
              <span className="font-sans font-semibold uppercase text-[9px] mt-0.5 tracking-[0.14em] text-gold-hover">Pune &middot; Est. 2018</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full text-navy hover:bg-navy/5 grid place-items-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="flex flex-col gap-1">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 rounded-card font-sans font-semibold text-[16px] text-navy hover:bg-white hover:text-gold-hover transition-colors group"
                >
                  {label}
                  <span aria-hidden className="text-slate/40 group-hover:text-gold-hover transition-colors">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-navy/10">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-hover mb-3">Get in touch</div>
            <a href="tel:+919890122755" onClick={onClose} className="flex items-center gap-2.5 px-4 py-3 rounded-card text-navy font-sans font-medium text-[14px] hover:bg-white transition-colors">
              <span aria-hidden>&#9742;</span> +91 98901 22755
            </a>
            <a href="https://wa.me/919890122755" target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex items-center gap-2.5 px-4 py-3 rounded-card text-navy font-sans font-medium text-[14px] hover:bg-white transition-colors">
              <span aria-hidden>&#128172;</span> WhatsApp us
            </a>
          </div>
        </nav>

        {/* Sticky bottom CTA */}
        <div className="p-5 border-t border-navy/10 bg-white">
          <Link
            href="/#contact"
            onClick={onClose}
            className="flex items-center justify-center gap-2 h-12 rounded-pill bg-gold text-white font-sans font-semibold text-[14px] shadow-cta hover:bg-gold-hover transition-colors"
          >
            Talk to an Advisor <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
