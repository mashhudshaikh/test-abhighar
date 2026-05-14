"use client";
import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Bail on touch devices and when user prefers reduced motion
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setEnabled(true);

    let mx = -100, my = -100;
    let dx = -100, dy = -100;
    let rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dotRef.current)  dotRef.current.style.transform  = "translate3d(" + dx + "px, " + dy + "px, 0) translate(-50%, -50%)";
      if (ringRef.current) ringRef.current.style.transform = "translate3d(" + rx + "px, " + ry + "px, 0) translate(-50%, -50%)";
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => { dotRef.current?.classList.add("grow"); ringRef.current?.classList.add("grow"); };
    const onLeave = () => { dotRef.current?.classList.remove("grow"); ringRef.current?.classList.remove("grow"); };

    // Use event delegation on document so dynamically-added interactive elements work too
    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      return !!el.closest("a, button, [data-cursor-grow]");
    };

    const onMouseOver = (e: MouseEvent) => {
      if (isInteractive(e.target as HTMLElement)) onEnter();
    };
    const onMouseOut = (e: MouseEvent) => {
      const from = e.target as HTMLElement;
      const to = e.relatedTarget as HTMLElement | null;
      if (isInteractive(from) && !isInteractive(to)) onLeave();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  // Don't render DOM elements at all on touch/reduced-motion devices
  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}