"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, Target, Code, Star, CheckCircle, Clock, Trophy, BookOpen, Zap, GraduationCap, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const iconMap: Record<number, any> = {
  1: BookOpen,
  2: Users,
  3: Code,
  4: GraduationCap,
  5: Clock,
  6: Trophy,
}

const cardAccents = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-500", border: "border-blue-100 dark:border-blue-900" },
  { bg: "bg-green-50 dark:bg-green-950/30", icon: "text-green-500", border: "border-green-100 dark:border-green-900" },
  { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "text-purple-500", border: "border-purple-100 dark:border-purple-900" },
  { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-500", border: "border-orange-100 dark:border-orange-900" },
  { bg: "bg-pink-50 dark:bg-pink-950/30", icon: "text-pink-500", border: "border-pink-100 dark:border-pink-900" },
  { bg: "bg-teal-50 dark:bg-teal-950/30", icon: "text-teal-500", border: "border-teal-100 dark:border-teal-900" },
]

export default function AboutPage() {
  const t = useTranslations()
  const a = t.raw("aboutPage") as any

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 -z-10" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-[#2196F3] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              {a.title}
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-[#2196F3]">Learn.</span>{" "}
              <span className="text-[#2196F3]">Build.</span>{" "}
              <span className="text-orange-400">Launch.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-lg">
              {a.description}
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">4.8/5 {a.ratingText}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Trophy className="w-4 h-4 text-[#2196F3]" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{a.jobText}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl bg-gradient-to-br from-[#2196F3] to-blue-700 flex flex-col items-center justify-center shadow-2xl shadow-blue-200 dark:shadow-blue-900/40">
                <Image
                  src="https://i.ibb.co/ZRYfMLWK/skills.png"
                  alt="SkillBridge Logo"
                  width={120}
                  height={120}
                  className="rounded-full mb-4 border-4 border-white/30"
                />
                <h3 className="text-xl font-bold text-white">SkillBridge</h3>
                <p className="text-blue-100 text-sm">Institute Of Technology</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-400 rounded-2xl -z-10 opacity-60" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-xl -z-10 opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="https://i.ibb.co/whBnS4Nh/about_image1.webp"
                alt="Our Story"
                width={600}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#2196F3] text-white rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-2xl font-extrabold">500+</p>
              <p className="text-xs text-blue-100">Graduates</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#2196F3] text-sm font-semibold uppercase tracking-widest mb-3 block">Our Story</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{a.storyHeading}</h2>
            <p className="text-[#2196F3] font-semibold mb-6">{a.storySubheading}</p>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>{a.storyText1}</p>
              <p>{a.storyText2}</p>
              <p>{a.storyText3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PURPOSE ── */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] text-sm font-semibold uppercase tracking-widest mb-3 block">Purpose</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{a.purpose.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{a.purpose.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-[#2196F3]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#2196F3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2196F3]">{a.purpose.mission.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{a.purpose.mission.description}</p>
              <div className="space-y-3">
                {Object.values(a.purpose.mission.checkPoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#2196F3] shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            {/* Vision */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-orange-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-orange-500">{a.purpose.vision.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{a.purpose.vision.description}</p>
              <div className="space-y-3">
                {Object.values(a.purpose.vision.checkpoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] text-sm font-semibold uppercase tracking-widest mb-3 block">How We Teach</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{a.methodology.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{a.methodology.description}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {a.methodology.lists.map((item: any, idx: number) => (
                <div key={item.id} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {item.id}
                    </div>
                    {idx < a.methodology.lists.length - 1 && (
                      <div className="w-0.5 flex-1 bg-blue-100 dark:bg-blue-900 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.heading}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.paragraph}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
              <Image
                src="https://i.ibb.co/gZjJvXrd/about_image2.jpg"
                alt="Learning Methodology"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] text-sm font-semibold uppercase tracking-widest mb-3 block">Why SkillBridge</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{a.whyUs.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{a.whyUs.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {a.whyUs.cards.map((card: any, idx: number) => {
              const IconComponent = iconMap[card.id]
              const accent = cardAccents[(idx) % cardAccents.length]
              return (
                <div key={card.id} className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border ${accent.border} shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`w-12 h-12 ${accent.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${accent.icon}`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── LEARNING PATHS ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] text-sm font-semibold uppercase tracking-widest mb-3 block">Programs</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{a.learningPaths.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{a.learningPaths.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{a.learningPaths.header}</h3>
              {a.learningPaths.courseLists.map((course: any, idx: number) => {
                const isOrange = course.buttonText === "High Demand"
                return (
                  <div key={idx} className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 shadow-sm hover:shadow-md transition-shadow ${isOrange ? "border-l-orange-400" : "border-l-[#2196F3]"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">{course.courseTitle}</h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${isOrange ? "bg-orange-400" : "bg-[#2196F3]"}`}>
                        {course.buttonText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{course.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {course.reviews}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
              <Image
                src="https://i.ibb.co/mryqG1PX/about-image3.webp"
                alt="Learning Paths"
                width={480}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#2196F3] to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">{a.startJourney.title}</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">{a.startJourney.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-white text-[#2196F3] font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
              {a.startJourney.explore} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
              {a.startJourney.consultation}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
