"use client";

import { useEffect, useState } from "react";

/**
 * LeadGate — wraps a content block (floor plans, pricing, location map,
 * etc.) and blurs it behind an "Unlock" CTA until the visitor has
 * shared their contact info via the advisor form.
 *
 * ─ Two variants ────────────────────────────────────────────────────
 *
 *   variant="block"  (default)
 *     The big overlay card with the prompt + "Unlock details →" pill.
 *     Used for self-contained sections: floor plans, location map.
 *
 *   variant="inline"
 *     Compact in-place blur for a single value inside a larger row —
 *     e.g. just the price cell of a pricing table, leaving carpet
 *     area and configuration visible alongside it. Renders as an
 *     inline-block <button>: blurred children with a small gold
 *     "🔒 Unlock" pill centred ON TOP of the blur (absolute
 *     overlay, not side-by-side). This guarantees the pill is
 *     always painted in full even when the cell is narrower than
 *     the natural content width — the blur clips, the pill never
 *     does. `prompt` is unused in this variant (the pill itself
 *     is the CTA).
 *
 * ─ Two storage keys, EITHER unlocks ────────────────────────────────
 *
 *   storageKey  — per-property, e.g. "lead:lodha-belmondo".
 *                 Written when the form is filled on this specific
 *                 project.
 *
 *   typeKey     — per-property-TYPE, e.g. "lead:type:apartment".
 *                 Written when the form is filled on ANY project of
 *                 the same type. Implements "fill once, browse many".
 *
 * Both keys are re-read whenever the "lead-unlock" custom event fires
 * (dispatched by markLeadCaptured on form submit), so a fill in the
 * advisor modal at the top of the page unblurs every gate below it
 * without a reload.
 */

type Props = {
  storageKey: string;
  typeKey?: string;
  children: React.ReactNode;
  onUnlockClick: () => void;
  /** Block variant only — the heading shown inside the overlay card. */
  prompt?: string;
  /** Default "block"; switch to "inline" for compact cell-level blur. */
  variant?: "block" | "inline";
};

export default function LeadGate({
  storageKey,
  typeKey,
  children,
  prompt,
  onUnlockClick,
  variant = "block",
}: Props) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const slugHit = sessionStorage.getItem(storageKey) === "1";
        const typeHit = typeKey ? sessionStorage.getItem(typeKey) === "1" : false;
        if (slugHit || typeHit) setUnlocked(true);
      } catch {
        /* sessionStorage may be unavailable — stay locked */
      }
    };
    check();
    window.addEventListener("lead-unlock", check);
    return () => window.removeEventListener("lead-unlock", check);
  }, [storageKey, typeKey]);

  // Unlocked state is identical for both variants — just render the
  // children un-touched. The wrapping <span> in the parent provides
  // whatever alignment / colour / size the price cell needs.
  if (unlocked) return <>{children}</>;

  // ─── Inline variant — compact price-cell blur ──────────────────────
  //
  // Visual: [blurred children with a 🔒 Unlock pill centred ON TOP]
  //
  // Why an overlay (not side-by-side flex)?
  //   The previous build laid the blurred content and the pill out as
  //   two flex items in a row. Total button width = blurredWidth + gap
  //   + pillWidth, which on the lg-with-sidebar layout (~175 px cell)
  //   exceeded the column. The card's `overflow-hidden` then clipped
  //   the rightmost child — the pill — off the right edge, leaving
  //   visitors seeing "🔒 UNLOC" with no way to read or tap the rest.
  //
  //   The overlay layout avoids that entirely. The button takes only
  //   the blurred content's width (capped at max-w-full = parent cell
  //   width, since max-width on an inline-block resolves against the
  //   containing block). If the blurred content exceeds the cell, it
  //   overflow-hidden-clips on the right of the BLUR — but the pill
  //   sits absolute-centred on top, so it is always fully painted.
  //
  // Responsiveness
  //   • Cell wider than content (xl, sm full-width)
  //     The button is the natural blur width; the pill is centred on it.
  //   • Cell narrower than content (lg + 380 px sidebar)
  //     The button = cell width; the blur clips on its right; the pill
  //     still sits centred over the visible blur area.
  //   • Mobile (≤ sm)
  //     The pill drops its "Unlock" text and shows just the lock icon
  //     (hidden sm:inline on the label), so the pill is ~22 px wide
  //     and easily fits even when the price cell is only ~140 px in
  //     a 320 px viewport.
  //   • Children with a block child (mobile's <div>(Negotiable*)</div>)
  //     The blurred span becomes multi-line; the pill is centred over
  //     the whole 2-line area via `grid place-items-center`. Looks
  //     intentional rather than misaligned.
  //
  // Other details
  //   • align-baseline keeps the button visually aligned with sibling
  //     cells in a grid row that uses items-baseline (which the
  //     desktop pricing table does).
  //   • The pill has its own gold background + subtle shadow so it
  //     reads cleanly against any colour the blurred content might be.
  //   • `prompt` is unused in this variant — the pill itself is the CTA.
  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onUnlockClick}
        title="Tap to unlock pricing"
        aria-label="Share your details to see the price"
        className="relative inline-block max-w-full align-baseline cursor-pointer group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 transition-transform active:scale-[0.97]"
      >
        <span
          className="inline-block max-w-full overflow-hidden pointer-events-none select-none"
          style={{ filter: "blur(4px) saturate(0.7)" }}
          aria-hidden
        >
          {children}
        </span>
        <span
          className="absolute inset-0 grid place-items-center pointer-events-none"
          aria-hidden
        >
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 rounded-full bg-gold text-white group-hover:bg-gold-hover group-hover:scale-105 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all"
            style={{
              // Drop shadow for depth + 1.5px white ring so the pill
              // stays crisp against any colour the blurred backdrop
              // happens to be (navy price text, slate Negotiable
              // subtitle, etc.). Without the ring it can read as
              // "part of the blur" on darker prices.
              boxShadow:
                "0 1px 3px hsl(var(--navy) / 0.18), 0 0 0 1.5px white",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="hidden sm:inline">Unlock</span>
          </span>
        </span>
      </button>
    );
  }

  // ─── Block variant — original overlay card ─────────────────────────
  //
  // Unchanged behaviour: blurs the whole children block, centered card
  // with prompt + "Unlock details →" CTA on top. Used by floor plans
  // and location/map sections where the whole region needs gating.
  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: "blur(8px) saturate(0.6)" }} aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 grid place-items-center p-4 bg-ivory/30">
        <button
          type="button"
          onClick={onUnlockClick}
          className="card-base px-6 py-5 max-w-[420px] text-center hover:shadow-hover transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 text-gold-hover grid place-items-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="font-sans font-semibold text-[15.5px] text-navy mb-1">{prompt}</div>
          <div className="meta text-slate mb-3">Share your details once to unlock everything on this page.</div>
          <div className="inline-flex items-center gap-2 h-10 px-5 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] shadow-cta">
            Unlock details &rarr;
          </div>
        </button>
      </div>
    </div>
  );
}