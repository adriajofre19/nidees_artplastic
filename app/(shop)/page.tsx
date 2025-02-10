import HeaderSection from "@/components/inicio/HeaderSection";
import FeaturesSection from "@/components/inicio/FeaturesSection";
import CategoriesSection from "@/components/inicio/CategoriesSection";
import ImpactSection from "@/components/inicio/ImpactSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeaderSection />
      <FeaturesSection />
      <CategoriesSection />
      <ImpactSection />
    </div>
  );
}