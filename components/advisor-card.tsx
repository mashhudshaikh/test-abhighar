"use client";

import { useState, FormEvent } from "react";
import { Property } from "@/lib/data";

interface Props {
  property: Property;
  variant?: "project" | "interior";
}

export default function AdvisorCard({ property: p, variant = "project" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sameAsWhatsApp, setSameAsWhatsApp] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  // Config dropdown — only shown for project leads (interior leads aren't
  // about a specific BHK in the listing). Defaults to "" meaning the user
  // didn't pick one yet, which is allowed since this is an optional hint
  // for the advisor, not a hard filter.
  const [config, setConfig] = useState("");
  const [intent, setIntent] = useState(variant === "interior" ? "design-consult" : "site-visit");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { advisor } = p;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.length !== 10) return;
    // When WhatsApp differs from the phone number, it's mandatory and must
    // be a complete 10-digit number — block submission otherwise.
    if (!sameAsWhatsApp && whatsapp.length !== 10) return;
    setSent(true);

    try {
      const slug = (p as Property & { slug?: string }).slug;
      if (slug) sessionStorage.setItem("lead:" + slug, "1");
      if (variant === "interior") sessionStorage.setItem("lead:interiors", "1");
    } catch { /* sessionStorage may be unavailable */ }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("lead-unlock"));
    }
  }

  const heading = variant === "interior" ? "Get a free design quote" : "Get the best price";
  const subheading = variant === "interior" ? "Avg designer response: 18 min" : "Avg advisor response: 18 min";
  const primaryCTA = variant === "interior" ? "Book Free Consultation" : "Schedule a Site Visit";

  const intentOptions = variant === "interior"
    ? [
        { value: "design-consult", label: "Free design consultation" },
        { value: "cost-estimate",  label: "Get a cost estimate" },
        { value: "see-portfolio",  label: "See past projects" },
        { value: "modular",        label: "Modular kitchen only" },
      ]
    : [
        { value: "site-visit", label: "Schedule a site visit" },
        { value: "pricing",    label: "Get the latest pricing" },
        { value: "brochure",   label: "Just send me the brochure" },
        { value: "loan",       label: "EMI options consultation" },
      ];

  const messagePlaceholder = variant === "interior"
    ? "e.g. preferred style, must-have features, timeline"
    : "e.g. corner unit availability, possession, EMI options";

  // Config options come directly from this property's bhkConfigs array.
  // The advisor sees the buyer's actual interest ("3 BHK") rather than
  // having to guess from the project's full range. Fallback to empty if
  // a property is somehow missing configs — the dropdown then just has
  // the "Any configuration" placeholder and nothing else.
  const configOptions = (p.bhkConfigs ?? [])
    .map((c) => c.config)
    .filter((v, i, arr) => v && arr.indexOf(v) === i);  // dedupe + drop empty

  // Single source of truth for "is the form submittable right now". Mirrors the
  // submit() guard so the CTA button can visibly disable when fields are missing.
  const formValid =
    name.trim().length > 0 &&
    phone.length === 10 &&
    (sameAsWhatsApp || whatsapp.length === 10);

  return (
    <aside className="advisor-card bg-navy text-white rounded-card flex flex-col">
      {/* Identity strip — never scrolls; the user can always see who they're talking to. */}
      <div className="ad-identity flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gold text-white grid place-items-center font-sans font-bold text-[13px] shrink-0">{advisor.initials}</div>
        <div>
          <div className="font-sans font-semibold text-[14px] leading-tight">{advisor.name}</div>
          <div className="meta text-white/65 inline-flex items-center gap-1 leading-tight mt-0.5">
            {advisor.role}
            <span className="mx-1 text-white/35">&middot;</span>
            <span className="text-gold" aria-hidden>&#9733;</span>
            <span className="tnum">{advisor.rating}</span>
          </div>
        </div>
      </div>

      <h3 className="ad-heading font-sans font-bold text-white tracking-tight leading-tight shrink-0">{heading}</h3>
      <p className="ad-subheading meta text-white/65 shrink-0">{subheading}</p>

      {/* Body — flex-1 so on ultra-short viewports it can take remaining space and scroll
          internally as a last resort. On most viewports the content fits naturally and
          no scroll appears. */}
      <div className="ad-body flex-1 min-h-0 flex flex-col">
        {sent ? (
        <div className="rounded-panel bg-success/20 border border-success/40 p-5 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-success/30 grid place-items-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="font-sans font-bold text-[17px] mb-1.5">Got it, {name.split(" ")[0] || "friend"}!</div>
          <div className="meta text-white/80 mb-1">{advisor.name} will reach out within 30 minutes.</div>
          <div className="meta text-gold font-semibold">&check; Full details unlocked below</div>
        </div>
      ) : (
        <form onSubmit={submit} className="ad-form flex flex-col">
          <Field label="Full Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="ad-input" autoComplete="name" />
          </Field>

          <Field label="Phone Number">
            <div className="ad-input flex items-center gap-2 py-0">
              <span className="text-white/55 select-none text-[14px] tnum">+91</span>
              <input
                type="tel" required inputMode="numeric" maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98XXX XXXXX"
                className="bg-transparent flex-1 outline-none py-2.5 tnum text-[14px]"
                autoComplete="tel-national"
              />
            </div>
          </Field>

          <label className="flex items-center gap-2 cursor-pointer -mt-1">
            <input type="checkbox" checked={sameAsWhatsApp} onChange={(e) => setSameAsWhatsApp(e.target.checked)} className="accent-gold w-4 h-4" />
            <span className="meta text-white/80">My WhatsApp number is the same as above</span>
          </label>

          {!sameAsWhatsApp && (
            <Field label="WhatsApp Number">
              <div className="ad-input flex items-center gap-2 py-0">
                <span className="text-white/55 select-none text-[14px] tnum">+91</span>
                <input
                  type="tel" required inputMode="numeric" maxLength={10}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98XXX XXXXX"
                  className="bg-transparent flex-1 outline-none py-2.5 tnum text-[14px]"
                  autoComplete="tel-national"
                />
              </div>
            </Field>
          )}

          {/* Config dropdown — project leads only. Pulled from this property's
              bhkConfigs so the buyer is picking from configs that actually exist.
              Optional: the first item is a placeholder, and form submission
              doesn't require a selection. */}
          {variant === "project" && configOptions.length > 0 && (
            <Field label="Preferred Configuration">
              <select value={config} onChange={(e) => setConfig(e.target.value)} className="ad-input cursor-pointer">
                <option value="">Any configuration</option>
                {configOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Why are you interested?">
            <select value={intent} onChange={(e) => setIntent(e.target.value)} className="ad-input cursor-pointer">
              {intentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          <Field label="Anything specific? (optional)">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder={messagePlaceholder}
              className="ad-input resize-none leading-relaxed"
            />
          </Field>

          {/* Submit button is part of the form's scrollable region but its own
              row — `mt-auto` pushes it to the bottom if extra space is available,
              keeping the layout balanced on tall viewports. */}
          <button
            type="submit"
            disabled={!formValid}
            className="ad-submit rounded-pill bg-gold text-white font-sans font-semibold shadow-cta hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
          >{primaryCTA}</button>

          <div className="ad-trust border-t border-white/10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 meta text-white/55 text-center">
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#128293;</span> 12 enquiries today</span>
            <span className="text-white/30" aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#9201;</span> Avg response 18 min</span>
            <span className="text-white/30" aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#128274;</span> Number stays private</span>
          </div>
        </form>
      )}
      </div>

      <style jsx>{`
        /* ─── Card root ───
           On small screens (< 1024px) the card is in normal page flow — let
           the page handle scrolling. Above that breakpoint the sidebar is
           usually sticky and the card must respect viewport height. */
        .advisor-card {
          padding: 1.25rem;
        }

        /* ─── Default (tall) viewports — comfortable spacing ─── */
        .ad-identity { padding-bottom: 0.75rem; margin-bottom: 1rem; }
        .ad-heading { font-size: 19px; margin-bottom: 0.25rem; }
        .ad-subheading { margin-bottom: 1rem; }
        .ad-form { gap: 0.625rem; }
        .ad-submit { height: 2.75rem; margin-top: 0.5rem; }
        .ad-trust { margin-top: 0.5rem; padding-top: 0.75rem; font-size: 11px; }

        .ad-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 9px 12px;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
        }
        .ad-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .ad-input:focus,
        .ad-input:focus-within {
          border-color: hsl(var(--gold));
          background: rgba(255, 255, 255, 0.08);
        }
        select.ad-input option { color: hsl(var(--navy)); background: white; }
        textarea.ad-input { min-height: 56px; }

        /* ─── Desktop: sticky card respects viewport height ───
           At ≥1024px the card is typically sticky in a sidebar — cap its height
           and let the body scroll internally only if its content overflows. The
           cap leaves room for the site header (4rem) plus breathing space (2rem). */
        @media (min-width: 1024px) {
          .advisor-card {
            max-height: calc(100vh - 6rem);
          }
          .ad-body {
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
          }
          .ad-body::-webkit-scrollbar { width: 5px; }
          .ad-body::-webkit-scrollbar-track { background: transparent; }
          .ad-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.18);
            border-radius: 3px;
          }
          .ad-body::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.28);
          }
        }

        /* ─── Compact viewports (≤ 900px tall) — typical laptop ───
           Tighter padding & gaps to fit everything without scrolling. The
           savings: ~10px on identity strip, ~6px on heading/subheading,
           ~8px on form gaps, ~12px on input padding × 5 inputs ≈ 80-100px total. */
        @media (max-height: 900px) {
          .advisor-card { padding: 1rem; }
          .ad-identity { padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
          .ad-heading { font-size: 17px; margin-bottom: 0.125rem; }
          .ad-subheading { margin-bottom: 0.75rem; }
          .ad-form { gap: 0.5rem; }
          .ad-submit { height: 2.5rem; margin-top: 0.375rem; }
          .ad-trust { margin-top: 0.375rem; padding-top: 0.5rem; font-size: 10.5px; }
          .ad-input { padding: 7px 11px; font-size: 13.5px; }
          textarea.ad-input { min-height: 48px; }
        }

        /* ─── Ultra-compact viewports (≤ 720px tall) — small laptops, zoomed,
              or with the WhatsApp field expanded ───
           Drop the trust-signal row entirely (it's a nice-to-have, not the
           transaction). Drop the optional message field's bottom margin.
           Internal scroll on .ad-body becomes the safety net if content
           still exceeds the available space. */
        @media (max-height: 720px) {
          .advisor-card { padding: 0.875rem; }
          .ad-identity { padding-bottom: 0.375rem; margin-bottom: 0.5rem; }
          .ad-heading { font-size: 16px; }
          .ad-subheading { margin-bottom: 0.5rem; }
          .ad-form { gap: 0.375rem; }
          .ad-submit { height: 2.375rem; }
          .ad-trust { display: none; }
          textarea.ad-input { min-height: 40px; }
        }
      `}</style>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-gold">{label}</span>
      {children}
    </label>
  );
}