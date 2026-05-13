import { testimonials } from "@/lib/data";
import Reveal from "./ui/reveal";

export default function Testimonials() {
  return (
    <section className="section bg-white rounded-[28px] lg:rounded-[48px] mx-3 lg:mx-4 relative overflow-hidden">
      <div className="absolute top-[20%] right-[-160px] w-[480px] h-[480px] rounded-full blur-[80px] opacity-45 pointer-events-none animate-drift-1"
           style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.40), transparent 70%)" }} />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-10 lg:mb-12">
          <Reveal>
            <div className="sec-eyebrow mb-4">Happy Families</div>
            <h2 className="h2-section text-navy">
              Homes <em className="text-gold italic">found.</em> Lives changed.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">
                200+ families have trusted us with the most important decision of their lives.
              </p>
              <a href="#" className="font-sans font-semibold text-gold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Read all stories →
              </a>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="card-base p-8 px-7 flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-brass tracking-[3px] text-[15px]">★★★★★</span>
                  <span className="font-sans font-bold text-[48px] leading-[0.7] text-gold-light">&ldquo;</span>
                </div>
                <p className="body-base text-navy mb-6 flex-1 font-medium">{t.quote}</p>
                <div className="flex items-center gap-3.5 pt-5 border-t border-dashed border-navy/10">
                  <div className="w-11 h-11 rounded-full bg-gold text-white grid place-items-center font-bold text-[14px] shadow-cta relative">
                    <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-[15px] text-navy">{t.name}</div>
                    <div className="meta text-slate mt-0.5">{t.meta}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
