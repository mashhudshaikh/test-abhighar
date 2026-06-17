import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/data";

export default function PropertyCard({
  property: p,
  compact = false,
  // ── Compare integration ───────────────────────────────────────────
  // Three optional props that wire up the existing "Compare" pill at
  // the bottom-left of the card image. They're optional so callers
  // that don't care about compare (homepage carousel, featured grid,
  // search results inside the hero, etc.) keep working unchanged —
  // in that case the pill renders as a non-interactive visual chip
  // just like before this prop was added.
  //
  // When `onCompareToggle` is provided the pill becomes a real
  // <button>: clicking toggles `selected`, the checkbox visual
  // flips to a filled checkmark, and `compareDisabled` (set by the
  // parent when the cap of 4 is hit) makes the chip non-clickable
  // with a clarifying tooltip.
  selected = false,
  compareDisabled = false,
  onCompareToggle,
}: {
  property: Property;
  compact?: boolean;
  selected?: boolean;
  compareDisabled?: boolean;
  onCompareToggle?: () => void;
}) {
  const ready = p.status === "ready";
  // Pre-computed so the JSX below stays readable. `effectivelyDisabled`
  // is the OR of "parent says I'm at the cap" AND "I'm not the one
  // already selected" — selected cards must always be unselectable
  // even when the cap is full, otherwise the visitor couldn't remove
  // them to make room.
  const compareInteractive = typeof onCompareToggle === "function";
  const effectivelyDisabled = compareDisabled && !selected;
  return (
    <article className="card-base relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover group">
      {/* ── FULL-CARD CLICK OVERLAY ──────────────────────────────────
          An absolutely-positioned <Link> covering the entire article
          intercepts clicks anywhere on the card and routes to the
          project detail page. Visitors no longer have to find the
          title or the "Know more" button — tapping anywhere works.

          Stacking ladder for this card (lowest → highest):
            z-auto  : image, title, locality text, price
            z-1     : THIS overlay Link
            z-2     : bottom button row (so WhatsApp + Know more stay clickable)
            z-10    : top-left status badge, bottom-left Compare button,
                      bottom-right builder badge

          The image area uses `position: relative` without a z-index,
          which deliberately does NOT create a new stacking context —
          that's what lets the badges with z-10 inside it sit above
          the overlay Link at z-1.

          focus-visible:ring-inset keeps the keyboard focus ring inside
          the card bounds, since the article uses overflow-hidden which
          would otherwise clip a normal outer focus ring. */}
      <Link
        href={`/projects/${p.slug}`}
        aria-label={`View details for ${p.name}`}
        className="absolute inset-0 z-[1] rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
      />
      <div className={`relative overflow-hidden p-3 ${compact ? "h-[200px]" : "h-[260px]"}`}>
        <span
          className={`absolute top-5 left-5 z-10 px-3 py-1 rounded-pill text-[11.5px] font-semibold tracking-wide
            ${ready ? "bg-success text-white" : "bg-[#E08E00] text-white"}`}
        >
          {ready ? "Ready to move" : "Under Construction"}
        </span>
        {/* REMOVED: the ♡ Save button used to sit at top-5 right-5. It was
            cosmetic — no favourites store, no signed-in user, no analytics
            event behind it — so clicking it gave the visitor a UI promise
            we couldn't keep. Pulled until there's a real wishlist feature
            with persistence on the admin side. */}

        {/* ── COMPARE PILL ──────────────────────────────────────────
            Two render modes branched on whether `onCompareToggle` is
            wired by the parent:

            (a) INTERACTIVE — renders as a real <button>. Click toggles
                the parent's compare list. Visual updates between three
                states: unselected (white pill, empty box icon), selected
                (gold pill, filled checkmark, "Added" label), and
                cap-disabled (dimmed white pill, not clickable, tooltip
                explains the cap). stopPropagation on click is defensive
                — the card isn't currently wrapped in a single link, but
                future refactors might add one.

            (b) STATIC — original visual chip, no interactivity. Used
                anywhere PropertyCard is rendered without compare props
                (homepage carousel, featured grids, etc.) so those
                places keep looking the same as before.

            Both modes sit at z-10 in the same position so the layout
            doesn't shift between callers. */}
        {compareInteractive ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (effectivelyDisabled) return;
              onCompareToggle();
            }}
            disabled={effectivelyDisabled}
            aria-pressed={selected}
            aria-label={selected ? "Remove from compare" : "Add to compare"}
            title={
              effectivelyDisabled
                ? "Max 4 properties at a time"
                : selected
                  ? "Remove from compare"
                  : "Add to compare"
            }
            className={
              "absolute bottom-5 left-5 z-10 px-2.5 py-1.5 rounded-pill backdrop-blur-sm text-[11.5px] font-semibold inline-flex items-center gap-1.5 transition-all shadow-card " +
              (selected
                ? "bg-gold text-white ring-2 ring-white/30"
                : effectivelyDisabled
                  ? "bg-white/85 text-slate/50 cursor-not-allowed"
                  : "bg-white/95 text-navy hover:bg-navy hover:text-white")
            }
          >
            {selected ? (
              // Filled white box with a gold checkmark — the "added"
              // affordance. Same 12×12 footprint as the empty box so
              // the chip width doesn't jump between states.
              <span className="w-3 h-3 rounded-[3px] bg-white grid place-items-center" aria-hidden>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            ) : (
              <span className="w-3 h-3 border border-current rounded-[3px]" aria-hidden />
            )}
            {selected ? "Added" : "Compare"}
          </button>
        ) : (
          <span className="absolute bottom-5 left-5 z-10 px-2.5 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-[11.5px] font-semibold text-navy inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-navy/40 rounded-[3px]" aria-hidden />
            Compare
          </span>
        )}

        <span className="absolute bottom-5 right-5 z-10 px-3 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-[11.5px] font-semibold text-navy">
          {p.builder}
        </span>
        <div className="relative w-full h-full overflow-hidden rounded-[18px]">
          <Image
            src={p.thumbnail}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col">
        {/* Title is now a heading, not a Link of its own — the full-card
            overlay Link handles navigation. The group-hover class keeps
            the gold-on-hover behaviour: when the visitor hovers anywhere
            on the card (which triggers the .group hover state on the
            article), the title shifts to gold-hover, signalling that the
            card is interactive. */}
        <h3 className="h3-card text-navy mb-2 group-hover:text-gold-hover transition-colors">
          {p.name}
        </h3>
        <div className="meta text-slate flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
          {p.localityArea}
        </div>
        <div className="meta text-slate mb-3">
          {p.bhkRange} · {p.areaMin} · {p.possessionLabel}
        </div>

        <div className="price text-navy mb-5">
          {p.priceDisplay}{" "}
          <span className="meta text-steel font-normal ml-1">onwards</span>
        </div>

        {/* Bottom action row — relative z-[2] lifts it above the
            full-card overlay Link (which sits at z-1), so the WhatsApp
            anchor opens in a new tab as expected instead of being
            swallowed by the card overlay. "Know more" is kept as its
            own Link to the same destination: it's a sibling of the
            overlay Link (not nested), so no invalid HTML, and it gives
            the visitor a clear visual CTA in addition to the broader
            card click target. */}
        <div className="flex gap-2 mt-auto relative z-[2]">
          <Link
            href={`/projects/${p.slug}`}
            className="flex-1 h-11 rounded-pill bg-navy text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-navy-80 transition-colors"
          >
            Know more
          </Link>

          <a
            href={`https://wa.me/919890122755?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp enquiry"
            className="w-11 h-11 rounded-pill bg-[#25D366] text-white grid place-items-center hover:bg-[#1da851] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2.01 12.05 2.01c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.43 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.42z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}