# Abhi Ghar — Next.js Real Estate Site

A production-ready Next.js 14 (App Router) implementation of the Abhi Ghar real estate landing page, with Framer Motion animations, Tailwind CSS, and TypeScript.

## ✨ Features

- **Typography**: Fraunces serif (hero H1 + brand wordmark only) + Inter sans (everything else)
- **Lerp-damped parallax hero** — `useScroll` + `useSpring` + `useTransform`
- **Word-by-word headline reveal** with stagger and blur entry
- **Magnetic CTA buttons** — two-layer cursor attraction via `useMotionValue` + `useSpring`
- **Spring-animated character counter** in the feedback form — exact port of the original Motion snippet (stiffness 700, damping 80)
- **EMI calculator** with live tabular-num display
- **Smart WhatsApp FAB** that lifts above the footer via IntersectionObserver
- **Soft cursor follower** with lag (hidden on touch)
- **Animated gradient blobs** with continuous drift physics
- **Accessibility**: respects `prefers-reduced-motion`, proper semantic HTML, ARIA labels

## 📋 Prerequisites

You need **Node.js 18.17+** installed. Check your version:

```bash
node --version
```

If you don't have Node.js, install it from [nodejs.org](https://nodejs.org/) (use the LTS version).

## 🚀 Quick Start

### Option A — From VS Code (recommended)

1. **Install VS Code** if you don't have it: [code.visualstudio.com](https://code.visualstudio.com/)
2. **Install recommended VS Code extensions** (optional but helpful):
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)
   - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
3. **Open the folder** in VS Code: `File → Open Folder…` → select the `abhi-ghar` folder
4. **Open the integrated terminal**: `Terminal → New Terminal` (or `` Ctrl+` `` / `` Cmd+` ``)
5. **Install dependencies**:
   ```bash
   npm install
   ```
   This will take 30–90 seconds and create the `node_modules/` folder.
6. **Run the dev server**:
   ```bash
   npm run dev
   ```
7. **Open** [http://localhost:3000](http://localhost:3000) in your browser

The page hot-reloads on every save.

### Option B — From any terminal

```bash
cd path/to/abhi-ghar
npm install
npm run dev
```

## 📁 Project Structure

```
abhi-ghar/
├── app/
│   ├── layout.tsx          ← Root layout, fonts (Fraunces + Inter)
│   ├── page.tsx            ← Home page composition
│   └── globals.css         ← Tailwind + design tokens + typography classes
├── components/
│   ├── header.tsx          ← Sticky nav (Fraunces wordmark)
│   ├── hero.tsx            ← Parallax hero (Fraunces H1)
│   ├── dev-logos.tsx       ← SVG developer logo marquee
│   ├── localities.tsx      ← 6 locality cards
│   ├── featured-projects.tsx ← 3 hero properties
│   ├── tools.tsx           ← EMI calc + brokerage + loans
│   ├── advisors.tsx        ← Team grid
│   ├── testimonials.tsx    ← Reviews
│   ├── feedback-form.tsx   ← Form with spring counter
│   ├── footer.tsx          ← Dark navy footer
│   ├── whatsapp-float.tsx  ← Smart-shift FAB
│   ├── cursor-follower.tsx ← Custom cursor
│   └── ui/
│       ├── brand-mark.tsx  ← Logo wrapper with optional glow
│       ├── magnetic-button.tsx
│       ├── split-text.tsx
│       ├── reveal.tsx
│       └── counter.tsx
├── lib/
│   ├── data.ts             ← Localities, projects, advisors, testimonials
│   └── utils.ts            ← clsx helper
├── public/
│   └── logo.png            ← Your brand logo
├── tailwind.config.ts      ← Theme tokens (navy/gold/ivory/slate)
├── next.config.mjs         ← Image remote patterns
├── tsconfig.json
└── package.json
```

## 🎨 Typography System

Per the design spec, Fraunces serif is used **only** on:
- Hero H1 ("Find your Pune home.")
- Brand wordmark ("Abhi Ghar")
- Italic accent words (`<em>`)

Everything else uses **Inter sans**:

| Element              | Class            | Size                    | Weight | Notes                          |
|----------------------|------------------|-------------------------|--------|--------------------------------|
| Hero H1              | `.h1-hero`       | clamp(36, 6vw, 56)px    | 500    | Fraunces, lh 1.05, ls -0.02em  |
| Section H2           | `.h2-section`    | clamp(28, 4vw, 36)px    | 500    | Inter, lh 1.15                 |
| Card H3              | `.h3-card`       | clamp(18, 2vw, 20)px    | 500    | Inter                          |
| Eyebrow              | `.eyebrow`       | 11px                    | 600    | Inter, uppercase, ls 0.12em    |
| Body                 | `.body-base`     | clamp(15, 1.5vw, 16)px  | 400    | Inter, lh 1.55                 |
| Meta                 | `.meta`          | 13px                    | 400    | Inter                          |
| Price                | `.price`         | clamp(18, 2vw, 22)px    | 500    | Inter, tabular-nums            |

## 🎨 Design Tokens

All colors are defined as HSL CSS variables in `app/globals.css` and referenced through Tailwind in `tailwind.config.ts`:

```ts
navy:       hsl(215 67% 14%)
navy-80:    hsl(214 54% 22%)
gold:       hsl(36 54% 54%)
gold-hover: hsl(35 47% 48%)
gold-light: hsl(34 86% 96%)
ivory:      hsl(36 36% 96%)
slate:      hsl(215 18% 35%)
steel:      hsl(211 34% 67%)
brass:      hsl(40 36% 55%)
```

Use them in components with Tailwind utilities: `bg-navy`, `text-gold`, `border-gold-hover`, `bg-gold/85`, etc.

## 🛠️ Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # Lint with Next's ESLint config
```

## 🚀 Deploying

The easiest deployment is [Vercel](https://vercel.com):
1. Push the repo to GitHub
2. Import the repo on Vercel
3. Vercel auto-detects Next.js — click Deploy

For other platforms (Netlify, Cloudflare Pages, self-hosted), follow the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

## 🐛 Troubleshooting

**`'next' is not recognized` / `command not found: next`**
Run `npm install` first — it installs Next.js locally.

**Images don't load**
The Unsplash image URLs are whitelisted in `next.config.mjs`. If you swap images to a different host, add that hostname to `images.remotePatterns`.

**Port 3000 already in use**
Run on a different port: `npm run dev -- -p 3001`

**TypeScript errors in editor but build works**
Restart the TypeScript server in VS Code: `Cmd/Ctrl+Shift+P` → "TypeScript: Restart TS Server".

## 📜 License

MIT.
