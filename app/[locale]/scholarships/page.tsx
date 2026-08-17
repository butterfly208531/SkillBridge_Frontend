import { Navbar } from "@/app/[locale]/components/navbar";
import { ScholarshipsSection } from "@/app/[locale]/components/scholarships-section";
import Footer from "@/app/[locale]/components/footer";
import { scholarshipsConfig, isClosed } from "@/lib/scholarships-config";
import { PageViewTracker } from "@/app/[locale]/components/page-view-tracker";

export const metadata = {
  title: "Scholarships | SkillBridge",
  description: "Invest in your future — explore all SkillBridge scholarship programs and apply today.",
};

export default function ScholarshipsPage() {
  const active   = scholarshipsConfig.filter(s => !isClosed(s.deadline)).length;
  const archived = scholarshipsConfig.filter(s =>  isClosed(s.deadline)).length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-montserrat">
      <PageViewTracker page="/scholarships" />
      <Navbar />
      <main className="pt-8">
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-[#1565C0] via-[#2196F3] to-[#42A5F5] dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-14 px-4 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            2026 Scholarship Programs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Invest in Your Future
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Merit and need-based funding to make education accessible. Fully-funded and half-funded programs available.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">{active}</span>
              <span className="text-xs text-white/70 mt-0.5">Active Programs</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">
                {scholarshipsConfig.filter(s => s.fundingType === "full" && !isClosed(s.deadline)).length}
              </span>
              <span className="text-xs text-white/70 mt-0.5">Fully Funded</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">
                {scholarshipsConfig.filter(s => s.fundingType === "half" && !isClosed(s.deadline)).length}
              </span>
              <span className="text-xs text-white/70 mt-0.5">Half Funded</span>
            </div>
            {archived > 0 && (
              <>
                <div className="w-px bg-white/20 hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-white/60">{archived}</span>
                  <span className="text-xs text-white/50 mt-0.5">Archived</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="container mx-auto px-4 pt-10">
          <div className="flex flex-wrap justify-center gap-4 text-xs mb-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <span className="w-3 h-3 rounded-full bg-[#2196F3]" />
              <span className="font-semibold text-[#2196F3]">Fully Funded</span>
              <span className="text-gray-500">— You pay ETB 0</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
              <span className="w-3 h-3 rounded-full bg-[#F57C00]" />
              <span className="font-semibold text-[#F57C00]">Half Funded</span>
              <span className="text-gray-500">— You pay 50%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F57C00]/10 dark:bg-[#F57C00]/20 rounded-lg border border-[#F57C00]/20 dark:border-[#F57C00]/30">
              <span className="w-3 h-3 rounded-full bg-[#F57C00] animate-pulse" />
              <span className="font-semibold text-[#F57C00]">Closing Soon</span>
              <span className="text-gray-500">— Less than 7 days</span>
            </div>
          </div>
        </div>

        <ScholarshipsSection showAll />
      </main>
      <Footer />
    </div>
  );
}
