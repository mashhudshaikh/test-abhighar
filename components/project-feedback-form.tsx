"use client";

import { useState, FormEvent } from "react";

export default function ProjectFeedbackForm({
  propertySlug,
  propertyName,
  onUnlock,
  compact = false,
}: {
  propertySlug: string;
  propertyName: string;
  onUnlock?: () => void;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sameAsWhatsApp, setSameAsWhatsApp] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.length !== 10) return;
    try {
      sessionStorage.setItem("lead:" + propertySlug, "1");
    } catch {}
    setSent(true);
    onUnlock?.();
  }

  if (sent) {
    return (
      <div className="card-base p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-success/15 text-success grid place-items-center text-2xl mb-3" aria-hidden>&check;</div>
        <div className="font-sans font-semibold text-[17px] text-navy mb-1">Thanks, {name.split(" ")[0]}!</div>
        <p className="meta text-slate">Our team will reach out within 30 minutes. Floor plans, location details, and the full brochure are now unlocked below.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={"card-base " + (compact ? "p-5" : "p-6 sm:p-8")}>
      {!compact && (
        <>
          <div className="sec-eyebrow mb-2">Get full project details</div>
          <h3 className="h3-card text-navy mb-2">Tell us a bit about yourself.</h3>
          <p className="meta text-slate mb-6">Get the floor plan, location, brochure, and a callback from our senior advisor for <strong className="text-navy">{propertyName}</strong>.</p>
        </>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Field label="Full Name">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="form-input" autoComplete="name" />
        </Field>
        <Field label="Phone Number">
          <div className="form-input flex items-center gap-2 py-0">
            <span className="text-slate select-none text-[14px] tnum">+91</span>
            <input type="tel" required inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXX XXXXX" className="bg-transparent flex-1 outline-none py-3 tnum text-[14px]" autoComplete="tel-national" />
          </div>
        </Field>
      </div>

      <label className="flex items-center gap-2 cursor-pointer mb-4">
        <input type="checkbox" checked={sameAsWhatsApp} onChange={(e) => setSameAsWhatsApp(e.target.checked)} className="accent-gold w-4 h-4" />
        <span className="meta text-slate">My WhatsApp number is the same as above</span>
      </label>

      {!sameAsWhatsApp && (
        <div className="mb-4">
          <Field label="WhatsApp Number">
            <div className="form-input flex items-center gap-2 py-0">
              <span className="text-slate select-none text-[14px] tnum">+91</span>
              <input type="tel" inputMode="numeric" maxLength={10} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXX XXXXX" className="bg-transparent flex-1 outline-none py-3 tnum text-[14px]" />
            </div>
          </Field>
        </div>
      )}

      <Field label="Anything specific you'd like to know? (optional)">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="e.g. corner unit availability, possession timeline, EMI options" className="form-input resize-none" />
      </Field>

      <button type="submit" className="mt-5 w-full sm:w-auto h-12 px-7 rounded-pill bg-gold text-white font-sans font-semibold text-[14px] shadow-cta hover:bg-gold-hover transition-colors">
        Send & unlock full details &rarr;
      </button>
      <p className="meta text-slate/70 mt-3">By submitting, you agree to be contacted by our team. Your number stays private and is never shared.</p>

      <style jsx>{`
        .form-input {
          width: 100%;
          background: white;
          border: 1px solid hsl(var(--navy) / 0.12);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 14px;
          color: hsl(var(--navy));
          outline: none;
          transition: border-color .25s;
        }
        .form-input::placeholder { color: hsl(var(--slate) / 0.6); }
        .form-input:focus { border-color: hsl(var(--gold)); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-sans font-bold uppercase tracking-[0.12em] text-[#6B4F23]">{label}</span>
      {children}
    </label>
  );
}