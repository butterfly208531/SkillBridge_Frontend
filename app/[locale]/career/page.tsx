import { Navbar } from "@/app/[locale]/components/navbar";
import { CareerSection } from "@/app/[locale]/components/career-section";
import Footer from "@/app/[locale]/components/footer";

export const metadata = {
  title: "Career Services | SkillBridge",
  description: "We don't just train you — we launch your career. Explore our career support services.",
};

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-montserrat">
      <Navbar />
      <main className="pt-8">
        <CareerSection />
      </main>
      <Footer />
    </div>
  );
}
