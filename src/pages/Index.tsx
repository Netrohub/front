import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <Starfield />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Index;
