import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from './_sections/HeroSection';
import { WhyUsSection } from './_sections/WhyUsSection';
import { CtaBannerSection } from './_sections/CtaBannerSection';

/* Client components — dynamically imported to avoid blocking initial HTML render
   (vercel-react-best-practices: bundle-dynamic-imports) */
const BestSellersSection = dynamic(
  () => import('./_sections/BestSellersSection').then(m => m.BestSellersSection),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import('./_sections/TestimonialsSection').then(m => m.TestimonialsSection),
  { ssr: false }
);


export const metadata: Metadata = {
  title: 'Blossom — Premium Flower Shop',
  description:
    'Discover handcrafted bouquets & floral arrangements. Same-day delivery available. Order fresh flowers online.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <BestSellersSection />
        <TestimonialsSection />
        <WhyUsSection />
        <CtaBannerSection />
      </main>
      <Footer />
    </>
  );
}
