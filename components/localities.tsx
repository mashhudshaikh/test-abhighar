import Image from "next/image";
import Link from "next/link";
import { localities } from "@/lib/data";
import Reveal from "./ui/reveal";

export default function Localities() {
  return (
    <section id="localities" className="section bg-white rounded-[28px] lg:rounded-[48px] mx-3 lg:mx-4">
      <div className="container-x">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 lg:gap-8 mb-10 lg:mb-12">
          <Reveal>
            <div className="sec-eyebrow mb-4">Explore by Locality</div>
            <h2 className="h2-section text-navy max-w-[520px]">
              Find your <em className="text-gold italic">Pune</em> neighbourhood.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg:text-right max-w-[320px]">
              <p className="body-base text-slate mb-3">
                Each locality has its own pace, character, and price band. We help you find the one that fits how you actually live.
              </p>
              <a href="#" className="font-sans font-semibold text-gold hover:gap-2.5 inline-flex items-center gap-1.5 transition-all">
                View all 28 localities →
              </a>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {localities.map((l, i) => (
            <Reveal key={l.slug} delay={i * 0.06}>
            
                <Link
                  href={`/localities/${l.slug}`}
                  className="group relative block rounded-[28px] overflow-hidden aspect-[4/3.4] bg-navy transition-transform duration-500 hover:-translate-y-2"
                >
                <Image
                  src={l.image}
                  alt={l.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/85" />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-gold-hover meta font-bold z-10">
                  {l.count} Homes
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                  <div className="font-sans font-semibold text-[28px] tracking-tight mb-2">{l.name}</div>
                  <div className="flex justify-between items-end gap-3">
                    <div className="meta opacity-90">From {l.from} · {l.tag}</div>
                    <span className="w-10 h-10 rounded-full bg-white/18 backdrop-blur-sm border border-white/30 grid place-items-center text-white transition-all duration-300 group-hover:bg-gold group-hover:border-transparent group-hover:-rotate-45">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
