// app/actions/interior-intake.ts
// Server action — receives the interior intake form, signs with HMAC,
// posts to API. Mirrors the Phase 2 project-lead intake pattern.

"use server";

import { createHmac } from "crypto";

interface IntakePayload {
  name: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  serviceType: "full_home" | "modular_kitchen" | "living_wardrobes";
  propertyType?: string;
  bhk?: string;
  areaApprox?: string;
  locality?: string;
  city?: string;
  budget?: string;
  requirements?: string;
  company2?: string; // honeypot
}

interface IntakeResult {
  ok: boolean;
  deduplicated?: boolean;
  leadId?: string | null;
  error?: string;
}

const API_BASE = process.env.ABHIGHAR_API_URL || "http://localhost:3000";
const SECRET = process.env.LEAD_INTAKE_SECRET || "";

export async function submitInteriorIntake(
  payload: IntakePayload
): Promise<IntakeResult> {
  if (!SECRET || SECRET.length < 32) {
    console.error("[interior-intake] LEAD_INTAKE_SECRET not configured");
    return { ok: false, error: "Server misconfigured. Please call us directly." };
  }

  // Server-side validation — mirrors the API DTO so issues are caught
  // before the HMAC trip
  if (!payload.name?.trim()) return { ok: false, error: "Name is required" };
  if (!/^\d{10}$/.test(payload.mobile || "")) return { ok: false, error: "Mobile must be 10 digits" };
  if (payload.whatsapp && !/^\d{10}$/.test(payload.whatsapp)) {
    return { ok: false, error: "WhatsApp must be 10 digits" };
  }
  const allowedServices = ["full_home", "modular_kitchen", "living_wardrobes"];
  if (!allowedServices.includes(payload.serviceType)) {
    return { ok: false, error: "Invalid service type" };
  }

  const bodyString = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", SECRET).update(`${timestamp}.${bodyString}`).digest("hex");

  try {
    const res = await fetch(`${API_BASE}/v1/interior-leads/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Lead-Signature": `${timestamp}.${sig}`,
      },
      body: bodyString,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[interior-intake] API returned ${res.status}:`, text);
      // 401/403/etc: don't leak internal error; thank the user and log.
      if (res.status >= 400 && res.status < 500) {
        return { ok: false, error: "Sorry — we couldn't process that. Please try again or WhatsApp us." };
      }
      return { ok: false, error: "Sorry — we couldn't reach our system. Please WhatsApp or call us." };
    }

    const data = (await res.json()) as IntakeResult;
    return { ok: true, deduplicated: data.deduplicated, leadId: data.leadId };
  } catch (err) {
    console.error("[interior-intake] fetch failed:", err);
    return { ok: false, error: "Network error. Please WhatsApp us." };
  }
}
