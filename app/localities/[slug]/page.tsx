import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import LocalityListings from "@/components/locality-listings";
import { localityBySlug, propertiesByLocality, localities } from "@/lib/data";

export function generateStaticParams() {
  return localities.map((l) => ({ slug: l.slug }));
}

export default function LocalityPage({ params }: { params: { slug: string } }) {
  const locality = localityBySlug(params.slug);
  if (!locality) notFound();

  const props = propertiesByLocality(params.slug);

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-12">
        {/* Breadcrumb + locality header */}
        <div className="container-x">
          <nav className="meta text-slate mb-4">
            <Link href="/" className="hover:text-gold-hover">Home</Link>
            <span className="mx-2 text-steel">/</span>
            <Link href="/#localities" className="hover:text-gold-hover">Localities</Link>
            <span className="mx-2 text-steel">/</span>
            <span className="text-navy font-semibold">{locality.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_auto] items-end gap-4 mb-2">
            <div>
              <div className="sec-eyebrow mb-3">{locality.tag}</div>
              <h1 className="h2-section text-navy">
                Properties in <em className="text-gold italic">{locality.name}</em>
              </h1>
            </div>
            <div className="meta text-slate">
              Starting from <strong className="text-navy font-semibold">{locality.from}</strong> ·
              {` ${locality.count} properties listed`}
            </div>
          </div>
        </div>

        <LocalityListings localityName={locality.name} properties={props} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}