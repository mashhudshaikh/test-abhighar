import Image from "next/image";
import { advisors } from "@/lib/data";
import Reveal from "./ui/reveal";

export default function Advisors() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-10 lg:mb-12">
          <Reveal>
            <div className="sec-eyebrow mb-4">Meet the Team</div>
            <h2 className="h2-section text-navy">
              Your Pune <em className="text-gold italic">property experts.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">
                Senior advisors who've walked these neighbourhoods, know these builders, and put your interest first.
              </p>
              <a href="#" className="font-sans font-semibold text-gold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                See the full team →
              </a>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {advisors.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.07}>
              <div className="card-base p-7 px-5 text-center relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-hover group">
                <span aria-hidden className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[140px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.25), transparent 70%)", filter: "blur(40px)" }} />
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-[3px] border-white relative z-10"
                     style={{ boxShadow: "0 0 0 3px hsl(var(--gold)), 0 10px 24px hsl(var(--gold) / 0.22)" }}>
                  <Image src={a.image} alt={a.name} width={96} height={96} className="w-full h-full object-cover"/>
                </div>
                <div className="font-sans font-semibold text-[18px] text-navy mb-1 relative z-10">{a.name}</div>
                <div className="meta text-gold font-semibold mb-4 relative z-10">{a.role}</div>
                <div className="meta text-slate pt-4 border-t border-navy/8 relative z-10">
                  <strong className="text-navy font-bold">{a.exp}</strong> · {a.area}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
