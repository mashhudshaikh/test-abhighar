/**
 * Phase 4.5 — Server wrapper for /interiors page.
 *
 * Fetches packages, portfolio, designers, page content from the API at
 * request time (revalidate: 60), then passes them down to the existing
 * client component as props.
 *
 * This file REPLACES the previous client-only app/interiors/page.tsx.
 * The previous 522-line client component should now live in
 * app/interiors/InteriorsPageClient.tsx (see INSTALL-customer.md for
 * the rename + small surgery to accept props).
 */
import type { Metadata } from "next";
import { getAllInteriorData } from "@/lib/interior";
import InteriorsPageClient from "./InteriorsPageClient";

export const revalidate = 60; // Re-fetch from API every 60s

export const metadata: Metadata = {
  title: "Interiors — Abhi Ghar",
  description:
    "Beautiful interiors, thoughtfully done. In-house designers shaping your home around your family's daily life.",
};

export default async function InteriorsPage() {
  const data = await getAllInteriorData();
  return (
    <InteriorsPageClient
      packages={data.packages}
      portfolio={data.portfolio}
      designers={data.designers}
      pageContent={data.pageContent}
    />
  );
}
