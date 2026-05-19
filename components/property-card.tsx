import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/data";

export default function PropertyCard({ property: p, compact = false }: { property: Property; compact?: boolean }) {
  const ready = p.status === "ready";
  return (
    <article className="card-base flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-hover group">
      <div className={`relative overflow-hidden p-3 ${compact ? "h-[200px]" : "h-[260px]"}`}>
        <span
          className={`absolute top-5 left-5 z-10 px-3 py-1 rounded-pill text-[11.5px] font-semibold tracking-wide
            ${ready ? "bg-success text-white" : "bg-[#E08E00] text-white"}`}
        >
          {ready ? "Ready to move" : "Under Construction"}
        </span>
        <button
          type="button"
          aria-label="Save"
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm grid place-items-center text-navy hover:text-gold-hover transition-colors"
        >
          ♡
        </button>
        <span className="absolute bottom-5 left-5 z-10 px-2.5 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-[11.5px] font-semibold text-navy inline-flex items-center gap-1.5">
          <span className="w-3 h-3 border border-navy/40 rounded-[3px]" aria-hidden />
          Compare
        </span>
        <span className="absolute bottom-5 right-5 z-10 px-3 py-1.5 rounded-pill bg-white/95 backdrop-blur-sm text-[11.5px] font-semibold text-navy">
          {p.builder}
        </span>
        <div className="relative w-full h-full overflow-hidden rounded-[18px]">
          <Image
            src={p.thumbnail}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col">
        <Link
          href={`/projects/${p.slug}`}
          className="h3-card text-navy mb-2 hover:text-gold-hover transition-colors"
        >
          {p.name}
        </Link>
        <div className="meta text-slate flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
          {p.localityArea}
        </div>
        <div className="meta text-slate mb-3">
          {p.bhkRange} · {p.areaMin} · {p.possessionLabel}
        </div>

        <div className="price text-navy mb-5">
          {p.priceDisplay}{" "}
          <span className="meta text-steel font-normal ml-1">onwards</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/projects/${p.slug}`}
            className="flex-1 h-11 rounded-pill bg-navy text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-navy-80 transition-colors"
          >
            Know more
          </Link>
          
          <a
            href={`https://wa.me/919890122755?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp enquiry"
            className="w-11 h-11 rounded-pill bg-[#25D366] text-white grid place-items-center hover:bg-[#1da851] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.45 6.6 2.01 12.05 2.01c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.43 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.42z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}