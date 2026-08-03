"use client"

import Image from "next/image"
import Link from "next/link"
import { Target, CheckCircle, Zap, BookOpen, Users, Code, GraduationCap, Clock, Trophy, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const iconMap = {
  1: BookOpen,
  2: Users,
  3: Code,
  4: GraduationCap,
  5: Clock,
  6: Trophy,
}

export default function AboutPage() {
  const t = useTranslations()
  const aboutPage = t.raw("aboutPage") as any

  return (
    <div className="overflow-hidden">

      {/* 1. HERO BANNER */}
      <section className="relative h-56 md:h-72 flex items-center justify-center text-white overflow-hidden -mx-4 lg:-mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80 z-10" />
        <Image
          src="https://i.ibb.co/whBnS4Nh/about_image1.webp"
          alt="About Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide uppercase">About Us</h1>
        </div>
      </section>

      {/* 2. ABOUT + MISSION + VISION */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: stacked images */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <Image
                  src="https://i.ibb.co/whBnS4Nh/about_image1.webp"
                  alt="About SkillBridge"
                  width={580}
                  height={440}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-900 hidden md:block">
                <Image
                  src="https://i.ibb.co/gZjJvXrd/about_image2.jpg"
                  alt="Team"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: About Us text + Mission + Vision */}
            <div className="lg:pl-6">
              <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-2 block">{aboutPage.title}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {aboutPage.heroText.split(".")[0]}.<br />
                <span className="text-orange-400">{aboutPage.heroText.split(".")[1]}.</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{aboutPage.description}</p>

              {/* Mission */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#2196F3]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{aboutPage.purpose.mission.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-12">{aboutPage.purpose.mission.description}</p>
              </div>

              {/* Vision */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{aboutPage.purpose.vision.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-12">{aboutPage.purpose.vision.description}</p>
              </div>

              <Link href="/courses">
                <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-xl transition-colors">
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 3. SERVICES / WHY US CARDS */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-2 block">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{aboutPage.whyUs.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">{aboutPage.whyUs.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* First card: orange accent (featured) */}
            {aboutPage.whyUs.cards.map((card: any, index: number) => {
              const IconComponent = iconMap[card.id as keyof typeof iconMap]
              const isFeatured = index === 0
              return (
                <div
                  key={card.id}
                  className={`rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border ${
                    isFeatured
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFeatured ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/30"}`}>
                    <IconComponent className={`w-6 h-6 ${isFeatured ? "text-white" : "text-[#2196F3]"}`} />
                  </div>
                  <h3 className={`font-bold text-lg ${isFeatured ? "text-white" : "text-gray-900 dark:text-white"}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed flex-1 ${isFeatured ? "text-orange-100" : "text-gray-500 dark:text-gray-400"}`}>{card.description}</p>
                  <Link
                    href="/courses"
                    className={`text-sm font-semibold flex items-center gap-1 mt-auto ${isFeatured ? "text-white hover:text-orange-100" : "text-[#2196F3] hover:text-blue-700"}`}
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.ibb.co/gZjJvXrd/about_image2.jpg"
            alt="CTA Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {aboutPage.startJourney.title}
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">{aboutPage.startJourney.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-[#2196F3] hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-xl transition-colors text-base inline-flex items-center gap-2">
                {aboutPage.startJourney.explore} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold px-10 py-4 rounded-xl transition-colors text-base">
                {aboutPage.startJourney.consultation}
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
