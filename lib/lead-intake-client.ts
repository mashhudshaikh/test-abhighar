/* Client-side wrapper around the lead-intake Server Action.

   Behaviour:
   - Calls Server Action with the form payload
   - On success: returns immediately
   - On failure (network error / API down / etc):
       1. Stores the payload in localStorage under `leadIntakeQueue`
       2. Returns "ok-but-queued" so the UX still unlocks
       3. Next page load processes the queue (see processQueuedIntakes)

   This means even if the API is down for an hour, no lead is lost — the
   visitor's submission stays in their browser and replays when the API
   recovers.

   Queue entries expire after 7 days. If retry still fails after 7 days,
   we drop them (they're either bots or genuinely unreachable). */

import { submitLeadIntake, type LeadIntakePayload, type LeadIntakeResult } from "@/app/actions/lead-intake";

const QUEUE_KEY = "leadIntakeQueue";
const QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface QueuedEntry {
  payload: LeadIntakePayload;
  queuedAt: number;
}

function readQueue(): QueuedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop expired entries
    const cutoff = Date.now() - QUEUE_TTL_MS;
    return parsed.filter((e: QueuedEntry) => e && typeof e.queuedAt === "number" && e.queuedAt >= cutoff);
  } catch {
    return [];
  }
}

function writeQueue(entries: QueuedEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
  } catch {
    /* localStorage full or disabled — best effort */
  }
}

function enqueue(payload: LeadIntakePayload) {
  const q = readQueue();
  q.push({ payload, queuedAt: Date.now() });
  writeQueue(q);
}

/* Submit one lead. Always returns a result the UI can act on:
   - {ok: true} when the API accepted (or dedup'd) it
   - {ok: true, queued: true} when we couldn't reach the API but saved
     the payload for retry. UI should still unlock content.
   - {ok: false} ONLY for validation errors the visitor can correct
     (which today doesn't happen — Server Action validates trivially). */
export async function submitLeadWithRetry(payload: LeadIntakePayload): Promise<LeadIntakeResult & { queued?: boolean }> {
  try {
    const res = await submitLeadIntake(payload);
    if (res.ok) return res;
    // Soft failure (server misconfig / network) — queue for retry
    enqueue(payload);
    return { ok: true, queued: true };
  } catch (err) {
    console.warn("[lead-intake] submission failed, queued for retry:", err);
    enqueue(payload);
    return { ok: true, queued: true };
  }
}

/* Process any queued intakes. Called on page load by lib/data.ts.
   Runs serially with 200ms delay between calls to avoid hammering the API. */
export async function processQueuedIntakes(): Promise<void> {
  if (typeof window === "undefined") return;
  const q = readQueue();
  if (q.length === 0) return;

  const remaining: QueuedEntry[] = [];
  for (const entry of q) {
    try {
      const res = await submitLeadIntake(entry.payload);
      if (!res.ok) {
        remaining.push(entry);
      }
      // small delay between submissions
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      remaining.push(entry);
    }
  }
  writeQueue(remaining);
}
