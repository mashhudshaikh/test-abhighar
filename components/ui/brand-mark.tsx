"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  glow?: boolean;
  className?: string;
}

export default function BrandMark({ size = 54, glow = false, className }: Props) {
  return (
    <div className={cn("relative grid place-items-center shrink-0 transition-transform duration-500", className)} style={{ width: size, height: size }}>
      {glow && (
        <>
          <span aria-hidden className="absolute inset-[-8px] rounded-full pointer-events-none transition-opacity duration-500" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.55) 0%, hsl(var(--gold) / 0.18) 45%, transparent 75%)", filter: "blur(2px)" }} />
          <span aria-hidden className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--ivory) / 0.18), transparent 70%)" }} />
        </>
      )}
      <Image src="/logo.png" alt="Abhi Ghar" width={size} height={size} priority className="relative z-10 object-contain transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105" />
    </div>
  );
}