"use client";

import { useEffect, useState } from "react";

export default function LeadGate({
  storageKey,
  children,
  prompt,
  onUnlockClick,
}: {
  storageKey: string;
  children: React.ReactNode;
  prompt: string;
  onUnlockClick: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setUnlocked(true);
    } catch {}
    const handler = () => {
      try {
        if (sessionStorage.getItem(storageKey) === "1") setUnlocked(true);
      } catch {}
    };
    window.addEventListener("lead-unlock", handler);
    return () => window.removeEventListener("lead-unlock", handler);
  }, [storageKey]);

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: "blur(8px) saturate(0.6)" }} aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 grid place-items-center p-4 bg-ivory/30">
        <button
          type="button"
          onClick={onUnlockClick}
          className="card-base px-6 py-5 max-w-[420px] text-center hover:shadow-hover transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 text-gold-hover grid place-items-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="font-sans font-semibold text-[15.5px] text-navy mb-1">{prompt}</div>
          <div className="meta text-slate mb-3">Share your details once to unlock everything on this page.</div>
          <div className="inline-flex items-center gap-2 h-10 px-5 rounded-pill bg-gold text-white font-sans font-semibold text-[13px] shadow-cta">
            Unlock details &rarr;
          </div>
        </button>
      </div>
    </div>
  );
}