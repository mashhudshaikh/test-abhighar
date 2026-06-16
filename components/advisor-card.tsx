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
  // CHANGED: Default to false (unchecked). Previously defaulted to true. The
  // visitor explicitly opts in to "WhatsApp = same number"; otherwise they
  // type their WhatsApp number — closer to how Indian users actually treat
  // these forms and produces cleaner lead data for the admin side.
  const [sameAsWhatsApp, setSameAsWhatsApp] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  // Config selection — buyers can pick multiple BHK configurations they're
  // interested in (e.g. "2 BHK" AND "3 BHK" to compare). Empty array means
  // "no preference yet", matching the old default behaviour. Only shown
  // for project leads — interior leads don't use this field.
  const [config, setConfig] = useState<string[]>([]);
  // CHANGED: Project variant default is now "selfuse" rather than "site-visit"
  // since the question changed from "Why are you interested?" to "Buying
  // Purpose". Interior variant unchanged. NOTE TO ADMIN: when the admin
  // panel's lead-import / lead-creation forms gain similar fields, mirror
  // these values ("selfuse" / "investment") so customer-side and admin-side
  // stay aligned.
  const [intent, setIntent] = useState(variant === "interior" ? "design-consult" : "selfuse");
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
      // Storage key is namespaced per property slug — i.e. "lead:lodha-belmondo"
      // — so a successful submission on one property does NOT unlock other
      // properties. If a visitor goes from Lodha Belmondo to a Hinjewadi
      // project, that page's LeadGate looks up "lead:<other-slug>", finds
      // nothing, stays blurred, and prompts again. That's the intended
      // behaviour: each property is treated as its own lead.
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

  // CHANGED: Project variant's intent question is now "Buying Purpose" with
  // only two options (Self Use / Investment). Interior variant retains its
  // four options since "buying purpose" doesn't apply when hiring a designer.
  const intentOptions = variant === "interior"
    ? [
        { value: "design-consult", label: "Free design consultation" },
        { value: "cost-estimate",  label: "Get a cost estimate" },
        { value: "see-portfolio",  label: "See past projects" },
        { value: "modular",        label: "Modular kitchen only" },
      ]
    : [
        { value: "selfuse",    label: "Self Use" },
        { value: "investment", label: "Investment" },
      ];

  // CHANGED: Label key changes with the variant — "Buying Purpose" for the
  // project form (the new question), "Why are you interested?" for interior.
  const intentLabel = variant === "interior" ? "Why are you interested?" : "Buying Purpose";

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

          {/* Preferred configuration — multi-select chip toggles. Project
              leads only. Replaces the previous single-select dropdown for
              two reasons: buyers comparing configs (e.g. 2 vs 3 BHK) shouldn't
              be forced to pick one, and the "Any configuration" option was
              also dropped because an empty selection now communicates the
              same intent. State is a string array; chips toggle their own
              value via array splice. */}
          {variant === "project" && configOptions.length > 0 && (
            <Field label="Preferred Configuration">
              <div className="ad-chips flex flex-wrap gap-2">
                {configOptions.map((opt) => {
                  const active = config.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        // Toggle membership — add if absent, remove if present.
                        // Order of selection is preserved (newest at the end)
                        // so the eventual lead payload reads chronologically.
                        setConfig((prev) =>
                          prev.includes(opt) ? prev.filter((c) => c !== opt) : [...prev, opt]
                        );
                      }}
                      aria-pressed={active}
                      className={"ad-chip" + (active ? " ad-chip-active" : "")}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="ad-chips-hint">Tap one or more — optional</div>
            </Field>
          )}

          {/* CHANGED: Project variant shows "Buying Purpose" (Self Use /
              Investment). Interior variant keeps its existing question and
              options. Label is dynamic via intentLabel. */}
          <Field label={intentLabel}>
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

          {/* Submit button. `mt-auto` would push it to the bottom if space
              exists; with the trust row removed there's typically less
              vertical slack so the button sits right below the textarea. */}
          <button
            type="submit"
            disabled={!formValid}
            className="ad-submit rounded-pill bg-gold text-white font-sans font-semibold shadow-cta hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
          >{primaryCTA}</button>

          {/* REMOVED: Trust row ("12 enquiries today · Avg response 18 min ·
              Number stays private"). The numbers were placeholders that
              would look dishonest at scale, and the privacy promise belongs
              in the Privacy Policy footer link rather than asserted under
              every form. CSS rule .ad-trust below has been retained in case
              the row is reintroduced — harmless if unused. */}
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

        /* ─── Chip toggle group (preferred-configuration multi-select) ───
           Each chip is its own button. Inactive chips look like outlined
           pills, active ones fill with gold. Matches the rounded-pill
           aesthetic already used elsewhere on the site so the form feels
           native rather than bolted-on. */
        .ad-chip {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.85);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
          user-select: none;
        }
        .ad-chip:hover {
          background: rgba(255, 255, 255, 0.10);
          border-color: rgba(255, 255, 255, 0.32);
        }
        .ad-chip-active {
          background: hsl(var(--gold));
          border-color: hsl(var(--gold));
          color: white;
          /* Subtle inset highlight echoes the gold CTA button across the site. */
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 6px hsl(var(--gold) / 0.32);
        }
        .ad-chip-active:hover {
          background: hsl(var(--gold-hover));
          border-color: hsl(var(--gold-hover));
        }
        .ad-chips-hint {
          margin-top: 6px;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
        }

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
          .ad-input { padding: 7px 11px; font-size: 13.5px; }
          textarea.ad-input { min-height: 48px; }
          /* Match the input-padding shrink so chips stay proportional to
             the rest of the form on laptop viewports. */
          .ad-chip { padding: 6px 12px; font-size: 12.5px; }
        }

        /* ─── Ultra-compact viewports (≤ 720px tall) — small laptops, zoomed,
              or with the WhatsApp field expanded ───
           Internal scroll on .ad-body becomes the safety net if content
           still exceeds the available space. */
        @media (max-height: 720px) {
          .advisor-card { padding: 0.875rem; }
          .ad-identity { padding-bottom: 0.375rem; margin-bottom: 0.5rem; }
          .ad-heading { font-size: 16px; }
          .ad-subheading { margin-bottom: 0.5rem; }
          .ad-form { gap: 0.375rem; }
          .ad-submit { height: 2.375rem; }
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