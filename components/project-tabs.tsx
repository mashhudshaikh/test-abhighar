"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "plans",     label: "Floor Plans" },
  { id: "amenities", label: "Amenities" },
  { id: "location",  label: "Location" },
  { id: "pricing",   label: "Pricing" },
  { id: "documents", label: "Documents" },
];

export default function ProjectTabs() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.5, 1] },
    );
    TABS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="sticky top-[88px] z-30 bg-ivory/85 backdrop-blur-md border-b border-navy/10">
      <nav className="flex gap-6 lg:gap-8 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const linkClass = "shrink-0 py-4 font-sans font-semibold text-[14px] border-b-2 transition-colors " + (isActive ? "text-gold border-gold" : "text-slate border-transparent hover:text-navy");
          return (
            <a key={t.id} href={"#" + t.id} className={linkClass}>{t.label}</a>
          );
        })}
      </nav>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
}