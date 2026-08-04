import { Navbar } from "@/app/[locale]/components/navbar";
import { HeroSection } from "@/app/[locale]/components/hero-section";
import { BootcampsSection } from "@/app/[locale]/components/bootcamps-section";
import { LearningPathsSection } from "@/app/[locale]/components/learning-paths-section";
import { WhySection } from "@/app/[locale]/components/why-section";
import { ProjectsSection } from "@/app/[locale]/components/projects-section";
import { HubSection } from "@/app/[locale]/components/hub-section";
import { ScholarshipsSection } from "@/app/[locale]/components/scholarships-section";
import { TestimonialsSection } from "@/app/[locale]/components/testimonials-section";
import { CommunitySection } from "@/app/[locale]/components/community-section";
import { VideosSection } from "@/app/[locale]/components/videos-section";
import { FinalCTASection } from "@/app/[locale]/components/final-cta-section";
import Footer from "@/app/[locale]/components/footer";

export const metadata = {
      title: "SkillBridge | Upskill with Expert-Led Courses & Training",
      description: "SkillBridge connects learners with expert instructors for high-quality courses, training, and career advancement. Explore our services and join our success stories.",
      openGraph: {
        title: "SkillBridge | Upskill with Expert-Led Courses",
        description: "Join SkillBridge to access top-notch courses, learn from industry-leading instructors, and boost your career with our proven success stories.",
      },
      image: "https://i.ibb.co/ZRYfMLWK/skills.png",
      url: "https://skill-bridge-iot.vercel.app/",
      googleSiteVerification: "tK8jg7pTludPfa4R8AfjqPslodhRAJbKY1AYdI_z70g",
      twitter: {
        card: "summary_large_image",
        title: "SkillBridge | Upskill with Expert-Led Courses",
        description: "Join SkillBridge to access top-notch courses, learn from industry-leading instructors, and boost your career with our proven success stories.",
        creator: "@skillbridge",
        images: ["https://i.ibb.co/ZRYfMLWK/skills.png"],
      },
      icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
        shortcut: "/shortcut-icon.png",
      },
      keywords: [
        "SkillBridge",
        "online courses",
        "expert instructors",
        "career advancement",
        "professional training",
        "upskill",
        "learning platform",
        "success stories",
        "education",
        "skill development"
      ],
      authors: [
        {
          name: "SkillBridge Team",
          url: "https://skill-bridge-iot.vercel.app/",
        },
      ],

}


export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-montserrat">
      <Navbar />
      <HeroSection />
      <BootcampsSection />
      <LearningPathsSection />
      <ProjectsSection />
      <WhySection />
      <HubSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <CommunitySection />
      <VideosSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
