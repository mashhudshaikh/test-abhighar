"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Reveal from "./ui/reveal";

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function Tools() {
  const [amt, setAmt]   = useState(5_000_000);
  const [rate, setRate] = useState(8.5);
  const [yrs, setYrs]   = useState(20);

  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    const n = yrs * 12;
    return (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [amt, rate, yrs]);

  return (
    <section className="bg-white rounded-[24px] sm:rounded-[28px] lg:rounded-[48px] mx-3 lg:mx-4 my-8 sm:my-10 lg:my-14 py-10 sm:py-14 lg:py-20 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-200px] w-[400px] sm:w-[560px] h-[400px] sm:h-[560px] rounded-full blur-[80px] opacity-60 pointer-events-none animate-drift-2" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.30), transparent 70%)" }} />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          <Reveal>
            <div className="sec-eyebrow mb-3 sm:mb-4">Smart Tools</div>
            <h2 className="h2-section text-navy">
              Plan with <em className="text-gold italic">clarity.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">From EMI maths to RERA paperwork &mdash; make your buying journey transparent and unhurried.</p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-4 sm:gap-5 lg:gap-6">

          {/* EMI Calculator */}
          <Reveal className="md:col-span-2 lg:col-span-1">
            <div className="card-base p-5 sm:p-7 lg:p-9 flex flex-col h-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-card bg-gold text-white grid place-items-center mb-4 sm:mb-6 shadow-cta relative shrink-0">
                <span aria-hidden className="absolute inset-0 rounded-card bg-gradient-to-b from-white/30 to-transparent" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                  <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="12" y1="14" x2="14" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/>
                </svg>
              </div>
              <div className="h3-card text-navy mb-2">EMI Calculator</div>
              <p className="body-base text-slate mb-5 sm:mb-6">Drag the sliders to find a monthly payment that fits your comfort range.</p>

              <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-5">
                <Field label="Loan Amount" value={fmt(amt)}>
                  <input type="range" min={500_000} max={100_000_000} step={100_000} value={amt} onChange={(e) => setAmt(+e.target.value)} className="emi-range" />
                </Field>
                <Field label="Interest Rate" value={rate.toFixed(1) + "%"}>
                  <input type="range" min={6} max={15} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="emi-range" />
                </Field>
                <Field label="Tenure" value={yrs + " yrs"}>
                  <input type="range" min={5} max={30} step={1} value={yrs} onChange={(e) => setYrs(+e.target.value)} className="emi-range" />
                </Field>
              </div>

              <div className="rounded-card p-4 sm:p-5 sm:px-6 flex flex-col xs:flex-row sm:flex-row justify-between items-start xs:items-center sm:items-center gap-1.5 sm:gap-3 relative overflow-hidden text-white shadow-cta" style={{ background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-hover)))" }}>
                <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                <span className="eyebrow text-white/95 relative z-10">Monthly EMI</span>
                <span className="font-sans font-bold text-[22px] sm:text-[26px] lg:text-[28px] tnum tracking-tight relative z-10 break-all">{fmt(emi)}</span>
              </div>
            </div>
          </Reveal>

          {/* Zero Brokerage */}
          <Reveal delay={0.08}>
            <div className="card-base p-5 sm:p-7 lg:p-9 flex flex-col h-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-card bg-navy text-white grid place-items-center mb-4 sm:mb-6 shadow-card shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                  <circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8M8 8h8v8"/>
                </svg>
              </div>
              <div className="h3-card text-navy mb-2">Zero Brokerage</div>
              <p className="body-base text-slate mb-5 sm:mb-6">As a registered channel partner, our fees come from developers &mdash; never from you.</p>
              <ul className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                {["No buyer-side brokerage, ever","Same builder rates, often better","Honest, advisory-led guidance","Documentation end-to-end"].map((t) => (
                  <li key={t} className="body-base text-slate flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-gold grid place-items-center text-white text-[10px] shrink-0 mt-1">&check;</span>
                    {t}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="self-start mt-auto inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-pill bg-navy text-ivory meta font-semibold transition-all hover:bg-navy-80 hover:translate-x-1">
                How it works &rarr;
              </a>
            </div>
          </Reveal>

          {/* Legal & Documentation */}
          <Reveal delay={0.16}>
            <div className="card-base p-5 sm:p-7 lg:p-9 flex flex-col h-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-card grid place-items-center mb-4 sm:mb-6 text-white shadow-card shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--brass)), hsl(var(--gold-light)))" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                  <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="h3-card text-navy mb-2">Legal &amp; Documentation</div>
              <p className="body-base text-slate mb-5 sm:mb-6">From RERA checks to registration day &mdash; our in-house legal team makes sure every paper is in order before you sign.</p>
              <ul className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                {[
                  "RERA & title verification",
                  "Sale agreement vetting",
                  "Stamp duty & registration",
                  "Post-purchase mutation help",
                ].map((t) => (
                  <li key={t} className="body-base text-slate flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-gold grid place-items-center text-white text-[10px] shrink-0 mt-1">&check;</span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/#contact" className="self-start mt-auto inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-pill bg-navy text-ivory meta font-semibold transition-all hover:bg-navy-80 hover:translate-x-1">
                Talk to legal team &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        .emi-range {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: hsl(var(--gold-light));
          border-radius: 999px;
          outline: none;
          touch-action: pan-y;
        }
        .emi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: hsl(var(--gold)); cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px hsl(var(--gold) / 0.45);
        }
        .emi-range::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: hsl(var(--gold)); cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px hsl(var(--gold) / 0.45);
        }
      `}</style>
    </section>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline gap-2">
        <span className="meta text-slate font-semibold">{label}</span>
        <span className="font-sans font-bold text-[15px] sm:text-[18px] text-navy tnum">{value}</span>
      </div>
      {children}
    </div>
  );
}