"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import SplitText from "./ui/split-text";
import MagneticButton from "./ui/magnetic-button";
import Counter from "./ui/counter";

const SLIDES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80",
];

const SLIDE_DURATION = 6000;

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollY } = useScroll();

  const [slide, setSlide] = useState(0);
  const [propertyType, setPropertyType] = useState("Apartment");
  const [locality, setLocality] = useState("Hinjewadi");
  const [budget, setBudget] = useState("₹50L – ₹1 Cr");
  const [bhk, setBhk] = useState("2 BHK");
  const [possession, setPossession] = useState("Ready to Move");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  function handleSearch() {
    const slug = locality.toLowerCase().replace(/\s+/g, "").replace("park", "");
    router.push("/localities/" + slug);
  }

  const sSpring = { damping: 25, stiffness: 100, mass: 0.5 };
  const photoY = useSpring(useTransform(scrollY, [0, 900], [0, 240]), sSpring);
  const blobsY = useSpring(useTransform(scrollY, [0, 900], [0, 120]), sSpring);
  const textY = useSpring(useTransform(scrollY, [0, 700], [0, -80]), sSpring);
  const textOp = useSpring(useTransform(scrollY, [0, 500], [1, 0.45]), sSpring);
  const photoS = useTransform(scrollY, [0, 1000], [1, 1.18]);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { damping: 35, stiffness: 80 });
  const smy = useSpring(my, { damping: 35, stiffness: 80 });
  const photoMx = useTransform(smx, [-1, 1], [-18, 18]);
  const photoMy = useTransform(smy, [-1, 1], [-18, 18]);
  const blobsMx = useTransform(smx, [-1, 1], [12, -12]);
  const blobsMy = useTransform(smy, [-1, 1], [12, -12]);
  const textMx = useTransform(smx, [-1, 1], [-6, 6]);
  const textMy = useTransform(smy, [-1, 1], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function handleMouseLeave() { mx.set(0); my.set(0); }

  return (
    <section ref={heroRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative isolate min-h-[600px] lg:min-h-[720px] overflow-hidden bg-navy text-white pt-24 lg:pt-32 pb-16 lg:pb-20">

      <motion.div className="absolute inset-[-10%_-5%] z-0 will-change-transform" style={{ y: photoY, x: photoMx, scale: photoS }}>
        <motion.div className="relative w-full h-full" style={{ y: photoMy }}>
          <AnimatePresence>
            <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
              <Image src={SLIDES[slide]} alt="" fill sizes="100vw" priority className="object-cover brightness-[0.5] saturate-[0.85] contrast-[1.08]" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 0%, hsl(var(--gold) / 0.2), transparent 50%), radial-gradient(ellipse at 20% 100%, hsl(var(--navy-80) / 0.55), transparent 55%), linear-gradient(180deg, hsl(var(--navy) / 0.55) 0%, hsl(var(--navy) / 0.30) 40%, hsl(var(--navy) / 0.85) 100%)" }} />
      </motion.div>

      <motion.div className="absolute inset-0 z-[1] pointer-events-none" style={{ y: blobsY, x: blobsMx }}>
        <motion.div style={{ y: blobsMy }} className="absolute inset-0">
          <div className="absolute rounded-full blur-[80px] animate-drift-1" style={{ width: 560, height: 560, top: -100, right: -160, background: "radial-gradient(circle, hsl(var(--gold) / 0.45), transparent 70%)" }} />
          <div className="absolute rounded-full blur-[80px] animate-drift-2" style={{ width: 520, height: 520, bottom: -180, left: -180, background: "radial-gradient(circle, hsl(var(--gold) / 0.28), transparent 70%)" }} />
          <div className="absolute rounded-full blur-[80px] animate-drift-3" style={{ width: 420, height: 420, top: "38%", left: "32%", background: "radial-gradient(circle, hsl(var(--brass) / 0.32), transparent 70%)" }} />
          <div className="absolute rounded-full blur-[80px] animate-drift-4" style={{ width: 340, height: 340, top: "18%", right: "18%", background: "radial-gradient(circle, hsl(var(--navy-80) / 0.5), transparent 70%)" }} />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-[2] grain opacity-40 pointer-events-none" />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} type="button" onClick={() => setSlide(i)} aria-label={"Slide " + (i + 1)} className={"h-1.5 rounded-full transition-all duration-500 " + (slide === i ? "w-8 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/60")} />
        ))}
      </div>

      <motion.div className="relative z-[3] container-x text-center max-w-[1080px]" style={{ y: textY, x: textMx, opacity: textOp }}>
        <motion.div style={{ y: textMy }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-pill bg-white/10 backdrop-blur-md border border-white/20 mb-7 shadow-lg">
            <span className="relative w-1.5 h-1.5 rounded-full bg-gold">
              <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-50" />
            </span>
            <span className="font-sans text-[13px] font-medium text-white">340+ curated homes across Pune</span>
            <span className="ml-1 px-3 py-1 rounded-pill bg-gold text-white text-[11px] font-bold tracking-wider">RERA &middot; Verified</span>
          </motion.div>

          <h1 className="h1-hero mb-6" style={{ textShadow: "0 2px 24px hsl(var(--navy) / 0.5)" }}>
            <SplitText text="Your Perfect Home in" highlight="" delay={0.15} stagger={0.08} />
            <br />
            <span className="text-gold font-display not-italic">Pune</span> Awaits.
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="body-base text-white/90 max-w-[620px] mx-auto mb-10" style={{ textShadow: "0 1px 12px hsl(var(--navy) / 0.6)" }}>
            From the IT corridors of Hinjewadi to the heritage lanes of Koregaon Park &mdash; we curate residences with the warmth of a friend and the rigour of an advisor.
          </motion.p>

          {/* Search bar — refined premium card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-[1080px] mx-auto text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-pill bg-gold text-white eyebrow text-[11.5px] shadow-cta whitespace-nowrap tracking-[0.14em]">Find Your Home</div>

            <div
              className="rounded-[36px] p-2 shadow-[0_30px_80px_hsl(var(--navy)/0.4)] border border-white/80"
              style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FBF6EE 100%)" }}
            >
              <div className="flex flex-col lg:flex-row items-stretch bg-ivory rounded-[28px] overflow-hidden">
                <div className="grid grid-cols-2 lg:flex lg:flex-1 lg:items-stretch">
                  <SearchField label="Property Type" value={propertyType} onChange={setPropertyType} options={["Apartment", "Villa", "Plot", "Commercial"]} />
                  <SearchField label="Locality" value={locality} onChange={setLocality} options={["Hinjewadi", "Baner", "Kharadi", "Wakad", "Aundh", "Koregaon Park"]} />
                  <SearchField label="Budget" value={budget} onChange={setBudget} options={["₹25L – ₹50L", "₹50L – ₹1 Cr", "₹1 – 2 Cr", "₹2 – 5 Cr", "₹5 Cr+"]} />
                  <SearchField label="BHK" value={bhk} onChange={setBhk} options={["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"]} />
                  <SearchField label="Possession" value={possession} onChange={setPossession} options={["Ready to Move", "Within 1 Year", "1 – 3 Years", "Under Construction"]} last />
                </div>

                <div className="flex items-center justify-center p-2 lg:p-2">
                  <MagneticButton onClick={handleSearch} className="w-full lg:w-auto h-12 px-8 rounded-[22px] text-white font-sans font-bold text-[14.5px] inline-flex items-center justify-center gap-2.5 shadow-cta lg:min-w-[160px] hover:brightness-110 transition-all bg-[linear-gradient(135deg,#C9A961_0%,#8C6A2F_100%)]">
                    Search <span aria-hidden>&rarr;</span>
                  </MagneticButton>
                </div>
              </div>

              <div className="flex justify-between flex-wrap gap-3 px-4 pt-3.5 pb-2 text-[13px] font-medium text-navy/80">
                <span>
                  Most searched:&nbsp;
                  <Link href="/localities/baner" className="text-navy font-bold underline underline-offset-2 decoration-gold/60 hover:decoration-gold-hover transition-colors">3BHK in Baner</Link>
                  <span className="mx-2 text-slate/50">&middot;</span>
                  <Link href="/localities/hinjwadi" className="text-navy font-bold underline underline-offset-2 decoration-gold/60 hover:decoration-gold-hover transition-colors">Ready in Hinjewadi</Link>
                </span>
                <Link href="/localities/hinjwadi" className="text-[#6B4F23] font-bold hover:text-navy transition-colors">Browse all 340+ properties &rarr;</Link>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 mt-9 pt-7 border-t border-white/20">
            {[
              { num: 340, sup: "+", label: "Curated Homes" },
              { num: 28, sup: "", label: "Pune Localities" },
              { num: 200, sup: "+", label: "Happy Families" },
              { num: 7, sup: "yrs", label: "Of Trust" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-sans font-semibold text-[32px] tnum leading-none text-white">
                  <Counter to={s.num} />
                  <sup className="text-[0.55em] text-gold font-medium ml-0.5">{s.sup}</sup>
                </span>
                <span className="font-sans font-semibold uppercase text-[11px] tracking-[0.14em] text-white/70">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SearchField({ label, value, onChange, options, last }: { label: string; value: string; onChange: (v: string) => void; options: string[]; last?: boolean }) {
  return (
    <label
      className={
        "group relative flex flex-col justify-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-white lg:flex-1 " +
        (last ? "" : "lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-3 lg:after:bottom-3 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-navy/15 lg:after:to-transparent")
      }
    >
      <span className="font-sans font-bold uppercase text-[10.5px] tracking-[0.16em] text-[#6B4F23] mb-1 transition-colors group-hover:text-[#8C6A2F]">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-transparent border-0 p-0 font-sans font-bold text-[15.5px] text-navy outline-none cursor-pointer leading-tight focus:text-[#8C6A2F]">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}