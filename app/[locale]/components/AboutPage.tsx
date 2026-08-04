"use client"

import { Users, Target, Code, Star, CheckCircle, Clock, Trophy, BookOpen, Zap, GraduationCap, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import Link from "next/link"

const iconMap = {
  1: BookOpen,
  2: Users,
  3: Code,
  4: GraduationCap,
  5: Clock,
  6: Trophy,
}

const iconColors = [
  "#2196F3", "#10b981", "#8b5cf6", "#f97316", "#ef4444", "#14b8a6"
]
const iconBgs = [
  "rgba(33,150,243,0.1)", "rgba(16,185,129,0.1)", "rgba(139,92,246,0.1)",
  "rgba(249,115,22,0.1)", "rgba(239,68,68,0.1)", "rgba(20,184,166,0.1)"
]

export default function AboutPage() {
  const t = useTranslations()
  const aboutPage = t.raw("aboutPage") as any

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-6" style={{ backgroundColor: "#2196F3" }}>
            {aboutPage.title}
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            <span style={{ color: "#2196F3" }}>
              {aboutPage.heroText.split(".")[0]}. {aboutPage.heroText.split(".")[1]}.
            </span>{" "}
            <span className="text-orange-400">{aboutPage.heroText.split(".")[2]}.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            {aboutPage.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">4.8/5 {aboutPage.ratingText}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">{aboutPage.jobText}</span>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, value: "500+", label: "Students" },
            { icon: BookOpen, value: "10+", label: "Courses" },
            { icon: Trophy, value: "95%", label: "Job Rate" },
            { icon: Star, value: "4.8", label: "Rating" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: "#2196F3" }} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-10 rounded-full" style={{ backgroundColor: "#2196F3" }} />
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#2196F3" }}>Our Story</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{aboutPage.storyHeading}</h2>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">{aboutPage.storySubheading}</p>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
            <p className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl border-l-4 border-blue-400">{aboutPage.storyText1}</p>
            <p className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">{aboutPage.storyText2}</p>
            <p className="p-5 bg-orange-50 dark:bg-gray-800 rounded-xl border-l-4 border-orange-400">{aboutPage.storyText3}</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{aboutPage.purpose.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{aboutPage.purpose.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: "#2196F3" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(33,150,243,0.1)" }}>
                  <Target className="w-5 h-5" style={{ color: "#2196F3" }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "#2196F3" }}>{aboutPage.purpose.mission.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{aboutPage.purpose.mission.description}</p>
              <div className="space-y-3">
                {Object.values(aboutPage.purpose.mission.checkPoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#2196F3" }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 border-orange-400 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-orange-500">{aboutPage.purpose.vision.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{aboutPage.purpose.vision.description}</p>
              <div className="space-y-3">
                {Object.values(aboutPage.purpose.vision.checkpoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{aboutPage.methodology.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{aboutPage.methodology.description}</p>
          </div>
          <div className="space-y-6">
            {aboutPage.methodology.lists.map((item: any, i: number) => (
              <div key={item.id} className="flex gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: "#2196F3" }}>
                  <span className="text-white font-bold text-sm">{item.id}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 dark:text-white" style={{ color: "#2196F3" }}>{item.heading}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.paragraph}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{aboutPage.whyUs.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{aboutPage.whyUs.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutPage.whyUs.cards.map((card: any, i: number) => {
              const IconComponent = iconMap[card.id as keyof typeof iconMap]
              return (
                <div key={card.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: iconBgs[i % 6] }}>
                    <IconComponent className="w-7 h-7" style={{ color: iconColors[i % 6] }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{aboutPage.learningPaths.title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{aboutPage.learningPaths.subtitle}</p>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{aboutPage.learningPaths.header}</h3>
          <div className="space-y-4">
            {aboutPage.learningPaths.courseLists.map((course: any, i: number) => {
              const isOrange = course.buttonText === "High Demand"
              const color = isOrange ? "#f97316" : "#2196F3"
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">{course.courseTitle}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: color }}>{course.buttonText}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{course.reviews}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">{aboutPage.startJourney.title}</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">{aboutPage.startJourney.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="px-8 py-3 text-base bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg">
                {aboutPage.startJourney.explore} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-3 text-base border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold">
                {aboutPage.startJourney.consultation}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
