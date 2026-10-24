import Header from '@/components/header';
import HeroSection from '@/components/heroSection';
import PartnerCategoriesSection from '@/components/partnerCategoriesSection';
import OurCollectionSection from '@/components/ourCollectionSection';
import WhyChooseUs from '@/components/Whychooseus';
import ContactUs from '@/components/contactus';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-pure-white text-deep-navy selection:bg-soft-aqua selection:text-deep-navy">
      <Header />
      <div className="flex-1">
        <HeroSection />
        <PartnerCategoriesSection />
        <OurCollectionSection />
        <WhyChooseUs />
        <ContactUs />
      </div>
      <Footer />
    </main>
  );
}