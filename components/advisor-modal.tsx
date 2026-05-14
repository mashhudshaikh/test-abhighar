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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in" role="dialog" aria-modal="true" aria-label="Contact form">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-navy/70 backdrop-blur-md cursor-default"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-card shadow-[0_30px_80px_hsl(var(--navy)/0.45)] animate-pop-in advisor-modal-scroll">
        {/* Close button — sits over the advisor card's top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center backdrop-blur-sm transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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