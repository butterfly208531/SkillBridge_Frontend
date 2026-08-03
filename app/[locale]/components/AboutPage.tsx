"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, Target, Code, Star, CheckCircle, Clock, Trophy, BookOpen, Zap, GraduationCap, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

const iconMap = {
  1: BookOpen,
  2: Users,
  3: Code,
  4: GraduationCap,
  5: Clock,
  6: Trophy,
}

const iconColorMap = {
  1: "#2196F3",
  2: "#22c55e",
  3: "#a855f7",
  4: "#f97316",
  5: "#ef4444",
  6: "#14b8a6",
}

const bgColorMap = {
  1: "rgba(33,150,243,0.1)",
  2: "rgba(34,197,94,0.1)",
  3: "rgba(168,85,247,0.1)",
  4: "rgba(249,115,22,0.1)",
  5: "rgba(239,68,68,0.1)",
  6: "rgba(20,184,166,0.1)",
}

export default function AboutPage() {
  const t = useTranslations()
  const aboutPage = t.raw("aboutPage") as any

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-[#2196F3] text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" /> {aboutPage.title}
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="text-[#2196F3]">{aboutPage.heroText.split(".")[0]}. {aboutPage.heroText.split(".")[1]}.</span>{" "}
                <span className="text-orange-400">{aboutPage.heroText.split(".")[2]}.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10">{aboutPage.description}</p>
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl px-4 py-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-800 dark:text-white">4.8/5</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{aboutPage.ratingText}</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl px-4 py-3">
                  <Trophy className="w-5 h-5 text-[#2196F3]" />
                  <span className="font-semibold text-gray-800 dark:text-white">{aboutPage.jobText}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#2196F3] hover:bg-blue-600 text-white px-8 rounded-xl">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-[#2196F3] text-[#2196F3] hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 rounded-xl">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-3xl blur-xl" />
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center w-80 h-80">
                  <Image
                    src="https://i.ibb.co/ZRYfMLWK/skills.png"
                    alt="SkillBridge Logo"
                    width={140}
                    height={140}
                    className="rounded-full mb-5 ring-4 ring-blue-100 dark:ring-blue-900"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">SkillBridge</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Institute Of Technology</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#2196F3] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {[
            { value: "500+", label: "Students Enrolled" },
            { value: "20+", label: "Expert Instructors" },
            { value: "95%", label: "Job Placement Rate" },
            { value: "10+", label: "Courses Available" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* Our Story */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-3 block">Our Story</span>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">{aboutPage.storyHeading}</h2>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">{aboutPage.storySubheading}</p>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>{aboutPage.storyText1}</p>
                <p>{aboutPage.storyText2}</p>
                <p>{aboutPage.storyText3}</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-3xl -z-10" />
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <Image src="https://i.ibb.co/whBnS4Nh/about_image1.webp" alt="Our Story" width={500} height={400} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-3 block">Purpose</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{aboutPage.purpose.title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{aboutPage.purpose.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 border-[#2196F3] hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#2196F3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2196F3]">{aboutPage.purpose.mission.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{aboutPage.purpose.mission.description}</p>
              <div className="space-y-3">
                {Object.values(aboutPage.purpose.mission.checkPoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#2196F3] flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 border-orange-400 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-orange-500">{aboutPage.purpose.vision.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{aboutPage.purpose.vision.description}</p>
              <div className="space-y-3">
                {Object.values(aboutPage.purpose.vision.checkpoint).map((point: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Methodology */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-3 block">How We Teach</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{aboutPage.methodology.title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{aboutPage.methodology.description}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {aboutPage.methodology.lists.map((item: any, index: number) => (
                <div key={item.id} className="flex gap-5 group">
                  <div className="w-10 h-10 rounded-2xl bg-[#2196F3] flex items-center justify-center flex-shrink-0 mt-1 shadow-md group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.heading}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.paragraph}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl -z-10" />
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-square">
                <Image src="https://i.ibb.co/gZjJvXrd/about_image2.jpg" alt="Learning Methodology" width={500} height={500} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-3 block">Why Us</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{aboutPage.whyUs.title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{aboutPage.whyUs.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutPage.whyUs.cards.map((card: any) => {
              const IconComponent = iconMap[card.id as keyof typeof iconMap]
              const iconColor = iconColorMap[card.id as keyof typeof iconColorMap]
              const bgColor = bgColorMap[card.id as keyof typeof bgColorMap]
              return (
                <div key={card.id} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: bgColor }}>
                    <IconComponent className="w-7 h-7" style={{ color: iconColor }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] font-semibold text-sm uppercase tracking-widest mb-3 block">Programs</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{aboutPage.learningPaths.title}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{aboutPage.learningPaths.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{aboutPage.learningPaths.header}</h3>
              <div className="space-y-5">
                {aboutPage.learningPaths.courseLists.map((course: any, index: number) => {
                  const isOrange = course.buttonText === "High Demand"
                  const accent = isOrange ? "#f97316" : "#2196F3"
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: accent }}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{course.courseTitle}</h4>
                        <span className="text-xs font-bold text-white px-3 py-1 rounded-full ml-3 flex-shrink-0" style={{ backgroundColor: accent }}>{course.buttonText}</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">{course.description}</p>
                      <div className="flex items-center gap-1 text-xs font-medium" style={{ color: accent }}>
                        <Clock className="w-3 h-3" />
                        <span>{course.reviews}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="relative sticky top-24">
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-100 to-blue-100 dark:from-orange-900/20 dark:to-blue-900/20 rounded-3xl -z-10" />
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/5]">
                <Image src="https://i.ibb.co/mryqG1PX/about-image3.webp" alt="Learning Paths" width={480} height={600} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#2196F3] to-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">{aboutPage.startJourney.title}</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">{aboutPage.startJourney.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-[#2196F3] hover:bg-blue-50 font-bold px-10 rounded-xl text-base">
                {aboutPage.startJourney.explore} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-10 rounded-xl text-base bg-transparent">
                {aboutPage.startJourney.consultation}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
