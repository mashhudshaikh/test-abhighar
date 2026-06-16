"use client";

import { useEffect, useState } from "react";

// Pattern check shared with the admin panel. Covers watch?v=, youtu.be/,
// embed/, shorts/, and the m. mobile subdomain.
function isValidYoutubeUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/.test(trimmed);
}

type OfferBannerProps = {
  text: string;
  storageKey: string;
  // Optional. When present and valid, a YouTube play button appears on
  // the right side of the banner. When absent or invalid, nothing renders.
  youtubeUrl?: string;
};

export default function OfferBanner(props: OfferBannerProps) {
  const { text, storageKey, youtubeUrl } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null;

  const showYoutube = isValidYoutubeUrl(youtubeUrl);

  return (
    <div className="offer-banner-root relative flex items-center mb-5 overflow-hidden border shadow-[0_4px_18px_hsl(var(--gold)/0.22)]">

      {/* LEFT BLOCK: megaphone icon + SPECIAL OFFER stamp */}
      <div className="ob-left-block shrink-0 relative z-[2]">
        <div className="ob-megaphone-wrap" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-[#DC2626] icon-pulse-ring" />
          <span
            className="ob-megaphone-circle"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
              boxShadow: "0 3px 10px rgba(220,38,38,0.40), inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)",
            }}
          >
            <svg className="megaphone-wiggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </span>
        </div>

        <span className="so-stamp">
          <svg className="so-burst" width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.55" aria-hidden>
            <line x1="50" y1="2" x2="50" y2="14" />
            <line x1="50" y1="86" x2="50" y2="98" />
            <line x1="2" y1="50" x2="14" y2="50" />
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

      {/* CENTER: body text */}
      <p className="ob-body relative z-[2]">
        {text} <span className="banner-emphasis">Save up to ₹3 L</span>
      </p>

      {/* YouTube play button — single <a> wrapping the logo image.
          Opening <a kept on the same line as the conditional paren so paste
          can't drop it. */}
      {showYoutube && youtubeUrl ? (<a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch this offer on YouTube" title="Watch on YouTube" className="yt-cta relative z-[2] shrink-0">
        <span className="yt-pulse" aria-hidden />
        <span className="yt-frame">
          <img src="/youtube-icon.png" alt="YouTube" width={36} height={25} className="yt-img" loading="lazy" decoding="async" />
        </span>
      </a>) : null}

      {/* RIGHT: dismiss X */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss offer"
        className="ob-dismiss relative z-[2] shrink-0 rounded-full grid place-items-center text-[#142347] bg-white/55 hover:bg-white/90 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <style jsx>{`
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           Responsive design strategy — five viewport ranges:

           1. Ultra-narrow (≤ 360px) — iPhone SE, old Androids
              Tightest padding, smallest fonts, megaphone shrinks slightly,
              gaps tighten. Body text allowed to wrap to 2 lines.
           2. Phone (361 – 639px)
              Standard mobile layout. Slightly more breathing room.
           3. Tablet portrait (640 – 1023px) — sm: in Tailwind terms
              Full stamp padding, larger megaphone, single-line body.
           4. Tablet landscape / laptop (1024 – 1279px) — lg:
              Identical to tablet portrait. Banner doesn't need to grow.
           5. Large desktop (≥ 1280px) — xl:
              Slight horizontal padding bump so the banner feels at home
              in a wide container.

           Inner-row gap, padding, font sizes and pill / button dimensions
           all scale with these breakpoints. The dismiss X and YouTube CTA
           never shrink so smaller than tap-target friendly (24×24 min).
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        /* === BANNER SHELL — padding, gap, border-radius scale with width === */
        .offer-banner-root {
          /* Default = ultra-narrow phones */
          gap: 8px;
          padding: 10px 10px;
          border-radius: 16px;
          background: linear-gradient(90deg, #fbf6ee 0%, #f5efe2 25%, #efe6d2 50%, #f5efe2 75%, #fbf6ee 100%);
          background-size: 240% 100%;
          border-color: hsl(var(--navy) / 0.15);
          animation: bgDrift 9s ease-in-out infinite, slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 380px) {
          .offer-banner-root {
            gap: 10px;
            padding: 12px 12px;
            border-radius: 20px;
          }
        }
        @media (min-width: 640px) {
          .offer-banner-root {
            gap: 14px;
            padding: 14px 20px;
            border-radius: 9999px; /* sm:rounded-pill */
          }
        }
        @media (min-width: 1280px) {
          .offer-banner-root {
            gap: 16px;
            padding: 16px 24px;
          }
        }
        .offer-banner-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.45) 50%, transparent 65%);
          transform: translateX(-100%) skewX(-15deg);
          animation: shimmerSweep 6s ease-in-out infinite;
          animation-delay: 1.5s;
          pointer-events: none;
          z-index: 1;
        }

        /* === LEFT BLOCK: megaphone + SPECIAL OFFER stamp === */
        .ob-left-block {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        @media (min-width: 380px) { .ob-left-block { gap: 8px; } }
        @media (min-width: 640px) { .ob-left-block { gap: 10px; } }

        .ob-megaphone-wrap {
          position: relative;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
        }
        @media (min-width: 380px) { .ob-megaphone-wrap { width: 36px; height: 36px; } }
        @media (min-width: 640px) { .ob-megaphone-wrap { width: 44px; height: 44px; } }

        .ob-megaphone-circle {
          position: relative;
          z-index: 1;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }
        @media (min-width: 380px) { .ob-megaphone-circle { width: 28px; height: 28px; } }
        @media (min-width: 640px) { .ob-megaphone-circle { width: 36px; height: 36px; } }

        .so-stamp {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 9px 5px 7px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
          border: 1.5px solid #ffd700;
          border-radius: 100px;
          color: white;
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          white-space: nowrap;
          line-height: 1;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1), 0 2px 8px rgba(220, 38, 38, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }
        @media (min-width: 380px) {
          .so-stamp {
            gap: 5px;
            padding: 6px 11px 6px 9px;
            font-size: 11px;
            letter-spacing: 0.12em;
          }
        }
        @media (min-width: 640px) {
          .so-stamp {
            padding: 8px 14px 8px 12px;
            font-size: 13px;
            letter-spacing: 0.14em;
            gap: 7px;
            border-width: 2px;
            box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12), 0 3px 12px rgba(220, 38, 38, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          }
        }

        .so-burst { position: absolute; inset: -9px; pointer-events: none; animation: burstSpin 40s linear infinite; }
        @media (min-width: 640px) { .so-burst { inset: -11px; } }
        .so-star { display: inline-grid; place-items: center; width: 12px; height: 12px; color: #ffd700; filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.55)); position: relative; z-index: 2; }
        @media (min-width: 380px) { .so-star { width: 13px; height: 13px; } }
        @media (min-width: 640px) { .so-star { width: 15px; height: 15px; } }
        .so-label { position: relative; z-index: 2; }

        /* === BODY TEXT — wraps to max 2 lines on small viewports, single on sm+ === */
        .ob-body {
          flex: 1 1 0;
          min-width: 0;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          color: #142347;
          line-height: 1.35;
          /* Allow 2-line wrap on phones to prevent overflow with long copy. */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (min-width: 380px) {
          .ob-body {
            font-size: 12px;
            line-height: 1.4;
          }
        }
        @media (min-width: 640px) {
          .ob-body {
            font-size: 13.5px;
            -webkit-line-clamp: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
            overflow: hidden;
          }
        }
        @media (min-width: 1024px) {
          /* At laptop widths there's room for the full text uninterrupted. */
          .ob-body {
            white-space: normal;
            text-overflow: clip;
          }
        }
        .banner-emphasis { font-weight: 800; white-space: nowrap; }

        /* === YouTube CTA — sized to roughly match megaphone+stamp height === */
        .yt-cta {
          display: grid;
          place-items: center;
          width: 32px;
          height: 26px;
          isolation: isolate;
          transition: transform 0.2s ease;
        }
        @media (min-width: 380px) {
          .yt-cta { width: 36px; height: 30px; }
        }
        @media (min-width: 640px) {
          .yt-cta { width: 44px; height: 34px; }
        }
        @media (min-width: 1280px) {
          .yt-cta { width: 48px; height: 36px; }
        }
        .yt-cta:hover { transform: scale(1.08); }
        .yt-cta:focus-visible {
          outline: 2px solid #ffd700;
          outline-offset: 3px;
          border-radius: 10px;
        }
        .yt-pulse {
          position: absolute;
          inset: -1px;
          border-radius: 10px;
          background: rgba(220, 38, 38, 0.30);
          z-index: 0;
          animation: ytPulse 2.4s ease-out infinite;
          animation-delay: 0.8s;
          pointer-events: none;
        }
        .yt-frame {
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          padding: 2px 4px;
          border-radius: 7px;
          background: white;
          border: 1px solid #ffd700;
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.08), 0 2px 6px rgba(0, 0, 0, 0.10), inset 0 1px 1px rgba(255, 255, 255, 0.6);
        }
        @media (min-width: 380px) {
          .yt-frame {
            padding: 3px 5px;
            border-radius: 8px;
            border-width: 1.5px;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08), 0 2px 6px rgba(0, 0, 0, 0.10), inset 0 1px 1px rgba(255, 255, 255, 0.6);
          }
        }
        @media (min-width: 640px) {
          .yt-frame {
            border-width: 2px;
            box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.10), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.6);
          }
        }
        .yt-img {
          width: auto;
          height: 14px;
          display: block;
        }
        @media (min-width: 380px) { .yt-img { height: 16px; } }
        @media (min-width: 640px) { .yt-img { height: 20px; } }
        @media (min-width: 1280px) { .yt-img { height: 22px; } }

        /* === DISMISS X === */
        .ob-dismiss {
          width: 22px;
          height: 22px;
        }
        @media (min-width: 380px) { .ob-dismiss { width: 24px; height: 24px; } }
        @media (min-width: 640px) { .ob-dismiss { width: 28px; height: 28px; } }

        @keyframes bgDrift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shimmerSweep { 0%, 55%, 100% { transform: translateX(-100%) skewX(-15deg); } 80% { transform: translateX(220%) skewX(-15deg); } }
        @keyframes burstSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseRing { 0% { transform: scale(0.85); opacity: 0.55; } 70% { transform: scale(1.25); opacity: 0; } 100% { transform: scale(1.25); opacity: 0; } }
        @keyframes ytPulse {
          0% { transform: scale(0.95); opacity: 0.55; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes megaphoneWiggle { 0%, 70%, 100% { transform: rotate(0deg); } 74% { transform: rotate(-10deg); } 78% { transform: rotate(8deg); } 82% { transform: rotate(-6deg); } 86% { transform: rotate(4deg); } 92% { transform: rotate(0deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        :global(.icon-pulse-ring) { animation: pulseRing 2.4s ease-out infinite; }
        :global(.megaphone-wiggle) { transform-origin: 70% 55%; animation: megaphoneWiggle 3s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .offer-banner-root, .offer-banner-root::before, .so-burst, .yt-pulse, :global(.icon-pulse-ring), :global(.megaphone-wiggle) { animation: none !important; }
        }
      `}</style>
    </div>
  );
}