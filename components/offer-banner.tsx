"use client";

import { useEffect, useState } from "react";

export default function OfferBanner({
  text,
  storageKey,
}: {
  text: string;
  storageKey: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div className="relative rounded-pill mb-5 animate-slide-down overflow-hidden border border-gold/40 shadow-[0_4px_20px_hsl(var(--gold)/0.25)]">
      {/* Animated gradient background layer */}
      <div className="absolute inset-0 -z-10 offer-gradient" aria-hidden />

      {/* Shimmer sweep — soft highlight that travels across the banner */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-pill" aria-hidden>
        <div className="offer-shimmer absolute top-0 -left-1/2 w-1/2 h-full" />
      </div>

      <div className="relative flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3">
        {/* Icon with subtle pulse */}
        <span className="shrink-0 relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold text-white" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-gold animate-pulse-ring" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>

        <p className="flex-1 min-w-0 text-[12.5px] sm:text-[14px] font-sans font-semibold text-[#5A4015] leading-snug">
          {text}
        </p>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss offer"
          className="shrink-0 w-7 h-7 rounded-full text-[#5A4015] hover:bg-white/40 grid place-items-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1); }

        /* Animated multi-stop gradient that drifts horizontally */
        .offer-gradient {
          background: linear-gradient(
            115deg,
            #FBF6EE 0%,
            #FCE9C2 18%,
            #F4D88A 38%,
            #FBE7B5 58%,
            #FCE9C2 78%,
            #FBF6EE 100%
          );
          background-size: 280% 100%;
          background-position: 0% 50%;
          animation: gradient-drift 7s ease-in-out infinite;
        }

        @keyframes gradient-drift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glossy shimmer sweep across the surface */
        .offer-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          animation: shimmer-sweep 4.5s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          55%  { transform: translateX(380%) skewX(-20deg); }
          100% { transform: translateX(380%) skewX(-20deg); }
        }

        /* Icon pulse ring — subtle attention pull */
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.55; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Honor reduced-motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .offer-gradient { animation: none; background-position: 30% 50%; }
          .offer-shimmer { display: none; }
          .animate-pulse-ring { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}