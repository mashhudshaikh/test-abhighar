// Terms of Use — AbhiGhar
//
// Server Component (no "use client" directive) — pre-rendered at build time
// and fully SEO-indexable.
//
// IMPORTANT — legal review required.
// The content below was drafted to reflect AbhiGhar's actual business model:
// real-estate advisory in Pune, lead capture and project introductions,
// interior design services, no buyer-side brokerage (paid by developers).
// The document is grounded in Indian law: the Indian Contract Act 1872,
// the IT Act 2000 + IT Rules 2021, MAHARERA 2016, RERA 2016 (national),
// the Consumer Protection Act 2019, and the Indian arbitration framework.
// It is NOT a substitute for advice from an Indian advocate — please have
// a qualified lawyer review and amend before going live.
//
// Search for "[REPLACE:" markers to update items that need real values.

import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title: "Terms of Use — AbhiGhar",
  description:
    "The legal terms governing your use of AbhiGhar's website, advisory services, and interior design offerings in Pune.",
};

export default function TermsOfUsePage() {
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

          <div className="mb-10">
            <div className="eyebrow text-[#6B4F23] mb-3">Legal</div>
            <h1 className="font-display text-4xl sm:text-5xl text-navy leading-[1.1] tracking-tight">
              Terms of Use
            </h1>
            <p className="text-sm text-slate mt-4">
              Last updated: <span className="font-semibold text-navy">{lastUpdated}</span>
            </p>
          </div>

          <article className="space-y-8 text-[15px] leading-relaxed text-navy/85">

            <Section title="1. Acceptance of these terms">
              <P>
                These Terms of Use ("Terms") govern your access to and use of the AbhiGhar website
                (abhighar.in), our advisory services, and our interior design offerings (together,
                the "Services"). By visiting our site, submitting an enquiry, calling our number,
                or engaging with us in any way, you agree to be bound by these Terms.
              </P>
              <P>
                If you do not agree to any part of these Terms, please stop using the Services. If
                you are using the Services on behalf of an organisation, you confirm that you have
                the authority to bind that organisation.
              </P>
            </Section>

            <Section title="2. About AbhiGhar">
              <P>
                AbhiGhar is a real-estate advisory operating in Pune, Maharashtra. We are a RERA-
                registered channel partner with MAHARERA Registration No.
                <strong> A031262401068</strong>. We help home buyers discover, evaluate, and book
                residential properties, and we provide interior design services through our in-house
                team and partner designers.
              </P>
              <P>
                <strong>We do not charge buyers a brokerage fee.</strong> Our compensation comes
                from developers when a transaction is completed. This is disclosed on our website
                and is reflected in our advisory approach: we represent your interests, not the
                developer's, even though they pay us.
              </P>
            </Section>

            <Section title="3. Your obligations as a user">
              <P>By using our Services, you agree to:</P>
              <Ul items={[
                "Provide accurate, current, and complete information when you submit any enquiry, form, or request",
                "Use the Services only for genuine, lawful purposes related to real-estate or interior design enquiries",
                "Not impersonate any other person, build false profiles, or misrepresent your relationship with anyone",
                "Not use the Services to spam, harass, defame, or harm AbhiGhar, our team, our partners, or other users",
                "Not attempt to scrape, reverse-engineer, copy, or otherwise extract our property data, listings, or proprietary content",
                "Not introduce viruses, malicious code, or attempt to disrupt the Services",
                "Comply with all applicable Indian laws when using the Services",
              ]} />
            </Section>

            <Section title="4. Property information and listings">
              <P>
                We curate property listings from RERA-registered developers and our own market
                research. While we make every reasonable effort to ensure that listings are accurate,
                we cannot guarantee the following:
              </P>
              <Ul items={[
                "That pricing shown is the final or current price — developers change pricing without notice; what you see on the site is indicative",
                "That every unit shown is available — inventory changes quickly, especially in popular projects",
                "That images, floor plans, or 3D renders shown are 100% representative — final delivery may vary",
                "That possession dates listed will be met — these depend on the developer; the RERA-declared possession date is the legally binding one",
                "That third-party data (amenity distances, market trends, EMI calculations) is exact — these are estimates for planning purposes only",
              ]} />
              <P>
                Before any booking, we will provide you with the official RERA documentation, sales
                agreement, and current developer pricing. Your booking decision should be based on
                those documents, not on our website content.
              </P>
            </Section>

            <Section title="5. Our advisory services">
              <P>
                AbhiGhar provides advisory services in good faith. Our advisors share opinions,
                comparisons, and recommendations based on our experience and market knowledge.
                Our advice is for your information only. The decision to book, finance, or invest
                in any property is yours alone, and you accept the consequences of that decision.
              </P>
              <P>
                We are not licensed financial advisors, tax advisors, or legal counsel. For
                home-loan structuring, tax planning, or legal review of agreements, please consult
                qualified professionals. We are happy to refer you to professionals we trust.
              </P>
            </Section>

            <Section title="6. Interior design services">
              <P>
                If you engage us for interior design, the specific scope, timeline, and price will
                be governed by a separate signed agreement. These Terms continue to apply alongside
                that agreement. Our standard interior-design commitments — 10-year warranty on
                woodwork, 45-day average delivery, "no-cost EMI options" — are subject to the
                terms specified in the project-specific quotation, and may be amended for that
                project as agreed in writing.
              </P>
            </Section>

            <Section title="7. Communication and consent">
              <P>
                When you submit an enquiry, share your phone number, or initiate a WhatsApp
                conversation with us, you consent to AbhiGhar (and the specific developer, if
                applicable) contacting you by phone, SMS, WhatsApp, and email for the purposes
                of responding to your enquiry, following up, and sharing relevant updates.
              </P>
              <P>
                This consent overrides any DND (Do-Not-Disturb) preference you may have registered,
                but only for the limited purpose of your active enquiry. You can withdraw consent
                at any time by writing to <strong>contact@abhighar.com</strong>; we will cease
                contact within 7 working days.
              </P>
            </Section>

            <Section title="8. Intellectual property">
              <P>
                The AbhiGhar name, logo, brand marks, website design, content (text, images,
                graphics, video), and underlying code are owned by AbhiGhar and protected by
                Indian copyright, trademark, and other intellectual property laws.
              </P>
              <P>You may:</P>
              <Ul items={[
                "View and read the content on our site for your personal, non-commercial use",
                "Share links to our pages on social media or via messaging",
                "Save brochures and floor plans we send you for personal reference",
              ]} />
              <P>You may not, without our prior written permission:</P>
              <Ul items={[
                "Reproduce, modify, distribute, or republish any AbhiGhar content for commercial purposes",
                "Use our brand name or logo in any way that implies endorsement or partnership",
                "Use scraping tools, bots, or automated systems to extract data from our site",
              ]} />
            </Section>

            <Section title="9. Third-party links and partners">
              <P>
                Our site may contain links to developer websites, RERA portals, bank EMI
                calculators, or other third-party resources. We are not responsible for the content,
                privacy practices, or accuracy of these third-party sites. Use them at your own
                risk and review their terms before sharing any information with them.
              </P>
            </Section>

            <Section title="10. Disclaimers">
              <P>
                The Services are provided "as is" and "as available." To the maximum extent
                permitted by Indian law, we make no warranties — express, implied, or statutory —
                about the Services, including merchantability, fitness for a particular purpose,
                accuracy of information, or uninterrupted availability of the site.
              </P>
              <P>
                We do not warrant that the Services will be error-free, secure from cyber-attack,
                or available without interruption. We do not warrant that any property you discover
                through us will meet your specific needs, appreciate in value, or be delivered on
                time by the developer.
              </P>
            </Section>

            <Section title="11. Limitation of liability">
              <P>
                To the maximum extent permitted by Indian law, AbhiGhar (and our directors,
                employees, agents, and partners) will not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising out of your use of the Services,
                including but not limited to lost profits, lost opportunities, lost data, or
                business interruption.
              </P>
              <P>
                Where liability cannot be excluded by law, our total liability to you for any claim
                arising out of or related to the Services is limited to the amount you have paid
                AbhiGhar directly in the 12 months preceding the claim (if any), or ₹10,000,
                whichever is higher.
              </P>
            </Section>

            <Section title="12. Indemnity">
              <P>
                You agree to indemnify and hold AbhiGhar harmless from any claim, damage, loss, or
                expense (including reasonable legal fees) arising out of your breach of these Terms,
                your violation of Indian law, or your infringement of any third party's rights
                through your use of the Services.
              </P>
            </Section>

            <Section title="13. Termination">
              <P>
                We may suspend or terminate your access to the Services at any time, with or without
                notice, if we believe you have violated these Terms, are using the Services
                fraudulently, or are causing harm to other users or our business. Termination does
                not affect any rights or obligations that have accrued before termination.
              </P>
            </Section>

            <Section title="14. Governing law and disputes">
              <P>
                These Terms are governed by the laws of India. Any dispute arising out of or in
                connection with these Terms or the Services will be subject to the exclusive
                jurisdiction of the courts at <strong>Pune, Maharashtra</strong>.
              </P>
              <P>
                Before initiating any court proceeding, both parties agree to attempt to resolve
                the dispute through good-faith discussion for at least 30 days. If discussion fails,
                the parties may refer the dispute to arbitration under the Arbitration and
                Conciliation Act 1996, with a sole arbitrator appointed by mutual agreement, seated
                in Pune, and conducted in English.
              </P>
            </Section>

            <Section title="15. Grievance and consumer-protection redressal">
              <P>
                If you have a complaint about our Services, please contact our grievance officer
                first (details below). Under the Consumer Protection Act 2019 you also have access
                to the consumer redressal forums of Pune district, the state commission of
                Maharashtra, and the National Consumer Disputes Redressal Commission. Under the IT
                Rules 2021, complaints relating to digital content are resolved within 15 days of
                receipt by our grievance officer.
              </P>
            </Section>

            <Section title="16. Changes to these Terms">
              <P>
                We may update these Terms as our Services evolve or as Indian law changes. We will
                update the "Last updated" date at the top, and for material changes we will notify
                you by a prominent notice on the homepage or by email if you have shared your
                address with us. Continued use of the Services after a material change constitutes
                acceptance of the updated Terms.
              </P>
            </Section>

            <Section title="17. Miscellaneous">
              <Ul items={[
                "If any provision of these Terms is held unenforceable by a court, the remaining provisions remain in full effect",
                "Our failure to enforce any provision does not waive our right to enforce it later",
                "These Terms (together with our Privacy Policy and any signed engagement agreement) constitute the complete agreement between you and AbhiGhar regarding the Services",
                "You may not transfer your rights under these Terms without our written consent; we may transfer our rights as part of a business sale or restructuring",
              ]} />
            </Section>

            <Section title="18. Contact us">
              <div className="bg-white border border-navy/10 rounded-card p-5 sm:p-6 not-prose">
                <div className="text-xs font-semibold text-[#6B4F23] uppercase tracking-wider mb-3">Grievance Officer</div>
                <div className="space-y-1 text-[14px]">
                  <div><span className="font-semibold text-navy">Name:</span> Sarika</div>
                  <div><span className="font-semibold text-navy">Email:</span> contact@abhighar.com</div>
                  <div><span className="font-semibold text-navy">Phone:</span> +91 9890122755</div>
                  <div><span className="font-semibold text-navy">Hours:</span> Mon&ndash;Sun, 10 AM &ndash; 8 PM IST</div>
                  <div>
                    <span className="font-semibold text-navy">MAHARERA registration:</span> A031262401068
                  </div>
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