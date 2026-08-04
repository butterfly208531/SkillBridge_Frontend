"use client"

import Image from "next/image"
import { Users, Target, Code, Star, CheckCircle, Clock, Trophy, BookOpen, Zap, GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

// Icon mapping for the cards
const iconMap = {
  1: BookOpen,
  2: Users,
  3: Code,
  4: GraduationCap,
  5: Clock,
  6: Trophy,
}

// Color mapping for the cards
const colorMap = {
  1: "rgba(33, 150, 243, 0.1)",
  2: "rgb(220, 252, 231)", // green-100
  3: "rgb(243, 232, 255)", // purple-100
  4: "rgb(255, 237, 213)", // orange-100
  5: "rgb(254, 226, 226)", // red-100
  6: "rgb(204, 251, 241)", // teal-100
}

const darkColorMap = {
  2: "rgb(20, 83, 45)", // green-900
  3: "rgb(88, 28, 135)", // purple-900
  4: "rgb(154, 52, 18)", // orange-900
  5: "rgb(127, 29, 29)", // red-900
  6: "rgb(19, 78, 74)", // teal-900
}

export default function AboutPage() {
  const t = useTranslations()
  const aboutPage = t.raw("aboutPage") as any

  return (
    <>
      {/* Hero Section */}
      <section className="text-gray-900 dark:text-white py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <Button className="text-sm px-3 py-1 text-white border-0" style={{ backgroundColor: "#2196F3" }}>
                  {aboutPage.title}
                </Button>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span style={{ color: "#2196F3" }}>
                  {aboutPage.heroText.split(".")[0]}. {aboutPage.heroText.split(".")[1]}.
                </span>{" "}
                <span className="text-orange-400">{aboutPage.heroText.split(".")[2]}.</span>
              </h1>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">{aboutPage.description}</p>
              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: "#2196F3" }} />
                  <span style={{ color: "#2196F3" }}>4.8/5 {aboutPage.ratingText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" style={{ color: "#2196F3" }} />
                  <span style={{ color: "#2196F3" }}>{aboutPage.jobText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <div className="items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{aboutPage.storyHeading}</h2>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">{aboutPage.storySubheading}</p>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{aboutPage.storyText1}</p>
                <p>{aboutPage.storyText2}</p>
                <p>{aboutPage.storyText3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 2xl:-mx-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{aboutPage.purpose.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{aboutPage.purpose.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <Card
              className="border-l-4 shadow-sm h-full dark:bg-gray-800 dark:border-gray-700"
              style={{ borderLeftColor: "#2196F3" }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: "rgba(33, 150, 243, 0.1)" }}
                  >
                    <Target className="w-5 h-5" style={{ color: "#2196F3" }} />
                  </div>
                  <CardTitle className="text-2xl dark:text-white" style={{ color: "#2196F3" }}>
                    {aboutPage.purpose.mission.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {aboutPage.purpose.mission.description}
                </p>
                <div className="space-y-3">
                  {Object.values(aboutPage.purpose.mission.checkPoint).map((point: any, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: "#2196F3" }} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                    {aboutPage.purpose.vision.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {aboutPage.purpose.vision.description}
                </p>
                <div className="space-y-3">
                  {Object.values(aboutPage.purpose.vision.checkpoint).map((point: any, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Learning Methodology */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{aboutPage.methodology.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{aboutPage.methodology.description}</p>
          </div>
          <div className="items-center">
            <div className="space-y-8 max-w-4xl mx-auto">
              {aboutPage.methodology.lists.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: "#2196F3" }}
                  >
                    <span className="text-white font-bold text-sm">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white" style={{ color: "#2196F3" }}>
                      {item.heading}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.paragraph}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Students Choose SkillBridge */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900  2xl:-mx-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{aboutPage.whyUs.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{aboutPage.whyUs.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutPage.whyUs.cards.map((card: any) => {
              const IconComponent = iconMap[card.id as keyof typeof iconMap]
              const bgColor = card.id === 1 ? colorMap[1] : colorMap[card.id as keyof typeof colorMap]
              const darkBgColor = card.id === 1 ? colorMap[1] : darkColorMap[card.id as keyof typeof darkColorMap]

              return (
                <Card
                  key={card.id}
                  className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col min-h-[280px]"
                >
                  <CardHeader className="pb-6 flex-shrink-0">
                    <div
                      className={`mx-auto w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${card.id === 1 ? "" : `dark:bg-[${darkBgColor}]`}`}
                      style={{ backgroundColor: bgColor }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color: "oklch(44.6% 0.03 256.802)" }} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Complete Learning Paths */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{aboutPage.learningPaths.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{aboutPage.learningPaths.subtitle}</p>
          </div>
          <div className="items-start">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {aboutPage.learningPaths.header}
              </h3>
              <div className="space-y-6">
                {aboutPage.learningPaths.courseLists.map((course: any, index: number) => {
                  const isOrange = course.buttonText === "High Demand"
                  const borderColor = isOrange ? "#f97316" : "#2196F3"
                  const badgeColor = isOrange ? "#f97316" : "#2196F3"

                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-l-4 h-full dark:border-gray-700"
                      style={{ borderLeftColor: borderColor }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{course.courseTitle}</h4>
                          <Button
                            className="text-xs px-2 py-1 text-white border-0"
                            style={{ backgroundColor: badgeColor }}
                          >
                            {course.buttonText}
                          </Button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                          {course.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3 h-3 mr-1" style={{ color: "oklch(44.6% 0.03 256.802)" }} />
                          <span style={{ color: "oklch(44.6% 0.03 256.802)" }}>{course.reviews}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Your Journey */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 2xl:-mx-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{aboutPage.startJourney.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {aboutPage.startJourney.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-8 py-3 text-base text-white hover:opacity-90"
              style={{ backgroundColor: "#2196F3" }}
            >
              {aboutPage.startJourney.explore}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-base bg-transparent hover:bg-opacity-10 dark:border-gray-600 dark:text-gray-300"
              style={{ borderColor: "#2196F3", color: "#2196F3" }}
            >
              {aboutPage.startJourney.consultation}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
