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
      console.log('Updating SEO with settings:', settings);
      
      // Update document title
      const newTitle = settings.seoTitle || "Chidi Ogara - Senior Fullstack Developer";
      if (document.title !== newTitle) {
        document.title = newTitle;
        console.log('Updated title to:', newTitle);
      }

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      const newDescription = settings.seoDescription || 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies.';
      if (metaDescription.content !== newDescription) {
        metaDescription.setAttribute('content', newDescription);
        console.log('Updated description to:', newDescription);
      }

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const newKeywords = settings.seoKeywords || 'fullstack developer, web development, React, Node.js, TypeScript';
      if (metaKeywords.content !== newKeywords) {
        metaKeywords.setAttribute('content', newKeywords);
        console.log('Updated keywords to:', newKeywords);
      }

      // Update Open Graph title
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      if (ogTitle.content !== newTitle) {
        ogTitle.setAttribute('content', newTitle);
      }

      // Update Open Graph description
      let ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      if (ogDescription.content !== newDescription) {
        ogDescription.setAttribute('content', newDescription);
      }

      // Update Open Graph image
      if (settings.ogImage) {
        let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        if (ogImage.content !== settings.ogImage) {
          ogImage.setAttribute('content', settings.ogImage);
        }
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