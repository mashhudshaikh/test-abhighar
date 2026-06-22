/* Public API client for the customer-facing site.

   This file is server-safe — uses Node's global fetch (Next.js 14+).
   Used by server components when rendering pages.

   API base URL is read from ABHIGHAR_API_URL env (server-only).
   Falls back to localhost:3000 in dev. */

const API_BASE = process.env.ABHIGHAR_API_URL || "http://localhost:3000";

export interface ApiClientOptions {
  /** Next.js fetch revalidate seconds. Default: 60. Set 0 to disable cache. */
  revalidate?: number;
  /** Tag for on-demand revalidation. */
  tag?: string;
}

export async function publicGet<T = unknown>(path: string, opts: ApiClientOptions = {}): Promise<T> {
  const url = `${API_BASE}/v1/public${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: {
      revalidate: opts.revalidate ?? 60,
      tags: opts.tag ? [opts.tag] : undefined,
    },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}
