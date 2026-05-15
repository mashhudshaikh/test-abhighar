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
    <div className="offer-banner-root relative flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-5 py-3 sm:py-3.5 mb-5 rounded-[20px] sm:rounded-pill overflow-hidden border shadow-[0_4px_18px_hsl(var(--gold)/0.22)]">

      {/* ━━━ LEFT BLOCK: megaphone icon + SPECIAL OFFER stamp (always side by side) ━━━ */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative z-[2]">
        {/* Megaphone icon in red gradient circle with pulse ring */}
        <div className="relative shrink-0 w-9 h-9 sm:w-11 sm:h-11 grid place-items-center" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-[#DC2626] icon-pulse-ring" />
          <span
            className="relative z-[1] w-7 h-7 sm:w-9 sm:h-9 rounded-full grid place-items-center"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
              boxShadow:
                "0 3px 10px rgba(220,38,38,0.40), inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)",
            }}
          >
            <svg
              className="megaphone-wiggle"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </span>
        </div>

        {/* SPECIAL OFFER stamp — sits right next to the megaphone */}
        <span className="so-stamp">
          <svg
            className="so-burst"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="1.5"
            opacity="0.55"
            aria-hidden
          >
            <line x1="50" y1="2"  x2="50" y2="14" />
            <line x1="50" y1="86" x2="50" y2="98" />
            <line x1="2"  y1="50" x2="14" y2="50" />
            <line x1="86" y1="50" x2="98" y2="50" />
            <line x1="16" y1="16" x2="24" y2="24" />
            <line x1="76" y1="76" x2="84" y2="84" />
            <line x1="84" y1="16" x2="76" y2="24" />
            <line x1="24" y1="76" x2="16" y2="84" />
          </svg>
          <span className="so-star" aria-hidden>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="so-label">Special Offer</span>
        </span>
      </div>

      {/* ━━━ CENTER: body text — wraps freely without affecting the left block ━━━ */}
      <p className="flex-1 min-w-0 banner-body relative z-[2]">
        {text}{" "}
        <span className="banner-emphasis">Save up to ₹3 L</span>
      </p>

      {/* ━━━ RIGHT: dismiss X ━━━ */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss offer"
        className="relative z-[2] shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full grid place-items-center text-[#142347] bg-white/55 hover:bg-white/90 transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <style jsx>{`
        .offer-banner-root {
          background: linear-gradient(
            90deg,
            #FBF6EE 0%,
            #F5EFE2 25%,
            #EFE6D2 50%,
            #F5EFE2 75%,
            #FBF6EE 100%
          );
          background-size: 240% 100%;
          border-color: hsl(var(--navy) / 0.15);
          animation: bgDrift 9s ease-in-out infinite, slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .offer-banner-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 65%
          );
          transform: translateX(-100%) skewX(-15deg);
          animation: shimmerSweep 6s ease-in-out infinite;
          animation-delay: 1.5s;
          pointer-events: none;
          z-index: 1;
        }

        /* SPECIAL OFFER stamp — gold-bordered red pill, sized to match the megaphone icon's vertical height */
        .so-stamp {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px 6px 9px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%);
          border: 1.5px solid #FFD700;
          border-radius: 100px;
          color: white;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
          line-height: 1;
          box-shadow:
            0 0 0 3px rgba(220, 38, 38, 0.10),
            0 2px 8px rgba(220, 38, 38, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }

        @media (min-width: 640px) {
          .so-stamp {
            padding: 8px 14px 8px 12px;
            font-size: 13px;
            letter-spacing: 0.14em;
            gap: 7px;
            border-width: 2px;
            box-shadow:
              0 0 0 4px rgba(220, 38, 38, 0.12),
              0 3px 12px rgba(220, 38, 38, 0.32),
              inset 0 1px 1px rgba(255, 255, 255, 0.3);
          }
        }

        .so-burst {
          position: absolute;
          inset: -9px;
          pointer-events: none;
          animation: burstSpin 40s linear infinite;
        }

        @media (min-width: 640px) {
          .so-burst { inset: -11px; }
        }

        .so-star {
          display: inline-grid;
          place-items: center;
          width: 13px;
          height: 13px;
          color: #FFD700;
          filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.55));
          position: relative;
          z-index: 2;
        }

        @media (min-width: 640px) {
          .so-star { width: 15px; height: 15px; }
        }

        .so-label {
          position: relative;
          z-index: 2;
        }

        .banner-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #142347;
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          .banner-body {
            font-size: 13.5px;
          }
        }

        .banner-emphasis {
          font-weight: 800;
          white-space: nowrap;
        }

        @keyframes bgDrift {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        @keyframes shimmerSweep {
          0%, 55%, 100% { transform: translateX(-100%) skewX(-15deg); }
          80%           { transform: translateX(220%) skewX(-15deg); }
        }

        @keyframes burstSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes pulseRing {
          0%   { transform: scale(0.85); opacity: 0.55; }
          70%  { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        @keyframes megaphoneWiggle {
          0%, 70%, 100% { transform: rotate(0deg); }
          74% { transform: rotate(-10deg); }
          78% { transform: rotate(8deg); }
          82% { transform: rotate(-6deg); }
          86% { transform: rotate(4deg); }
          92% { transform: rotate(0deg); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        :global(.icon-pulse-ring) {
          animation: pulseRing 2.4s ease-out infinite;
        }

        :global(.megaphone-wiggle) {
          transform-origin: 70% 55%;
          animation: megaphoneWiggle 3s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-banner-root,
          .offer-banner-root::before,
          .so-burst,
          :global(.icon-pulse-ring),
          :global(.megaphone-wiggle) {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}