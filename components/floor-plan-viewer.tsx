"use client";

import Image from "next/image";
import { useState } from "react";

type Config = {
    config: string;
    area: string;
    from: string;
    floorPlan?: string;
};

export default function FloorPlanViewer({ configs }: { configs: Config[] }) {
    const [idx, setIdx] = useState(0);

    if (!configs || configs.length === 0) {
        return null;
    }

    const current = configs[idx] || configs[0];
    const digits = current.area.replace(/[^0-9]/g, "");
    const carpetNum = digits ? parseInt(digits, 10) : 0;
    const hasArea = carpetNum > 0;
    const builtUp = hasArea ? carpetNum + 100 + " sqft" : "-";
    const src = current.floorPlan || "/floor-plans/default.jpg";
    const altText = current.config + " floor plan";

    return (
        <div className="card-base overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-navy/8">
                <div>
                    <div className="eyebrow text-slate mb-1">Now viewing</div>
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-sans font-semibold text-navy">{current.config}</span>
                        <span className="meta text-slate tnum">Carpet {current.area}</span>
                        <span className="meta text-gold font-medium tnum">Built-up {builtUp}</span>
                        <span className="font-sans font-semibold text-navy tnum">{current.from}</span>
                    </div>
                </div>
                <label className="flex items-center gap-2 shrink-0">
                    <span className="eyebrow text-slate hidden sm:inline">Configuration</span>
                    <select value={idx} onChange={(e) => setIdx(Number(e.target.value))} className="bg-white border border-navy/15 rounded-pill px-4 py-2 text-sm font-semibold text-navy cursor-pointer hover:border-gold focus:border-gold transition-colors outline-none">
                        {configs.map((c, i) => (
                            <option key={c.config} value={i}>{c.config}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="relative bg-ivory w-full">
                <Image key={src} src={src} alt={altText} width={1400} height={900} sizes="(max-width: 1024px) 100vw, 900px" className="w-full h-auto object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-navy/8">
                <div className="meta text-slate">Indicative layout. Final plan may vary slightly per tower and floor.</div>
                <a href="#" className="inline-flex items-center gap-1 text-gold font-sans font-semibold text-sm hover:text-gold-hover transition-colors">Request detailed PDF</a>
            </div>
        </div>
    );
}