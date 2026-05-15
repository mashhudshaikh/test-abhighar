"use client";

import { useEffect } from "react";
import AdvisorCard from "./advisor-card";
import { Property } from "@/lib/data";

export default function AdvisorModal({
  open,
  onClose,
  property,
  variant = "project",
}: {
  open: boolean;
  onClose: () => void;
  property: Property;
  variant?: "project" | "interior";
}) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("sheet-open"); // hides WhatsApp float
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("sheet-open");
    };
  }, [open]);

  // NOTE: Escape-key-to-close was removed intentionally.
  // This is a lead-capture modal — the only ways to close it are:
  //   1. The explicit X button (top-right)
  //   2. A successful form submission (auto-closes after the "lead-unlock" event)
  // Backdrop taps and Escape were removed to prevent accidental dismissal
  // when the user's true intent is to fill the form.

  // Auto-close modal after a successful submit (LeadGates will be unlocked).
  // The AdvisorCard dispatches "lead-unlock" inside its submit handler.
  useEffect(() => {
    if (!open) return;
    const onUnlock = () => {
      // Give the user a moment to see the success state inside the form,
      // then close the modal so they can see the now-unlocked content.
      setTimeout(onClose, 1600);
    };
    window.addEventListener("lead-unlock", onUnlock);
    return () => window.removeEventListener("lead-unlock", onUnlock);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
    >
      {/* Backdrop — purely visual, NOT interactive.
          Was previously a <button onClick={onClose}> which dismissed the modal
          on any backdrop tap. Lead-capture modals shouldn't dismiss accidentally
          — the user must explicitly choose to close via the X button. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-navy/70 backdrop-blur-md pointer-events-none"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-card shadow-[0_30px_80px_hsl(var(--navy)/0.45)] animate-pop-in advisor-modal-scroll">
        {/* Close button — the ONLY way to close this modal besides submitting.
            Sized at 40×40 (above the 44px touch-target guideline relaxed slightly
            for visual balance) with a high-contrast hover state so it's never
            mistaken for decoration. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/45 text-white grid place-items-center backdrop-blur-sm transition-colors ring-1 ring-white/30 hover:ring-white/50"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <AdvisorCard property={property} variant={variant} />
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.22s ease-out; }
        .animate-pop-in  { animation: popIn 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
        .advisor-modal-scroll::-webkit-scrollbar { width: 6px; }
        .advisor-modal-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--gold) / 0.4);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}