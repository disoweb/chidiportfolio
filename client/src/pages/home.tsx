import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { Skills } from '@/components/sections/skills';
import { Projects } from '@/components/sections/projects';
import { Contact } from '@/components/sections/contact';
import { Booking } from '@/components/sections/booking';
import { AIChatbot } from '@/components/chatbot/ai-chatbot';
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect } from "react";

export default function Home() {
  const { scrollProgress } = useScrollProgress();
  const { activeSection } = useIntersectionObserver();
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (settings && !loading) {
      // Update document title
      document.title = settings.seoTitle || "Chidi Ogara - Senior Fullstack Developer";

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.seoDescription || 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies.');

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', settings.seoKeywords || 'fullstack developer, web development, React, Node.js, TypeScript');

      // Update Open Graph title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', settings.seoTitle || "Chidi Ogara - Senior Fullstack Developer");

      // Update Open Graph description
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', settings.seoDescription || 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies.');

      // Update Open Graph image
      if (settings.ogImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', settings.ogImage);
      }
    }
  }, [settings, loading]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Skills />
        <Projects />
        <Booking />
        <Contact />
        <AIChatbot />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}