import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import LocalityListings from "@/components/locality-listings";
import { getLocalityBySlug, getAllLocalities } from "@/lib/localities-data";
import { getPropertiesByLocality } from "@/lib/properties";

export default async function LocalityPage({ params }: { params: { slug: string } }) {
  const locality = await getLocalityBySlug(params.slug);
  if (!locality) notFound();

  const [props, allLocalitiesRaw] = await Promise.all([
    getPropertiesByLocality(params.slug),
    getAllLocalities(),
  ]);

  // Match the old shape — { slug, name } only — for LocalityListings prop.
  const allLocalities = allLocalitiesRaw.map((l) => ({ slug: l.slug, name: l.name }));

  return (
    <>
      <Header />
      <main className="pt-[100px] lg:pt-[110px] pb-12">
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
              <div className="sec-eyebrow mb-3">{locality.area}</div>
              <h1 className="h2-section text-navy">
                Properties in <em className="text-gold italic">{locality.name}</em>
              </h1>
            </div>
            <div className="meta text-slate">
              {props.length} {props.length === 1 ? "property" : "properties"} listed
            </div>
          </div>
        </div>

        <LocalityListings
          localityName={locality.name}
          localitySlug={locality.slug}
          allLocalities={allLocalities}
          properties={props}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}