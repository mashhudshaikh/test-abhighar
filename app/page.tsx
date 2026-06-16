import Header from "@/components/header";
import Hero from "@/components/hero";
import DevLogos from "@/components/dev-logos";
import Localities from "@/components/localities";
import FeaturedProjects from "@/components/featured-projects";
import Tools from "@/components/tools";
import Interiors from "@/components/interiors";
import Advisors from "@/components/advisors";
import Testimonials from "@/components/testimonials";
import FeedbackForm from "@/components/feedback-form";
import LatestBlog from "@/components/latest-blog";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import CursorFollower from "@/components/cursor-follower";

export default function HomePage() {
  return (
    <>
      <CursorFollower />
      <Header />
      <main>
        <Hero />
        <DevLogos />
        <Localities />
        <FeaturedProjects />
        <Interiors />
        <Tools />
        <Advisors />
        <Testimonials />
        <FeedbackForm />
        <LatestBlog />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
} 