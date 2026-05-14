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
  const [intent, setIntent] = useState(variant === "interior" ? "design-consult" : "site-visit");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { advisor } = p;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.length !== 10) return;
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

  return (
    <aside className="bg-navy text-white rounded-card p-6">
      <div className="flex items-center gap-3 pb-5 mb-6 border-b border-white/10">
        <div className="w-11 h-11 rounded-full bg-gold text-white grid place-items-center font-sans font-bold text-[14px] shrink-0">{advisor.initials}</div>
        <div>
          <div className="font-sans font-semibold text-[15px]">{advisor.name}</div>
          <div className="meta text-white/65 inline-flex items-center gap-1">
            {advisor.role}
            <span className="mx-1 text-white/35">&middot;</span>
            <span className="text-gold" aria-hidden>&#9733;</span>
            <span className="tnum">{advisor.rating}</span>
          </div>
        </div>
      </div>

      <h3 className="font-sans font-bold text-[22px] text-white mb-1.5 tracking-tight">{heading}</h3>
      <p className="meta text-white/65 mb-6">{subheading}</p>

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
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Full Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="ad-input" autoComplete="name" />
          </Field>

          <Field label="Phone Number">
            <div className="ad-input flex items-center gap-2 py-0">
              <span className="text-white/55 select-none text-[14.5px] tnum">+91</span>
              <input
                type="tel" required inputMode="numeric" maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98XXX XXXXX"
                className="bg-transparent flex-1 outline-none py-3 tnum text-[14.5px]"
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
                <span className="text-white/55 select-none text-[14.5px] tnum">+91</span>
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98XXX XXXXX"
                  className="bg-transparent flex-1 outline-none py-3 tnum text-[14.5px]"
                />
              </div>
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
              rows={3}
              placeholder={messagePlaceholder}
              className="ad-input resize-none leading-relaxed"
            />
          </Field>

          <button type="submit" className="mt-2 h-12 rounded-pill bg-gold text-white font-sans font-semibold shadow-cta hover:bg-gold-hover transition-colors">{primaryCTA}</button>

          <div className="mt-3 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 meta text-white/55 text-center">
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#128293;</span> 12 enquiries today</span>
            <span className="text-white/30" aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#9201;</span> Avg response 18 min</span>
            <span className="text-white/30" aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>&#128274;</span> Number stays private</span>
          </div>
        </form>
      )}

      <style jsx>{`
        .ad-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 14.5px;
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
        textarea.ad-input { min-height: 84px; }
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