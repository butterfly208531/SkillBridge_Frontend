import { Navbar } from "@/app/[locale]/components/navbar";
import { ScholarshipsSection } from "@/app/[locale]/components/scholarships-section";
import Footer from "@/app/[locale]/components/footer";

export const metadata = {
  title: "Scholarships | SkillBridge",
  description: "Invest in your future — explore all SkillBridge scholarship programs and apply today.",
};

export default function ScholarshipsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-montserrat">
      <Navbar />
      <main className="pt-8">
        <ScholarshipsSection showAll />
      </main>
      <Footer />
    </div>
  );
}
