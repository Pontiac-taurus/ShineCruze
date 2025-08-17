import { AboutSection } from '@/components/home/AboutSection';
import { ContactSection } from '@/components/home/ContactSection';
import { GallerySection } from '@/components/home/GallerySection';
import { HeroSection } from '@/components/home/HeroSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ServicesHighlight } from '@/components/home/ServicesHighlight';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesHighlight />
      <TestimonialsSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
}
