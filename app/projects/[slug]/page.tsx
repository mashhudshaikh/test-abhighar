import { notFound } from "next/navigation";
import { getPropertyBySlug, getAllProperties } from "@/lib/properties";
import ProjectPageClient from "./ProjectPageClient";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const p = await getPropertyBySlug(params.slug);
  if (!p) notFound();

  // Compute "similar" via the API list (same locality, exclude current).
  const all = await getAllProperties();
  const similar = all
    .filter((x) => x.slug !== p.slug && x.localitySlug === p.localitySlug)
    .slice(0, 4);

  return <ProjectPageClient property={p} similar={similar} />;
}