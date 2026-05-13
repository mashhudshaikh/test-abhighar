import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:        "hsl(var(--navy) / <alpha-value>)",
        "navy-80":   "hsl(var(--navy-80) / <alpha-value>)",
        gold:        "hsl(var(--gold) / <alpha-value>)",
        "gold-hover":"hsl(var(--gold-hover) / <alpha-value>)",
        "gold-light":"hsl(var(--gold-light) / <alpha-value>)",
        ivory:       "hsl(var(--ivory) / <alpha-value>)",
        slate:       "hsl(var(--slate) / <alpha-value>)",
        steel:       "hsl(var(--steel) / <alpha-value>)",
        brass:       "hsl(var(--brass) / <alpha-value>)",
        success:     "hsl(var(--success) / <alpha-value>)",
        "border-l":  "hsl(var(--border-l) / <alpha-value>)",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      letterSpacing: {
        brand:  "0.04em",
        label:  "0.12em",
        tight:  "-0.02em",
      },
      borderRadius: {
        btn:   "8px",
        card:  "16px",
        panel: "12px",
        pill:  "999px",
      },
      boxShadow: {
        cta:  "0 8px 24px hsl(var(--gold) / 0.30)",
        card: "0 1px 0 hsl(var(--navy) / 0.04), 0 12px 32px hsl(var(--navy) / 0.06)",
        hover:"0 24px 60px hsl(var(--navy) / 0.12)",
      },
      animation: {
        "drift-1": "drift1 22s ease-in-out infinite",
        "drift-2": "drift2 26s ease-in-out infinite",
        "drift-3": "drift3 30s ease-in-out infinite",
        "drift-4": "drift4 28s ease-in-out infinite",
        "slide":   "slide 42s linear infinite",
        "pulse-wa":"pulseWa 2.4s infinite",
      },
      keyframes: {
        drift1: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(-60px,40px) scale(1.08)" },
          "66%":     { transform: "translate(40px,-30px) scale(0.95)" },
        },
        drift2: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(50px,-40px) scale(0.92)" },
          "66%":     { transform: "translate(-30px,50px) scale(1.1)" },
        },
        drift3: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%":     { transform: "translate(-40px,60px) scale(1.15)" },
        },
        drift4: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%":     { transform: "translate(60px,-50px) scale(0.85)" },
        },
        slide:    { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulseWa:  {
          "0%,100%": { boxShadow: "0 14px 36px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.5)" },
          "50%":     { boxShadow: "0 14px 36px rgba(37,211,102,0.45), 0 0 0 18px rgba(37,211,102,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
