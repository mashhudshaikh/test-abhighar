"use client";
import { useEffect, useState, useRef, FormEvent } from "react";
import { motion, useAnimate, transform } from "framer-motion";
import Reveal from "./ui/reveal";
import MagneticButton from "./ui/magnetic-button";

const MAX = 100;

export default function FeedbackForm() {
  const [name, setName]   = useState("");
  const [prop, setProp]   = useState("");
  const [msg, setMsg]     = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const remaining = MAX - msg.length;
  const [counterRef, animate] = useAnimate();

  // Color: 6+ chars left = calm steel; ≤2 = warning gold
  const mapColor = transform([2, 6], ["#B89968", "#8FA5BD"]);
  const colorValue = mapColor(remaining);

  // Spring scale animation when entering "warning zone" — exact port of user's snippet
  useEffect(() => {
    if (remaining > 6 || !counterRef.current) return;
    const mapVel = transform([0, 5], [50, 0]);
    animate(
      counterRef.current,
      { scale: 1 },
      {
        type: "spring",
        velocity: mapVel(remaining),
        stiffness: 700,
        damping: 80,
      },
    );
  }, [remaining, animate, counterRef]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName(""); setProp(""); setMsg(""); setRating(0);
    }, 400);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section className="section bg-white rounded-[28px] lg:rounded-[48px] mx-3 lg:mx-4">
      <div className="container-x">
        <Reveal>
          <div className="card-base p-8 lg:p-12 grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-start relative overflow-hidden">
            <span aria-hidden className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.20), transparent 70%)", filter: "blur(40px)" }} />
            <span aria-hidden className="absolute -bottom-24 -left-16 w-[240px] h-[240px] rounded-full opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--brass) / 0.20), transparent 70%)", filter: "blur(50px)" }} />

            <div className="relative z-10">
              <div className="sec-eyebrow mb-4">Share Your Story</div>
              <h3 className="h2-section text-navy mb-3">
                Tell us about <em className="text-gold italic">your home journey.</em>
              </h3>
              <p className="body-base text-slate max-w-[300px]">
                Found your home through us? Your story helps another family find theirs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="fb-name" label="Your Name">
                  <input id="fb-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Kulkarni" autoComplete="name" className="fb-input" />
                </Field>
                <Field id="fb-prop" label="Property You Bought">
                  <input id="fb-prop" type="text" value={prop} onChange={(e) => setProp(e.target.value)}
                    placeholder="Lodha Belmondo, Baner" className="fb-input" />
                </Field>
              </div>

              <Field label="Your Rating">
                <div className="flex gap-0.5" onMouseLeave={() => setHovered(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button"
                      onMouseEnter={() => setHovered(n)} onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className={`w-10 h-10 grid place-items-center text-2xl leading-none transition-all duration-300
                                  ${(hovered ? n <= hovered : n <= rating) ? "text-brass scale-110" : "text-navy/20 scale-100"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </Field>

              <Field id="fb-msg" label="Your Story" hint="Max 100 characters">
                <div className="relative">
                  <textarea
                    id="fb-msg" maxLength={MAX} value={msg} onChange={(e) => setMsg(e.target.value)}
                    placeholder="Share a sentence or two about your experience with us..."
                    rows={4}
                    className="fb-input resize-y min-h-[110px] pr-[90px] pb-[54px] leading-[1.55]"
                  />
                  <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-pill bg-white border border-navy/10 shadow-[0_4px_12px_hsl(var(--navy)/0.10)] flex items-center gap-1.5 tnum">
                    <motion.span
                      ref={counterRef as never}
                      style={{ color: colorValue, willChange: "transform", display: "inline-block", minWidth: "1.6em", textAlign: "right" }}
                      className="font-sans font-bold text-[15px]"
                    >
                      {remaining}
                    </motion.span>
                    <span className="text-slate/50 text-[13px] font-medium">/</span>
                    <span className="text-slate text-[13px] font-medium opacity-70">{MAX}</span>
                  </div>
                </div>
              </Field>

              <div className="flex items-center gap-4 flex-wrap">
                <MagneticButton type="submit" className="btn-primary">
                  Submit Story
                  <span aria-hidden>→</span>
                </MagneticButton>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-5 py-3 rounded-card border body-base font-medium text-navy"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--gold-light)), hsl(var(--gold) / 0.18))",
                      borderColor: "hsl(var(--gold) / 0.30)",
                    }}
                    role="status" aria-live="polite"
                  >
                    <span className="w-7 h-7 rounded-full bg-gold text-white grid place-items-center text-sm">✓</span>
                    <span>Thank you, <strong>{name || "friend"}</strong>! Your story is on its way.</span>
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>

      <style jsx global>{`
        .fb-input {
          width: 100%;
          background: hsl(var(--ivory));
          border: 1px solid hsl(var(--navy) / 0.08);
          border-radius: 14px;
          padding: 14px 16px;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 15px;
          color: hsl(var(--navy));
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: border-color .3s, background .3s, box-shadow .3s;
        }
        .fb-input::placeholder { color: hsl(var(--steel)); font-weight: 400; }
        .fb-input:focus {
          outline: none;
          border-color: hsl(var(--gold));
          background: white;
          box-shadow: 0 0 0 4px hsl(var(--gold) / 0.12);
        }
      `}</style>
    </section>
  );
}

function Field({ id, label, hint, children }: { id?: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow text-gold flex justify-between items-baseline">
        {label}
        {hint && <span className="meta text-slate font-medium normal-case tracking-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
