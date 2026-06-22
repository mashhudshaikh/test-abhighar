import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import LeadIntakeRetry from "@/components/lead-intake-retry";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhi Ghar — Curated Pune Homes",
  description:
    "Curated residential real estate across Pune's most considered localities. RERA-verified. Senior-advisor-led.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Phase 2: retries any queued lead intakes from earlier sessions
            where the API was unreachable. Renders nothing visually. */}
        <LeadIntakeRetry />
        {children}
      </body>
    </html>
  );
}