"use server";

import { createHmac } from "crypto";

/* Server Action for lead intake (Pattern B).

   Called from advisor-card.tsx submit handler. Signs the payload with a
   shared HMAC-SHA256 secret and posts to /v1/leads/public on the API.

   Two env vars required:
     - LEAD_INTAKE_SECRET   shared with the API (>= 32 chars)
     - ABHIGHAR_API_URL     e.g. "http://localhost:3000" in dev

   Returns:
     { ok: true,  deduplicated?: boolean, leadId?: string }   on success
     { ok: false, error: string }                              on failure

   The caller (advisor-card via markLeadCaptured) handles retry-on-failure.
   This action only signs + posts; the caller does the local queue/retry. */

export interface LeadIntakePayload {
  name: string;
  mobile: string;
  whatsapp?: string;
  project: string;
  config?: string[];
  buyingPurpose?: "Self_use" | "Investment" | "Rental_Income";
  remark?: string;
  // Honeypot — bots fill this; humans don't (it's CSS-hidden).
  company2?: string;
}

export interface LeadIntakeResult {
  ok: boolean;
  deduplicated?: boolean;
  leadId?: string | null;
  error?: string;
}

export async function submitLeadIntake(payload: LeadIntakePayload): Promise<LeadIntakeResult> {
  const secret = process.env.LEAD_INTAKE_SECRET;
  const apiUrl = process.env.ABHIGHAR_API_URL;

  if (!secret || secret.length < 32) {
    console.error("[lead-intake] LEAD_INTAKE_SECRET missing or too short");
    return { ok: false, error: "Server misconfigured" };
  }
  if (!apiUrl) {
    console.error("[lead-intake] ABHIGHAR_API_URL not set");
    return { ok: false, error: "Server misconfigured" };
  }

  // Normalise the payload server-side. The advisor card sends UI labels
  // like "Self Use" / "selfuse" / "investment" — translate to the API
  // enum values. Also drop empty optional fields so signature is stable.
  const buyingPurpose = mapBuyingPurpose(payload.buyingPurpose as unknown as string);
  const body: Record<string, unknown> = {
    name: String(payload.name || "").trim(),
    mobile: String(payload.mobile || "").replace(/\D/g, "").slice(-10),
    project: String(payload.project || "").trim(),
  };
  if (payload.whatsapp) {
    const wa = String(payload.whatsapp).replace(/\D/g, "").slice(-10);
    if (wa.length === 10 && wa !== body.mobile) body.whatsapp = wa;
  }
  if (Array.isArray(payload.config) && payload.config.length > 0) body.config = payload.config;
  if (buyingPurpose) body.buyingPurpose = buyingPurpose;
  if (payload.remark && payload.remark.trim()) body.remark = payload.remark.trim();
  if (payload.company2) body.company2 = payload.company2; // forward honeypot

  if (!body.name || (body.mobile as string).length !== 10 || !body.project) {
    return { ok: false, error: "Missing required fields" };
  }

  // Sign over `${timestamp}.${JSON.stringify(body)}`.
  const timestamp = Math.floor(Date.now() / 1000);
  const bodyString = JSON.stringify(body);
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${bodyString}`)
    .digest("hex");

  try {
    const res = await fetch(`${apiUrl}/v1/leads/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Lead-Signature": `${timestamp}.${signature}`,
      },
      body: bodyString,
      // Don't cache; each submission is unique.
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[lead-intake] API ${res.status}: ${text.slice(0, 200)}`);
      return { ok: false, error: `API responded ${res.status}` };
    }

    const data = await res.json() as { ok?: boolean; deduplicated?: boolean; leadId?: string | null };
    return {
      ok: true,
      deduplicated: data.deduplicated || false,
      leadId: data.leadId || null,
    };
  } catch (err) {
    console.error("[lead-intake] fetch failed:", err);
    return { ok: false, error: "Network error" };
  }
}

function mapBuyingPurpose(label: string | undefined): "Self_use" | "Investment" | "Rental_Income" | undefined {
  if (!label) return undefined;
  const v = String(label).toLowerCase().trim();
  if (v === "selfuse" || v === "self-use" || v === "self use" || v === "self_use") return "Self_use";
  if (v === "investment") return "Investment";
  if (v === "rental_income" || v === "rental income") return "Rental_Income";
  return undefined;
}
