"use client";

import { useEffect } from "react";
import { processQueuedIntakes } from "@/lib/lead-intake-client";

/* Mount-once retry. Drop into root layout.tsx as a sibling of <Header>.
   Renders nothing. Triggers any queued lead intakes (from earlier
   submissions while the API was down) to re-submit. */
export default function LeadIntakeRetry() {
  useEffect(() => {
    // Delay a moment so we don't compete with critical page rendering.
    const t = setTimeout(() => {
      processQueuedIntakes().catch((err) => {
        console.warn("[lead-intake-retry] failed:", err);
      });
    }, 2000);
    return () => clearTimeout(t);
  }, []);
  return null;
}
