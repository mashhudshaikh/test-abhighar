"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  highlight?: string;       // word to wrap in gold italic
  delay?: number;
  stagger?: number;
}

export default function SplitText({
  text, className, highlight, delay = 0.1, stagger = 0.075,
}: Props) {
  const words = text.split(/(\s+)/);

  return (
    <span className={cn(className)}>
      {words.map((w, i) => {
        if (w.trim() === "") return <span key={i}>{w}</span>;
        const isHl = highlight && w.replace(/[^A-Za-z]/g, "") === highlight;
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline" style={{ paddingBottom: "0.08em" }}>
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 6, filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, rotate: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 1, ease: [0.22, 1, 0.36, 1],
                delay: delay + i * stagger,
              }}
            >
              {isHl ? <em className="text-gold font-semibold not-italic" style={{ fontStyle: "italic" }}>{w}</em> : w}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
