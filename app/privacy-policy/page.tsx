// Privacy Policy — AbhiGhar
//
// This file is a Server Component (no "use client" directive) so it
// pre-renders at build time and is fully SEO-indexable.
//
// IMPORTANT — legal review required.
// The content below was drafted to reflect AbhiGhar's actual business
// (Pune real-estate advisory, lead capture via web forms / WhatsApp /
// phone, interior design services, no buyer-side brokerage), grounded
// in Indian law: the Digital Personal Data Protection Act 2023 (DPDP),
// the IT Act 2000 + IT Rules 2021, MAHARERA 2016, and the Consumer
// Protection Act 2019. It is NOT a substitute for advice from an Indian
// advocate — please have a qualified lawyer review and amend before
// going live. A 30-minute review with a Pune corporate lawyer typically
// suffices.
//
// To update specific items (contact email, registered address, DPO
// name, etc.), search for "[REPLACE:" markers.

import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title: "Privacy Policy — AbhiGhar",
  description:
    "How AbhiGhar collects, uses, stores, and protects your personal information when you interact with our real-estate advisory services in Pune.",
};

export default function PrivacyPolicyPage() {
  // Single source of truth for the "last updated" date shown on the page.
  // Bump this whenever the policy text materially changes — that's the
  // signal a returning visitor needs to re-read the document.
  const lastUpdated = "17 June 2026";

  return (
    <>
      <Header />
      {/*
        Header-clearance note: the site header is `fixed top-0` (~66px on
        mobile / ~82px on desktop). The earlier `py-12 sm:py-16 lg:py-20`
        gave too little top padding on mobile (48px), so the page heading
        slipped under the header pill. Splitting padding into top + bottom
        and bumping the top values to pt-28 / pt-32 / pt-36 (112 / 128 /
        144 px) gives the heading comfortable breathing room above it at
        every breakpoint, while bottom padding stays as before so the
        spacing into the footer is unchanged.
      */}
      <main className="bg-ivory min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
        <div className="container-x max-w-3xl">

          {/* Page heading */}
          <div className="mb-10">
            <div className="eyebrow text-[#6B4F23] mb-3">Legal</div>
            <h1 className="font-display text-4xl sm:text-5xl text-navy leading-[1.1] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate mt-4">
              Last updated: <span className="font-semibold text-navy">{lastUpdated}</span>
            </p>
          </div>

          {/* Body — Tailwind prose-like styling with manual spacing so we
              don't need the @tailwindcss/typography plugin. Headings use
              the same font-display / text-navy treatment as the rest of
              the site for visual consistency. */}
          <article className="space-y-8 text-[15px] leading-relaxed text-navy/85">

            <Section title="1. Who we are">
              <P>
                AbhiGhar is a real-estate advisory operating in Pune, Maharashtra. We help home buyers
                discover, evaluate, and book residential properties; we also provide interior design
                services through our in-house team and partner designers. We operate the website
                <strong> abhighar.com</strong> and our brand operations are headquartered in Pune.
              </P>
              <P>
                For privacy questions, write to us at <strong>contact@abhighar.com</strong> or
                +91 9890122755. The registered address and the name of our designated grievance
                officer are listed at the end of this document.
              </P>
            </Section>

            <Section title="2. The information we collect">
              <P>
                When you interact with AbhiGhar we collect only what we need to help you find a home or
                an interior service, and to operate our business honestly.
              </P>
              <H3>2.1 Information you give us directly</H3>
              <Ul items={[
                "Your name, phone number, email address, and WhatsApp number when you fill out an enquiry form, talk-to-an-advisor request, or interior design consultation form",
                "Your preferred property type, configuration (e.g. 2 BHK), locality, and budget range when you use the search filters or submit a brief",
                "Any message you write in the 'Anything specific?' field on our enquiry forms",
                "Feedback and testimonials you choose to share via the 'Share Your Story' form",
              ]} />
              <H3>2.2 Information collected automatically</H3>
              <Ul items={[
                "Device type, browser type, operating system, screen size, and approximate location (city-level) via standard server logs",
                "Pages you visit on our site, time spent, and the path you took (using cookies and similar technologies — see Section 6)",
                "Referring URL — i.e. which website or campaign brought you to us",
              ]} />
              <H3>2.3 Information from third parties</H3>
              <Ul items={[
                "If you connect via WhatsApp or call our number, we receive your phone number and call/message metadata",
                "If a developer, banker, or interior partner refers you to us, we may receive your name and contact details from them",
              ]} />
            </Section>

            <Section title="3. How we use your information">
              <P>We use the information we collect for the following purposes only:</P>
              <Ul items={[
                "Connecting you with a senior advisor who can answer your property or design questions",
                "Sharing curated property options that match what you've told us about your needs",
                "Sending you brochures, floor plans, or pricing for projects you've enquired about",
                "Following up on your enquiry — by phone, WhatsApp, or email — for as long as your home search is active",
                "Sending occasional updates about new launches, ready-possession projects, or interior offerings (you can opt out anytime)",
                "Operating, debugging, and improving our website",
                "Complying with applicable laws, including RERA disclosure requirements when you proceed with a booking",
              ]} />
              <P>
                We do <strong>not</strong> sell your personal data to third parties. We do not run
                advertising auctions that use your data, and we do not share your contact details
                with brokers or developers who haven't been engaged in your specific enquiry.
              </P>
            </Section>

            <Section title="4. Who we share your information with">
              <P>We share information only in the following situations, and only the minimum needed:</P>
              <H3>4.1 Developers and channel partners</H3>
              <P>
                When you express interest in a specific project, we share your name and phone number
                with that developer's sales team so they can give you accurate, project-specific
                information (pricing, availability, possession schedule). We do this only with your
                consent — by submitting the enquiry, you're agreeing to that specific introduction.
              </P>
              <H3>4.2 Service providers</H3>
              <P>
                We use vendors for hosting (Netlify, Vercel), email delivery, WhatsApp Business API,
                and analytics. These vendors process data on our behalf under contracts that require
                them to protect it and not use it for their own purposes.
              </P>
              <H3>4.3 Legal obligations</H3>
              <P>
                We may disclose information if required by law, court order, or government request,
                including for compliance with MAHARERA, the IT Act 2000, the DPDP Act 2023, the
                Income Tax Act, or in connection with prevention of fraud.
              </P>
              <H3>4.4 Business transfers</H3>
              <P>
                If AbhiGhar is acquired or merged with another business, your information may be
                transferred as part of that transaction. You will be notified before that happens.
              </P>
            </Section>

            <Section title="5. How long we keep your information">
              <P>
                We retain personal data only as long as it serves the purpose for which it was collected:
              </P>
              <Ul items={[
                "Active enquiries: until the enquiry is resolved (typically 6–12 months)",
                "Closed/inactive enquiries: up to 36 months from last contact, after which we anonymise it for analytics",
                "Booking and transaction records: 7 years, as required by Indian tax law",
                "Web server logs: 90 days",
                "Marketing email/WhatsApp opt-ins: until you opt out, after which we keep a minimal opt-out record",
              ]} />
            </Section>

            <Section title="6. Cookies and similar technologies">
              <P>We use cookies sparingly. The cookies we set fall into three categories:</P>
              <Ul items={[
                "Strictly necessary: remembering which offer banners you've dismissed, keeping your search filters across pages",
                "Analytics: understanding which projects and pages get attention, so we know what to feature (no cross-site tracking)",
                "Functional: remembering whether you prefer the desktop or mobile experience on a hybrid device",
              ]} />
              <P>
                You can disable cookies via your browser settings. Some site features (saved searches,
                dismissed banners) will stop working if you do. We do not use advertising or
                retargeting cookies.
              </P>
            </Section>

            <Section title="7. Your rights under the DPDP Act 2023">
              <P>
                As a Data Principal under India's Digital Personal Data Protection Act 2023, you have
                the right to:
              </P>
              <Ul items={[
                "Access the personal data we hold about you",
                "Correct inaccurate or incomplete data",
                "Erase your data (subject to our legal retention obligations)",
                "Withdraw your consent at any time (this won't affect lawful processing already done)",
                "Nominate someone to exercise these rights on your behalf in the event of death or incapacity",
                "Raise a grievance with our grievance officer (contact details below); if unresolved within 30 days, escalate to the Data Protection Board of India",
              ]} />
              <P>
                To exercise any of these rights, email <strong>contact@abhighar.com</strong> with the
                subject line "DPDP request". We will respond within 30 days.
              </P>
            </Section>

            <Section title="8. How we protect your information">
              <P>
                We take reasonable technical and organisational steps to keep your data safe:
                encrypted connections (HTTPS) for the website, restricted access for our team
                members (only those who need to see your enquiry can), regular security reviews,
                and vendor due diligence.
              </P>
              <P>
                No internet transmission is ever 100% secure. If we become aware of a data breach
                that materially affects you, we will notify you and the Data Protection Board of
                India in accordance with the DPDP Act.
              </P>
            </Section>

            <Section title="9. Children">
              <P>
                AbhiGhar's services are for adults (18+). We do not knowingly collect data from
                children. If you believe a child has submitted information through our site,
                please contact us and we will delete it.
              </P>
            </Section>

            <Section title="10. Changes to this policy">
              <P>
                We may update this policy as our services evolve or as Indian law changes. We will
                update the "Last updated" date at the top, and for material changes we will notify
                you by email or a prominent notice on the homepage. The current version of the
                policy is the one in effect.
              </P>
            </Section>

            <Section title="11. Contact us">
              <div className="bg-white border border-navy/10 rounded-card p-5 sm:p-6 not-prose">
                <div className="text-xs font-semibold text-[#6B4F23] uppercase tracking-wider mb-3">Grievance Officer</div>
                <div className="space-y-1 text-[14px]">
                  <div><span className="font-semibold text-navy">Name:</span> [REPLACE: Name of designated officer]</div>
                  <div><span className="font-semibold text-navy">Email:</span> contact@abhighar.com</div>
                  <div><span className="font-semibold text-navy">Phone:</span> +91 9890122755</div>
                  <div><span className="font-semibold text-navy">Hours:</span> Mon–Sun, 10 AM – 8 PM IST</div>
                </div>
              </div>
            </Section>

          </article>

        </div>
      </main>
      <Footer />
    </>
  );
}

// Small layout primitives. Kept inline to this file so there's nothing to
// import or maintain elsewhere — the legal pages are mostly text and
// re-using these would actually be more confusing than helpful.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl sm:text-3xl text-navy leading-tight tracking-tight mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-sans font-bold text-navy text-[16px] mt-5 mb-2">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-navy/85">{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-navy/85 marker:text-gold">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}