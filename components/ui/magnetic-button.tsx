"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  innerClassName?: string;
  pullStrength?: number;
  innerStrength?: number;
  ariaLabel?: string;
}

const SPRING = { damping: 20, stiffness: 220, mass: 0.5 };

export default function MagneticButton({
  children, href, onClick, type = "button", className, innerClassName,
  pullStrength = 0.25, innerStrength = 0.12, ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const bx = useMotionValue(0), by = useMotionValue(0);
  const ix = useMotionValue(0), iy = useMotionValue(0);
  const sbx = useSpring(bx, SPRING), sby = useSpring(by, SPRING);
  const six = useSpring(ix, SPRING), siy = useSpring(iy, SPRING);

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    bx.set(dx * pullStrength);  by.set(dy * pullStrength * 1.4);
    ix.set(dx * innerStrength); iy.set(dy * innerStrength * 1.4);
  }
  function handleLeave() { bx.set(0); by.set(0); ix.set(0); iy.set(0); }

  const inner = (
    <motion.span style={{ x: six, y: siy }} className={cn("inline-flex items-center gap-2", innerClassName)}>
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: sbx, y: sby }}
        className={cn(className)}
        aria-label={ariaLabel}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sbx, y: sby }}
      className={cn(className)}
      aria-label={ariaLabel}
    >
      {inner}
    </motion.button>
  );
}
